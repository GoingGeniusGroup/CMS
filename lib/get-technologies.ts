import prisma from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

/**
 * Fetch technology logos from DB. No auth required — used by public pages.
 * Returns an empty array if nothing is configured.
 */
export async function getTechnologies(): Promise<string[]> {
  noStore();
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
