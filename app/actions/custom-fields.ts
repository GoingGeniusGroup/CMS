"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { CUSTOM_FIELD_TYPES } from "@/lib/custom-fields";
import { getProfileConfig } from "@/lib/config/industry-profiles";
import { MODULE_KEYS } from "@/lib/config/modules";
import { z } from "zod";

export type CustomFieldInput = {
  id?: string;
  moduleKey: string;
  fieldKey: string;
  label: string;
  type: string;
  options: string[];
  required: boolean;
  displayOrder: number;
  isActive: boolean;
};

const fieldSchema = z.object({
  moduleKey: z.string().min(1),
  fieldKey: z.string().min(1),
  label: z.string().min(1, "Label is required"),
  type: z.enum(CUSTOM_FIELD_TYPES),
  options: z.array(z.string()).default([]),
  required: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function getCustomFieldsForAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const rows = await prisma.customField.findMany({
    orderBy: [{ moduleKey: "asc" }, { displayOrder: "asc" }],
  });

  return rows.map((row) => ({
    id: row.id,
    moduleKey: row.moduleKey,
    fieldKey: row.fieldKey,
    label: row.label,
    type: row.type,
    options: Array.isArray(row.options) ? (row.options as string[]) : [],
    required: row.required,
    displayOrder: row.displayOrder,
    isActive: row.isActive,
  }));
}

export async function saveCustomField(data: CustomFieldInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = fieldSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? "Invalid field" };
  }

  try {
    const parsed = result.data;
    const payload = {
      moduleKey: parsed.moduleKey,
      fieldKey: parsed.fieldKey,
      label: parsed.label,
      type: parsed.type,
      options: parsed.options,
      required: parsed.required,
      displayOrder: parsed.displayOrder,
      isActive: parsed.isActive,
    };

    if (parsed.type !== "dropdown") {
      payload.options = [];
    }

    if (data.id) {
      await prisma.customField.update({ where: { id: data.id }, data: payload });
      return { success: true, id: data.id };
    } else {
      const created = await prisma.customField.create({ data: payload });
      return { success: true, id: created.id };
    }
    return { success: true };
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2002") {
      return { success: false, error: "A field with this key already exists for this module" };
    }
    console.error("saveCustomField error:", err);
    return { success: false, error: "Failed to save custom field" };
  }
}

export async function deleteCustomField(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.customField.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    console.error("deleteCustomField error:", err);
    return { success: false, error: "Failed to delete custom field" };
  }
}

export async function setCustomFieldActive(id: string, isActive: boolean) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.customField.update({ where: { id }, data: { isActive } });
    return { success: true };
  } catch (err) {
    console.error("setCustomFieldActive error:", err);
    return { success: false, error: "Failed to update custom field" };
  }
}

export async function reorderCustomField(id: string, direction: "up" | "down") {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const current = await prisma.customField.findUnique({ where: { id } });
    if (!current) return { success: false, error: "Field not found" };

    const siblings = await prisma.customField.findMany({
      where: { moduleKey: current.moduleKey },
      orderBy: [{ displayOrder: "asc" }],
    });

    const index = siblings.findIndex((s) => s.id === id);
    const swapWith = direction === "up" ? siblings[index - 1] : siblings[index + 1];
    if (!swapWith) return { success: true };

    await prisma.$transaction([
      prisma.customField.update({ where: { id }, data: { displayOrder: swapWith.displayOrder } }),
      prisma.customField.update({ where: { id: swapWith.id }, data: { displayOrder: current.displayOrder } }),
    ]);
    return { success: true };
  } catch (err) {
    console.error("reorderCustomField error:", err);
    return { success: false, error: "Failed to reorder custom field" };
  }
}

/**
 * Seeds the suggested custom fields for a module from the current industry
 * profile as INACTIVE entries so admins can activate them with one click.
 * Existing field keys are left untouched (never overwrites admin work).
 */
export async function loadSuggestedCustomFields(moduleKey: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const general = await prisma.generalSetting.findFirst();
    const profileName = general?.industryProfile || "Generic";
    const config = getProfileConfig(profileName);
    const suggestions = config.customFields?.[moduleKey] ?? [];

    let added = 0;
    for (const suggestion of suggestions) {
      const exists = await prisma.customField.findUnique({
        where: { moduleKey_fieldKey: { moduleKey, fieldKey: suggestion.fieldKey } },
      });
      if (exists) continue;

      const maxOrder = await prisma.customField.aggregate({
        where: { moduleKey },
        _max: { displayOrder: true },
      });

      await prisma.customField.create({
        data: {
          moduleKey,
          fieldKey: suggestion.fieldKey,
          label: suggestion.label,
          type: suggestion.type,
          options: suggestion.options ?? [],
          required: suggestion.required ?? false,
          displayOrder: (maxOrder._max.displayOrder ?? -1) + 1,
          isActive: false,
        },
      });
      added += 1;
    }
    return { success: true, added };
  } catch (err) {
    console.error("loadSuggestedCustomFields error:", err);
    return { success: false, error: "Failed to load suggested fields" };
  }
}

export async function getAllCustomFieldValues(recordId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const rows = await prisma.customFieldValue.findMany({
    where: { recordId },
    include: { customField: true },
  });

  return rows.map((row) => ({
    fieldId: row.customFieldId,
    fieldKey: row.customField.fieldKey,
    recordId: row.recordId,
    value: row.value,
  }));
}

/**
 * Upserts custom field values for a record within a module. Returns the
 * created/updated entries. Value is stored as JSON. Empty values are skipped
 * so no empty rows accumulate.
 */
export async function saveCustomFieldValues(
  moduleKey: string,
  recordId: string,
  values: Record<string, string | number | boolean | null | undefined>
) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const activeFields = await prisma.customField.findMany({
      where: { isActive: true, moduleKey },
    });

    for (const field of activeFields) {
      const value = values?.[field.fieldKey];
      if (value === undefined || value === null || value === "") continue;

      await prisma.customFieldValue.upsert({
        where: { customFieldId_recordId: { customFieldId: field.id, recordId } },
        update: { value: value as never },
        create: { customFieldId: field.id, recordId, value: value as never },
      });
    }
    return { success: true };
  } catch (err) {
    console.error("saveCustomFieldValues error:", err);
    return { success: false, error: "Failed to save custom field values" };
  }
}

export async function getModuleKeysForAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return [...MODULE_KEYS];
}

export async function getActiveCustomFieldsForModule(moduleKey: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const rows = await prisma.customField.findMany({
    where: { moduleKey, isActive: true },
    orderBy: [{ displayOrder: "asc" }],
  });

  return rows.map((row) => ({
    id: row.id,
    moduleKey: row.moduleKey,
    fieldKey: row.fieldKey,
    label: row.label,
    type: row.type,
    options: Array.isArray(row.options) ? (row.options as string[]) : [],
    required: row.required,
    displayOrder: row.displayOrder,
    isActive: row.isActive,
  }));
}

export async function getCustomFieldValuesForRecord(recordId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const rows = await prisma.customFieldValue.findMany({
    where: { recordId },
    include: { customField: true },
  });

  const values: Record<string, string | number | boolean | null> = {};
  for (const row of rows) {
    const v = row.value;
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean" || v === null) {
      values[row.customField.fieldKey] = v;
    }
  }
  return values;
}
