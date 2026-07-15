"use server";

import prisma from "@/lib/prisma";

/** Public: fetch technology logos — no auth needed. */
export async function getPublicTechnologies(): Promise<string[]> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "technologies-logos" },
    });
    if (!setting) return [];
    const data = setting.value as { technologies?: string[] };
    return data.technologies ?? [];
  } catch {
    return [];
  }
}
