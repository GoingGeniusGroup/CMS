"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { unstable_cache, updateTag } from "next/cache";

/**
 * The `content` column is stored as a serialized JSON string (TEXT column).
 * This helper safely parses it back into an object, tolerating empty/invalid
 * values as well as values that are already objects.
 */
function parseContent(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object") {
    return value as Record<string, unknown>;
  }
  if (typeof value === "string" && value.trim() !== "") {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }
  return {};
}

/** Returns the single popup settings record (or defaults if none exists). */
export async function getPopupSettings() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const setting = await prisma.popupSetting.findFirst();
  if (!setting) {
    return { id: null, showPopup: true, content: {} };
  }
  return { id: setting.id, showPopup: setting.showPopup, content: parseContent(setting.content) };
}

/** Upsert the popup settings record. */
export async function savePopupSettings(data: { showPopup: boolean; content: unknown }) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const existing = await prisma.popupSetting.findFirst();
    // Persist as a serialized JSON string to match the TEXT `content` column.
    const cleanContent = JSON.stringify(data.content ?? {});

    if (existing) {
      await prisma.popupSetting.update({
        where: { id: existing.id },
        data: { showPopup: data.showPopup, content: cleanContent },
      });
    } else {
      await prisma.popupSetting.create({
        data: { showPopup: data.showPopup, content: cleanContent },
      });
    }

    updateTag("popup-settings");
    return { success: true };
  } catch (err) {
    console.error("savePopupSettings error:", err);
    return { success: false, error: "Failed to save settings" };
  }
}

// Public access - no auth required (for user-facing popup). Cross-request cached
// (renders on every public page via the layout); invalidated via the
// "popup-settings" tag on save.
const getPublicPopupSettingsCached = unstable_cache(
  async () => {
    const setting = await prisma.popupSetting.findFirst();
    if (!setting) {
      return { showPopup: true, content: {} };
    }
    return { showPopup: setting.showPopup, content: parseContent(setting.content) };
  },
  ["public-popup-settings"],
  { revalidate: 60, tags: ["popup-settings"] }
);

export async function getPublicPopupSettings() {
  return getPublicPopupSettingsCached();
}
