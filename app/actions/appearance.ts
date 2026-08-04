"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { unstable_cache, updateTag } from "next/cache";

export type AppearanceData = {
  hoverColor: string;
  hoverEnabled: boolean;
  timezone: string;
};

const DEFAULTS: AppearanceData = {
  hoverColor: "#e08800",
  hoverEnabled: true,
  timezone: "(GMT+05:45) Asia/Kathmandu",
};

// Public: fetch appearance settings — no auth needed for client pages. Cross-request
// cached (drives theme on every public page via the layout); invalidated via the
// "appearance-settings" tag on save.
const getPublicAppearanceSettingsCached = unstable_cache(
  async (): Promise<AppearanceData> => {
    const setting = await prisma.appearanceSetting.findFirst();
    if (!setting) return DEFAULTS;
    return {
      hoverColor: setting.hoverColor || DEFAULTS.hoverColor,
      hoverEnabled: setting.hoverEnabled,
      timezone: setting.timezone || DEFAULTS.timezone,
    };
  },
  ["public-appearance-settings"],
  { revalidate: 60, tags: ["appearance-settings"] }
);

export async function getPublicAppearanceSettings(): Promise<AppearanceData> {
  return getPublicAppearanceSettingsCached();
}

export async function getAppearanceSettings(): Promise<AppearanceData> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const setting = await prisma.appearanceSetting.findFirst();
  if (!setting) return DEFAULTS;
  return {
    hoverColor: setting.hoverColor || DEFAULTS.hoverColor,
    hoverEnabled: setting.hoverEnabled,
    timezone: setting.timezone || DEFAULTS.timezone,
  };
}

export async function saveAppearanceSettings(data: AppearanceData) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const existing = await prisma.appearanceSetting.findFirst();
  if (existing) {
    await prisma.appearanceSetting.update({ where: { id: existing.id }, data });
  } else {
    await prisma.appearanceSetting.create({ data });
  }
  updateTag("appearance-settings");
  return { success: true };
}
