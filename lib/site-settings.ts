import prisma from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

export type SiteSettings = {
  siteName: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  metaKeywords: string;
  themeColor: string;
  baseColorEnabled: boolean;
};

const DEFAULTS: SiteSettings = {
  siteName: "Going Genius",
  description: "We build world-class digital products, services, and experiences.",
  logoUrl: "/logo1.png",
  faviconUrl: "/favicon.ico",
  metaKeywords: "",
  themeColor: "#6366f1",
  baseColorEnabled: true,
};

/**
 * Fetch site settings from DB. No auth required — used by public pages.
 * Returns defaults if no settings are configured.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  noStore(); // Prevent caching — always fetch fresh from DB
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
      baseColorEnabled: row.baseColorEnabled,
    };
  } catch {
    return DEFAULTS;
  }
}
