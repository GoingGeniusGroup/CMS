import prisma from "@/lib/prisma";
import { cache } from "react";

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
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
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
});
  