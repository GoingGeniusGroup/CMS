import { cache } from "react";
import prisma from "@/lib/prisma";
import { DEFAULT_STATUS_OPTIONS, type StatusOptionSeed } from "./config/status-options";

export type StatusOptionDto = {
  id: string;
  moduleKey: string;
  statusValue: string;
  label: string;
  color: string;
  sortOrder: number;
  isDefault: boolean;
  isActive: boolean;
};

function seedToDto(moduleKey: string, seed: StatusOptionSeed, index: number): StatusOptionDto {
  return {
    id: `seed-${moduleKey}-${seed.statusValue}`,
    moduleKey,
    statusValue: seed.statusValue,
    label: seed.label ?? seed.statusValue,
    color: seed.color,
    sortOrder: index,
    isDefault: Boolean(seed.isDefault),
    isActive: true,
  };
}

export type StatusOptionsMap = Record<string, StatusOptionDto[]>;

export const getStatusOptionsMap = cache(async (): Promise<StatusOptionsMap> => {
  const map: StatusOptionsMap = {};
  for (const [moduleKey, seeds] of Object.entries(DEFAULT_STATUS_OPTIONS)) {
    map[moduleKey] = seeds.map((seed, i) => seedToDto(moduleKey, seed, i));
  }

  const rows = await prisma.statusOption.findMany({
    orderBy: [{ moduleKey: "asc" }, { sortOrder: "asc" }],
  });

  if (rows.length === 0) return map;

  const grouped: Record<string, StatusOptionDto[]> = {};
  for (const row of rows) {
    if (!grouped[row.moduleKey]) grouped[row.moduleKey] = [];
    grouped[row.moduleKey].push({
      id: row.id,
      moduleKey: row.moduleKey,
      statusValue: row.statusValue,
      label: row.label,
      color: row.color,
      sortOrder: row.sortOrder,
      isDefault: row.isDefault,
      isActive: row.isActive,
    });
  }

  for (const [moduleKey, list] of Object.entries(grouped)) {
    map[moduleKey] = list;
  }

  return map;
});

export async function getModuleStatusOptions(moduleKey: string): Promise<StatusOptionDto[]> {
  const map = await getStatusOptionsMap();
  return (map[moduleKey] ?? []).filter((o) => o.isActive);
}

export async function getStatusDisplay(
  moduleKey: string,
  statusValue: string
): Promise<{ label: string; color: string } | null> {
  const map = await getStatusOptionsMap();
  const option = (map[moduleKey] ?? []).find((o) => o.statusValue === statusValue && o.isActive);
  if (!option) return null;
  return { label: option.label, color: option.color };
}
