"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

/** Returns the single popup settings record (or defaults if none exists). */
export async function getPopupSettings() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const setting = await prisma.popupSetting.findFirst();
  if (!setting) {
    return { id: null, showPopup: true, content: "" };
  }
  return { id: setting.id, showPopup: setting.showPopup, content: setting.content };
}

/** Upsert the popup settings record. */
export async function savePopupSettings(data: { showPopup: boolean; content: string }) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const existing = await prisma.popupSetting.findFirst();

    if (existing) {
      await prisma.popupSetting.update({
        where: { id: existing.id },
        data: { showPopup: data.showPopup, content: data.content },
      });
    } else {
      await prisma.popupSetting.create({
        data: { showPopup: data.showPopup, content: data.content },
      });
    }

    return { success: true };
  } catch (err) {
    console.error("savePopupSettings error:", err);
    return { success: false, error: "Failed to save settings" };
  }
}
