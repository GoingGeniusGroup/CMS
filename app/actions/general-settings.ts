"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export type GeneralSettingInput = {
  siteName: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  metaKeywords: string;
  themeColor: string;
  themeTextColor: string;
  baseColorEnabled: boolean;
};

export async function getGeneralSettings() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const setting = await prisma.generalSetting.findFirst();
  if (!setting) {
    return {
      id: null as string | null,
      siteName: "",
      description: "",
      logoUrl: "",
      faviconUrl: "",
      metaKeywords: "",
      themeColor: "#fe9a00",
      themeTextColor: "#ffffff",
      baseColorEnabled: true,
    };
  }
  return {
    id: setting.id as string | null,
    siteName: setting.siteName,
    description: setting.description,
    logoUrl: setting.logoUrl,
    faviconUrl: setting.faviconUrl,
    metaKeywords: setting.metaKeywords,
    themeColor: setting.themeColor,
    themeTextColor: setting.themeTextColor,
    baseColorEnabled: setting.baseColorEnabled,
  };
}

export async function saveGeneralSettings(data: GeneralSettingInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const existing = await prisma.generalSetting.findFirst();

    if (existing) {
      await prisma.generalSetting.update({ where: { id: existing.id }, data });
    } else {
      await prisma.generalSetting.create({ data });
    }

    return { success: true };
  } catch (err) {
    console.error("saveGeneralSettings error:", err);
    return { success: false, error: "Failed to save settings" };
  }
}
