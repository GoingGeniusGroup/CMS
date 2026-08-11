import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export type SiteSettings = {
  siteName: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  metaKeywords: string;
  themeColor: string;
  themeTextColor: string;
  lightThemeColor: string;
  lightThemeTextColor: string;
  darkThemeColor: string;
  darkThemeTextColor: string;
  clientThemeMode: "system" | "light" | "dark";
  baseColorEnabled: boolean;
};

const DEFAULTS: SiteSettings = {
  siteName: "Going Genius",
  description: "We build world-class digital products, services, and experiences.",
  logoUrl: "/logo1.png",
  faviconUrl: "/favicon.ico",
  metaKeywords: "",
  themeColor: "#fe9a00",
  themeTextColor: "#ffffff",
  lightThemeColor: "#fe9a00",
  lightThemeTextColor: "#000000",
  darkThemeColor: "#fbbf24",
  darkThemeTextColor: "#18181b",
  clientThemeMode: "system",
  baseColorEnabled: true,
};

/**
 * Cross-request cached via the Data Cache: these drive the site name, logo,
 * favicon, and theme on every public page (layout + generateMetadata), and
 * change only when an admin saves General Settings. Invalidated via the
 * "site-settings" tag in `saveGeneralSettings`. The 60s TTL is a safety net
 * for out-of-band DB edits; in-app writes invalidate immediately.
 *
 * IMPORTANT: DB errors must propagate out of this function. If they were
 * caught in here and turned into DEFAULTS, that fallback would be written to
 * the Data Cache and served for the full 60s TTL — one transient connection
 * hiccup would flip the whole public site to the default yellow theme and
 * default favicon until the TTL lapsed. The fallback lives in the exported
 * wrapper below instead, so a failure is never cached and the next request
 * retries the DB.
 */
const getSiteSettingsCached = unstable_cache(
  async (): Promise<SiteSettings> => {
    const row = await prisma.generalSetting.findFirst();
    if (!row) return DEFAULTS;

    return {
      siteName: row.siteName || DEFAULTS.siteName,
      description: row.description || DEFAULTS.description,
      logoUrl: row.logoUrl || DEFAULTS.logoUrl,
      faviconUrl: row.faviconUrl || DEFAULTS.faviconUrl,
      metaKeywords: row.metaKeywords || DEFAULTS.metaKeywords,
      themeColor: row.themeColor || DEFAULTS.themeColor,
      themeTextColor: row.themeTextColor || DEFAULTS.themeTextColor,
      lightThemeColor: row.lightThemeColor || row.themeColor || DEFAULTS.lightThemeColor,
      lightThemeTextColor: row.lightThemeTextColor || row.themeTextColor || DEFAULTS.lightThemeTextColor,
      darkThemeColor: row.darkThemeColor || DEFAULTS.darkThemeColor,
      darkThemeTextColor: row.darkThemeTextColor || DEFAULTS.darkThemeTextColor,
      clientThemeMode:
        row.clientThemeMode === "system" ||
        row.clientThemeMode === "light" ||
        row.clientThemeMode === "dark"
          ? row.clientThemeMode
          : DEFAULTS.clientThemeMode,
      baseColorEnabled: row.baseColorEnabled,
    };
  },
  ["site-settings"],
  { revalidate: 60, tags: ["site-settings"] }
);

/**
 * Fetch site settings from DB. No auth required — used by public pages.
 * Falls back to defaults only for the current request if the DB read fails,
 * without persisting that fallback into the Data Cache.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    return await getSiteSettingsCached();
  } catch (error) {
    console.error("getSiteSettings error (serving defaults for this request):", error);
    return DEFAULTS;
  }
}
