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
  return setting ?? {
    id: null,
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
