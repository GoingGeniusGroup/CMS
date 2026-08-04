"use server";

import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

/** Public: fetch technology logos — no auth needed. Cross-request cached (read on
 * the home page); invalidated via the "technologies-logos" tag, which
 * `saveSetting("technologies-logos", ...)` triggers on save. */
const getPublicTechnologiesCached = unstable_cache(
  async (): Promise<string[]> => {
    const setting = await prisma.setting.findUnique({
      where: { key: "technologies-logos" },
    });
    if (!setting) return [];
    const data = setting.value as { technologies?: string[] };
    return data.technologies ?? [];
  },
  ["public-technologies"],
  { revalidate: 60, tags: ["technologies-logos"] }
);

export async function getPublicTechnologies(): Promise<string[]> {
  try {
    return await getPublicTechnologiesCached();
  } catch {
    return [];
  }
}
