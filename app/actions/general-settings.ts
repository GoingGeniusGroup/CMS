"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function getGeneralSettings() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const setting = await prisma.generalSetting.findFirst();
  return setting ?? { id: null, siteName: "", logoUrl: "", faviconUrl: "" };
}

export async function saveGeneralSettings(data: {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
}) {
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
