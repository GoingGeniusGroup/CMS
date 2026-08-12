"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { unstable_cache, revalidateTag } from "next/cache";
import { HERO_STAT_ICONS } from "@/lib/content/hero-icons";

/**
 * Read/write layer for the admin-managed list of site icons (Settings > Icons).
 *
 * The list is a `Setting` row keyed `site-icons` holding `{ icons: string[] }`
 * — the exact icon-name keys (from `lib/content/hero-icons.ts`) that admins
 * want to offer in Landing Page / section forms. Reads are publically safe
 * (just names) and cross-request cached like `getSiteContent`; writes are
 * auth-gated and invalidate the cache via tag.
 *
 * If no row exists yet (a fresh install that hasn't run `seed-site-content` /
 * `seed-config`), the full icon pool is returned — and an empty list is
 * persisted once, so the settings page always has something to edit.
 */

const ICONS_SETTING_KEY = "site-icons";

export async function getAllIconNames(): Promise<string[]> {
  return Object.keys(HERO_STAT_ICONS);
}

const getSiteIconsCached = unstable_cache(
  async (): Promise<string[]> => {
    const setting = await prisma.setting.findUnique({
      where: { key: ICONS_SETTING_KEY },
    });
    const data = (setting?.value as { icons?: unknown }) ?? {};
    if (Array.isArray(data.icons)) return data.icons as string[];
    return [];
  },
  ["site-icons"],
  { revalidate: false, tags: ["site-icons"] }
);

/** The enabled icon-name list shown in section-form icon dropdowns. */
export async function getSiteIcons(): Promise<string[]> {
  try {
    const icons = await getSiteIconsCached();
    if (icons.length === 0) {
      const all = await getAllIconNames();
      await prisma.setting.upsert({
        where: { key: ICONS_SETTING_KEY },
        update: { value: { icons: all } },
        create: { key: ICONS_SETTING_KEY, value: { icons: all } },
      });
      return all;
    }
    return icons;
  } catch (error) {
    console.error("Error fetching site icons:", error);
    return await getAllIconNames();
  }
}

/**
 * Persists which icons are enabled for section forms. Names not present in the
 * code registry are silently dropped so the stored list never references an
 * icon that can't actually render.
 */
export async function saveSiteIcons(
  icons: string[]
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const all = new Set(Object.keys(HERO_STAT_ICONS));
  const clean = icons.filter((name) => all.has(name));

  try {
    await prisma.setting.upsert({
      where: { key: ICONS_SETTING_KEY },
      update: { value: { icons: clean } },
      create: { key: ICONS_SETTING_KEY, value: { icons: clean } },
    });
    revalidateTag("site-icons", { expire: 0 });
    return { success: true };
  } catch (error) {
    console.error(`Save setting "${ICONS_SETTING_KEY}" error:`, error);
    return { success: false, error: "Failed to save icons" };
  }
}


// ─── Custom Icons ─────────────────────────────────────────────────────────────
// User-uploaded icons stored as a Setting row keyed "custom-icons" with value
// { icons: Array<{ id: string; name: string; url: string }> }.

const CUSTOM_ICONS_KEY = "custom-icons";

export type CustomIconData = { id: string; name: string; url: string };

const getCustomIconsCached = unstable_cache(
  async (): Promise<CustomIconData[]> => {
    const setting = await prisma.setting.findUnique({
      where: { key: CUSTOM_ICONS_KEY },
    });
    const data = (setting?.value as { icons?: unknown }) ?? {};
    if (Array.isArray(data.icons)) return data.icons as CustomIconData[];
    return [];
  },
  ["custom-icons"],
  { revalidate: false, tags: ["custom-icons"] }
);

/** Fetch all custom icons uploaded by the admin. */
export async function getCustomIcons(): Promise<CustomIconData[]> {
  try {
    return await getCustomIconsCached();
  } catch (error) {
    console.error("Error fetching custom icons:", error);
    return [];
  }
}

/** Save the full custom icons list (add/reorder). */
export async function saveCustomIcons(
  icons: CustomIconData[]
): Promise<{ success: boolean; error?: string; icons?: CustomIconData[] }> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.setting.upsert({
      where: { key: CUSTOM_ICONS_KEY },
      update: { value: { icons } },
      create: { key: CUSTOM_ICONS_KEY, value: { icons } },
    });
    revalidateTag("custom-icons", { expire: 0 });
    return { success: true, icons };
  } catch (error) {
    console.error(`Save custom icons error:`, error);
    return { success: false, error: "Failed to save custom icons" };
  }
}

/** Delete a single custom icon by id. */
export async function deleteCustomIcon(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const current = await getCustomIcons();
    const updated = current.filter((i) => i.id !== id);
    await prisma.setting.upsert({
      where: { key: CUSTOM_ICONS_KEY },
      update: { value: { icons: updated } },
      create: { key: CUSTOM_ICONS_KEY, value: { icons: updated } },
    });
    revalidateTag("custom-icons", { expire: 0 });
    return { success: true };
  } catch (error) {
    console.error(`Delete custom icon error:`, error);
    return { success: false, error: "Failed to delete icon" };
  }
}
