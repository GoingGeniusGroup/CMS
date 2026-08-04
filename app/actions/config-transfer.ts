"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath, updateTag } from "next/cache";

/**
 * Export/Import the full configuration layer as a single portable JSON
 * document: entity labels, custom field definitions, status workflows,
 * departments, and tag vocabularies. Used by Settings > Import/Export Config
 * to move a configuration profile between environments (e.g. staging → prod)
 * or to back up customization before switching industry profiles.
 *
 * Deliberately excludes business data (customers, projects, invoices, etc.) —
 * this is configuration-only, never records.
 */

export type ConfigExport = {
  version: 1;
  exportedAt: string;
  generalSettings: {
    industryProfile: string;
    currency: string;
    currencySymbol: string;
    dateFormat: string;
    numberFormat: string;
  } | null;
  labelOverrides: Array<{ entityKey: string; singular: string; plural: string }>;
  customFields: Array<{
    moduleKey: string;
    fieldKey: string;
    label: string;
    type: string;
    options: unknown;
    required: boolean;
    displayOrder: number;
    isActive: boolean;
  }>;
  statusOptions: Array<{
    moduleKey: string;
    statusValue: string;
    label: string;
    color: string;
    sortOrder: number;
    isDefault: boolean;
    isActive: boolean;
  }>;
  departments: Array<{ name: string; order: number }>;
  tagVocabularies: Record<string, string[]>;
};

export async function exportConfig(): Promise<ConfigExport> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [general, labelOverrides, customFields, statusOptions, departments, tagSetting] =
    await Promise.all([
      prisma.generalSetting.findFirst(),
      prisma.labelOverride.findMany(),
      prisma.customField.findMany(),
      prisma.statusOption.findMany(),
      prisma.department.findMany({ orderBy: { order: "asc" } }),
      prisma.setting.findUnique({ where: { key: "tag-vocabularies" } }),
    ]);

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    generalSettings: general
      ? {
          industryProfile: general.industryProfile,
          currency: general.currency,
          currencySymbol: general.currencySymbol,
          dateFormat: general.dateFormat,
          numberFormat: general.numberFormat,
        }
      : null,
    labelOverrides: labelOverrides.map((l) => ({
      entityKey: l.entityKey,
      singular: l.singular,
      plural: l.plural,
    })),
    customFields: customFields.map((f) => ({
      moduleKey: f.moduleKey,
      fieldKey: f.fieldKey,
      label: f.label,
      type: f.type,
      options: f.options,
      required: f.required,
      displayOrder: f.displayOrder,
      isActive: f.isActive,
    })),
    statusOptions: statusOptions.map((s) => ({
      moduleKey: s.moduleKey,
      statusValue: s.statusValue,
      label: s.label,
      color: s.color,
      sortOrder: s.sortOrder,
      isDefault: s.isDefault,
      isActive: s.isActive,
    })),
    departments: departments.map((d) => ({ name: d.name, order: d.order })),
    tagVocabularies: (tagSetting?.value as Record<string, string[]>) ?? {},
  };
}

export type ImportResult = {
  success: boolean;
  error?: string;
  summary?: {
    labelOverrides: number;
    customFields: number;
    statusOptions: number;
    departments: number;
    tagModules: number;
  };
};

/**
 * Imports a previously exported config JSON. Uses upsert semantics
 * throughout, so importing is safe to re-run and never duplicates rows.
 * Does not touch business data.
 */
export async function importConfig(data: unknown): Promise<ImportResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  if (!data || typeof data !== "object" || (data as ConfigExport).version !== 1) {
    return { success: false, error: "Invalid or unsupported config file" };
  }

  const config = data as ConfigExport;

  try {
    let labelCount = 0;
    for (const l of config.labelOverrides ?? []) {
      await prisma.labelOverride.upsert({
        where: { entityKey: l.entityKey },
        update: { singular: l.singular, plural: l.plural },
        create: { entityKey: l.entityKey, singular: l.singular, plural: l.plural },
      });
      labelCount += 1;
    }

    let fieldCount = 0;
    for (const f of config.customFields ?? []) {
      await prisma.customField.upsert({
        where: { moduleKey_fieldKey: { moduleKey: f.moduleKey, fieldKey: f.fieldKey } },
        update: {
          label: f.label,
          type: f.type,
          options: f.options as never,
          required: f.required,
          displayOrder: f.displayOrder,
          isActive: f.isActive,
        },
        create: {
          moduleKey: f.moduleKey,
          fieldKey: f.fieldKey,
          label: f.label,
          type: f.type,
          options: f.options as never,
          required: f.required,
          displayOrder: f.displayOrder,
          isActive: f.isActive,
        },
      });
      fieldCount += 1;
    }

    let statusCount = 0;
    for (const s of config.statusOptions ?? []) {
      await prisma.statusOption.upsert({
        where: { moduleKey_statusValue: { moduleKey: s.moduleKey, statusValue: s.statusValue } },
        update: {
          label: s.label,
          color: s.color,
          sortOrder: s.sortOrder,
          isDefault: s.isDefault,
          isActive: s.isActive,
        },
        create: {
          moduleKey: s.moduleKey,
          statusValue: s.statusValue,
          label: s.label,
          color: s.color,
          sortOrder: s.sortOrder,
          isDefault: s.isDefault,
          isActive: s.isActive,
        },
      });
      statusCount += 1;
    }

    let deptCount = 0;
    for (const d of config.departments ?? []) {
      await prisma.department.upsert({
        where: { name: d.name },
        update: { order: d.order },
        create: { name: d.name, order: d.order },
      });
      deptCount += 1;
    }

    const tagModuleCount = Object.keys(config.tagVocabularies ?? {}).length;
    if (tagModuleCount > 0) {
      await prisma.setting.upsert({
        where: { key: "tag-vocabularies" },
        update: { value: config.tagVocabularies },
        create: { key: "tag-vocabularies", value: config.tagVocabularies },
      });
    }

    if (config.generalSettings) {
      const existing = await prisma.generalSetting.findFirst();
      if (existing) {
        await prisma.generalSetting.update({
          where: { id: existing.id },
          data: config.generalSettings,
        });
      } else {
        await prisma.generalSetting.create({ data: config.generalSettings });
      }
    }

    updateTag('entity-labels');
    revalidatePath("/", "layout");

    return {
      success: true,
      summary: {
        labelOverrides: labelCount,
        customFields: fieldCount,
        statusOptions: statusCount,
        departments: deptCount,
        tagModules: tagModuleCount,
      },
    };
  } catch (error) {
    console.error("Import config error:", error);
    return { success: false, error: "Failed to import configuration" };
  }
}
