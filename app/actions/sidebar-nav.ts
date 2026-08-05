"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { updateTag } from "next/cache";

const SETTING_KEY = "sidebar-modules";

/**
 * Returns the ids of the main sidebar nav modules that are currently hidden.
 * Only hidden ids are persisted — anything absent stays visible.
 */
export async function getSidebarModuleConfig() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const setting = await prisma.setting.findUnique({ where: { key: SETTING_KEY } });
  const value = (setting?.value as { disabled?: unknown }) ?? {};
  const disabled = Array.isArray(value.disabled)
    ? value.disabled.filter((v): v is string => typeof v === "string")
    : [];

  return { disabled };
}

/**
 * Persists the list of hidden sidebar module ids.
 * Visible through the sidebar immediately after ConfigProvider refreshes.
 */
export async function saveSidebarModuleConfig(disabled: string[]) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const cleanDisabled = disabled.filter((id) => typeof id === "string");

  try {
    await prisma.setting.upsert({
      where: { key: SETTING_KEY },
      update: { value: { disabled: cleanDisabled } },
      create: { key: SETTING_KEY, value: { disabled: cleanDisabled } },
    });
    updateTag(SETTING_KEY);
    return { success: true };
  } catch (error) {
    console.error(`Save setting "${SETTING_KEY}" error:`, error);
    return { success: false, error: "Failed to save sidebar modules" };
  }
}