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
  baseColorEnabled: true,
};

/**
 * Fetch site settings from DB. No auth required — used by public pages.
 * Returns defaults if no settings are configured.
 *
 * Cross-request cached via the Data Cache: these drive the site name, logo,
 * favicon, and theme on every public page (layout + generateMetadata), and
 * change only when an admin saves General Settings. Invalidated via the
 * "site-settings" tag in `saveGeneralSettings`. The 60s TTL is a safety net
 * for out-of-band DB edits; in-app writes invalidate immediately.
 */
export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    try {
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
        baseColorEnabled: row.baseColorEnabled,
      };
    } catch {
      return DEFAULTS;
    }
  },
  ["site-settings"],
  { revalidate: 60, tags: ["site-settings"] }
);
