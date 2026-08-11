"use server";

import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

/** Public: fetch technology logos — no auth needed. Cross-request cached (read on
 * the home page); invalidated via the "technologies-logos" tag, which
 * `saveSetting("technologies-logos", ...)` triggers on save. */
const getPublicTechnologiesCached = unstable_cache(
  async (): Promise<{ technologies: string[]; bgColor: string; textColor: string }> => {
    const setting = await prisma.setting.findUnique({
      where: { key: "technologies-logos" },
    });
    if (!setting) return { technologies: [], bgColor: "#ffffff", textColor: "#18181b" };
    const data = setting.value as { technologies?: string[]; bgColor?: string; textColor?: string };
    return {
      technologies: data.technologies ?? [],
      bgColor: data.bgColor || "#ffffff",
      textColor: data.textColor || "#18181b",
    };
  },
  ["public-technologies"],
  { revalidate: 60, tags: ["technologies-logos"] }
);

export async function getPublicTechnologies(): Promise<string[]> {
  try {
    const data = await getPublicTechnologiesCached();
    return data.technologies;
  } catch {
    return [];
  }
}

export async function getPublicTechnologiesWithColors(): Promise<{ technologies: string[]; bgColor: string; textColor: string }> {
  try {
    return await getPublicTechnologiesCached();
  } catch {
    return { technologies: [], bgColor: "#ffffff", textColor: "#18181b" };
  }
}
