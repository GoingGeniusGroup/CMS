"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

const SETTING_KEY = "tag-vocabularies";

export type TagVocabularies = Record<string, string[]>;

/**
 * Tag vocabularies are stored as a single JSON blob in the generic Setting
 * table, keyed by module (e.g. "project", "service"). This avoids a schema
 * migration while still giving admins a per-module tag list they can manage
 * from Settings and reference when tagging records.
 */
export async function getTagVocabularies(): Promise<TagVocabularies> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const setting = await prisma.setting.findUnique({ where: { key: SETTING_KEY } });
  return (setting?.value as TagVocabularies) ?? {};
}

export async function getTagsForModule(moduleKey: string): Promise<string[]> {
  const setting = await prisma.setting.findUnique({ where: { key: SETTING_KEY } });
  const all = (setting?.value as TagVocabularies) ?? {};
  return all[moduleKey] ?? [];
}

export async function addTag(moduleKey: string, tag: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const trimmed = tag.trim();
  if (!trimmed) return { success: false, error: "Tag cannot be empty" };

  try {
    const setting = await prisma.setting.findUnique({ where: { key: SETTING_KEY } });
    const all = ((setting?.value as TagVocabularies) ?? {});
    const existing = all[moduleKey] ?? [];

    if (existing.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      return { success: false, error: "This tag already exists" };
    }

    const updated: TagVocabularies = { ...all, [moduleKey]: [...existing, trimmed] };

    await prisma.setting.upsert({
      where: { key: SETTING_KEY },
      update: { value: updated },
      create: { key: SETTING_KEY, value: updated },
    });

    return { success: true, tags: updated[moduleKey] };
  } catch (error) {
    console.error("Add tag error:", error);
    return { success: false, error: "Failed to add tag" };
  }
}

export async function removeTag(moduleKey: string, tag: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const setting = await prisma.setting.findUnique({ where: { key: SETTING_KEY } });
    const all = ((setting?.value as TagVocabularies) ?? {});
    const existing = all[moduleKey] ?? [];
    const updated: TagVocabularies = { ...all, [moduleKey]: existing.filter((t) => t !== tag) };

    await prisma.setting.upsert({
      where: { key: SETTING_KEY },
      update: { value: updated },
      create: { key: SETTING_KEY, value: updated },
    });

    return { success: true };
  } catch (error) {
    console.error("Remove tag error:", error);
    return { success: false, error: "Failed to remove tag" };
  }
}
