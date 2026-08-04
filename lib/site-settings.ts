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
        baseColorEnabled: row.baseColorEnabled,
      };
    } catch {
      return DEFAULTS;
    }
  },
  ["site-settings"],
  { revalidate: 60, tags: ["site-settings"] }
);
  