import { cache } from "react";
import prisma from "@/lib/prisma";
import { CUSTOM_FIELD_TYPES } from "@/lib/config/custom-field-types";

export type CustomFieldDto = {
  id: string;
  moduleKey: string;
  fieldKey: string;
  label: string;
  type: "text" | "number" | "date" | "dropdown" | "toggle";
  options: string[];
  required: boolean;
  displayOrder: number;
  isActive: boolean;
};

export { CUSTOM_FIELD_TYPES };

export const getActiveCustomFieldsByModule = cache(async (): Promise<Record<string, CustomFieldDto[]>> => {
  const rows = await prisma.customField.findMany({
    where: { isActive: true },
    orderBy: [{ moduleKey: "asc" }, { displayOrder: "asc" }],
  });

  const grouped: Record<string, CustomFieldDto[]> = {};
  for (const row of rows) {
    if (!grouped[row.moduleKey]) grouped[row.moduleKey] = [];
    grouped[row.moduleKey].push({
      id: row.id,
      moduleKey: row.moduleKey,
      fieldKey: row.fieldKey,
      label: row.label,
      type: (CUSTOM_FIELD_TYPES as readonly string[]).includes(row.type)
        ? (row.type as CustomFieldDto["type"])
        : "text",
      options: Array.isArray(row.options) ? (row.options as string[]) : [],
      required: row.required,
      displayOrder: row.displayOrder,
      isActive: row.isActive,
    });
  }
  return grouped;
});

export async function getActiveCustomFields(moduleKey: string): Promise<CustomFieldDto[]> {
  const map = await getActiveCustomFieldsByModule();
  return map[moduleKey] ?? [];
}
