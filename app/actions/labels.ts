"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { getEntityLabelsMap } from "@/lib/entity-labels";
import { ENTITY_KEYS, type EntityKey } from "@/lib/config/entity-labels";

export type EntityLabelInput = {
  entityKey: string;
  singular: string;
  plural: string;
};

export async function getEntityLabels() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const map = await getEntityLabelsMap();
  return ENTITY_KEYS.map((key) => ({
    entityKey: key,
    singular: map[key]?.singular ?? key,
    plural: map[key]?.plural ?? `${key}s`,
  }));
}

export async function saveEntityLabels(data: EntityLabelInput[]) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    for (const item of data) {
      const singular = (item.singular ?? "").trim();
      const plural = (item.plural ?? "").trim();
      if (!singular || !plural) continue;

      await prisma.labelOverride.upsert({
        where: { entityKey: item.entityKey },
        update: { singular, plural },
        create: {
          entityKey: item.entityKey,
          singular,
          plural,
        },
      });
    }
    return { success: true };
  } catch (err) {
    console.error("saveEntityLabels error:", err);
    return { success: false, error: "Failed to save entity labels" };
  }
}

export async function resetEntityLabel(entityKey: EntityKey) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.labelOverride.deleteMany({ where: { entityKey } });
    return { success: true };
  } catch (err) {
    console.error("resetEntityLabel error:", err);
    return { success: false, error: "Failed to reset label" };
  }
}
