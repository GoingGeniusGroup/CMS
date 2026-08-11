"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { unstable_cache, revalidateTag } from "next/cache";

export async function getSetting(key: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value ?? null;
}

export async function saveSetting(key: string, value: unknown) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    // Clean the value — ensure it's a proper JSON-serializable object
    const cleanValue = JSON.parse(JSON.stringify(value ?? {}));

    await prisma.setting.upsert({
      where: { key },
      update: { value: cleanValue },
      create: { key, value: cleanValue },
    });
    // Invalidate any public Data Cache keyed by this setting's key (e.g. the
    // "partners-logos" / "technologies-logos" caches read on the home page).
    revalidateTag(key, { expire: 0 });
    return { success: true };
  } catch (error) {
    console.error(`Save setting "${key}" error:`, error);
    return { success: false, error: "Failed to save settings" };
  }
}

// ─── Public partner logos (no auth) ──────────────────────────────────────────

/**
 * Returns the website header settings (sticky, banner, etc.)
 * No authentication required — safe to call from public pages.
 */
export async function getPublicHeaderSettings() {
  const setting = await prisma.setting.findUnique({
    where: { key: "website-header" },
  });
  const data = (setting?.value as {
    stickyHeader?: boolean;
    bannerImageUrl?: string;
    bannerLink?: string;
    helpNumber?: string;
  }) ?? {};
  return {
    stickyHeader: data.stickyHeader ?? true,
    bannerImageUrl: data.bannerImageUrl || null,
    bannerLink: data.bannerLink || null,
    helpNumber: data.helpNumber || null,
  };
}

/**
 * Returns the array of partner logo URLs saved by the admin.
 * No authentication required — safe to call from public pages.
 */
const getPublicPartnersCached = unstable_cache(
  async (): Promise<{ partners: string[]; bgColor: string; textColor: string }> => {
    const setting = await prisma.setting.findUnique({
      where: { key: "partners-logos" },
    });
    const data = (setting?.value as { partners?: string[]; bgColor?: string; textColor?: string }) ?? {};
    return {
      partners: Array.isArray(data.partners) ? data.partners : [],
      bgColor: data.bgColor || "#09090b",
      textColor: data.textColor || "#a1a1aa",
    };
  },
  ["public-partners"],
  { revalidate: 60, tags: ["partners-logos"] }
);

export async function getPublicPartners(): Promise<string[]> {
  const data = await getPublicPartnersCached();
  return data.partners;
}

export async function getPublicPartnersWithColors(): Promise<{ partners: string[]; bgColor: string; textColor: string }> {
  return getPublicPartnersCached();
}
