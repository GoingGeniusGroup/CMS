import { cache } from "react";
import prisma from "@/lib/prisma";
import { DEFAULT_ENTITY_LABELS, type EntityKey, type EntityLabels } from "./config/entity-labels";

export type LabelsMap = Record<string, EntityLabels>;

export const getEntityLabelsMap = cache(async (): Promise<LabelsMap> => {
  const map: LabelsMap = { ...DEFAULT_ENTITY_LABELS };
  const overrides = await prisma.labelOverride.findMany();
  for (const override of overrides) {
    map[override.entityKey] = {
      singular: override.singular,
      plural: override.plural,
    };
  }
  return map;
});

export async function getEntityLabel(
  entityKey: string,
  opts?: { plural?: boolean; fallback?: string }
): Promise<string> {
  const map = await getEntityLabelsMap();
  const entry = map[entityKey];
  if (entry) return opts?.plural ? entry.plural : entry.singular;
  return opts?.fallback ?? entityKey;
}

export function isValidEntityKey(key: string): key is EntityKey {
  return key in DEFAULT_ENTITY_LABELS;
}
