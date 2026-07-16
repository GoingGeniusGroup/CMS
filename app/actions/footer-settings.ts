"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export type SocialEntry = { platform: string; url: string };
export type LinkColumn = { title: string; links: { label: string; href: string }[] };

export type FooterSettingData = {
  footerLogoUrl: string;
  brandText: string;
  aboutDesc: string;
  copyrightText: string;
  playStoreLink: string;
  appStoreLink: string;
  paymentLogoUrl: string;
  socials: SocialEntry[];
  linkColumns: LinkColumn[];
};

const DEFAULTS: FooterSettingData = {
  footerLogoUrl: "",
  brandText: "Going Genius Group of Companies",
  aboutDesc: "",
  copyrightText: "",
  playStoreLink: "",
  appStoreLink: "",
  paymentLogoUrl: "",
  socials: [],
  linkColumns: [],
};

// ─── Public (no auth) ────────────────────────────────────────────────────────

export async function getPublicFooterSettings(): Promise<FooterSettingData> {
  const row = await prisma.footerSetting.findFirst();
  if (!row) return DEFAULTS;
  return {
    footerLogoUrl: row.footerLogoUrl || "",
    brandText: row.brandText || "Going Genius Group of Companies",
    aboutDesc: row.aboutDesc || "",
    copyrightText: row.copyrightText || "",
    playStoreLink: row.playStoreLink || "",
    appStoreLink: row.appStoreLink || "",
    paymentLogoUrl: row.paymentLogoUrl || "",
    socials: (row.socials as SocialEntry[]) ?? [],
    linkColumns: (row.linkColumns as LinkColumn[]) ?? [],
  };
}

// ─── Admin (auth required) ───────────────────────────────────────────────────

export async function getFooterSettings(): Promise<FooterSettingData> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const row = await prisma.footerSetting.findFirst();
  if (!row) return DEFAULTS;
  return {
    footerLogoUrl: row.footerLogoUrl || "",
    brandText: row.brandText || "Going Genius Group of Companies",
    aboutDesc: row.aboutDesc || "",
    copyrightText: row.copyrightText || "",
    playStoreLink: row.playStoreLink || "",
    appStoreLink: row.appStoreLink || "",
    paymentLogoUrl: row.paymentLogoUrl || "",
    socials: (row.socials as SocialEntry[]) ?? [],
    linkColumns: (row.linkColumns as LinkColumn[]) ?? [],
  };
}

export async function saveFooterSettings(data: FooterSettingData) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const existing = await prisma.footerSetting.findFirst();
    const payload = {
      footerLogoUrl: data.footerLogoUrl || "",
      brandText: data.brandText || "",
      aboutDesc: data.aboutDesc || "",
      copyrightText: data.copyrightText || "",
      playStoreLink: data.playStoreLink || "",
      appStoreLink: data.appStoreLink || "",
      paymentLogoUrl: data.paymentLogoUrl || "",
      socials: data.socials as unknown as object,
      linkColumns: data.linkColumns as unknown as object,
    };

    if (existing) {
      await prisma.footerSetting.update({ where: { id: existing.id }, data: payload });
    } else {
      await prisma.footerSetting.create({ data: payload });
    }
    return { success: true };
  } catch (error) {
    console.error("saveFooterSettings error:", error);
    return { success: false, error: "Failed to save footer settings" };
  }
}
