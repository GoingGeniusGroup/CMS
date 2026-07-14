"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function getSetting(key: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value ?? null;
}

export async function saveSetting(key: string, value: unknown) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    // Clean the value — ensure it's a proper JSON-serializable object
    const cleanValue = JSON.parse(JSON.stringify(value ?? {}));

    await prisma.setting.upsert({
      where: { key },
      update: { value: cleanValue },
      create: { key, value: cleanValue },
    });
    return { success: true };
  } catch (error) {
    console.error(`Save setting "${key}" error:`, error);
    return { success: false, error: "Failed to save settings" };
  }
}

// ─── Public partner logos (no auth) ──────────────────────────────────────────

/**
 * Returns the array of partner logo URLs saved by the admin.
 * No authentication required — safe to call from public pages.
 */
export async function getPublicPartners(): Promise<string[]> {
  const setting = await prisma.setting.findUnique({
    where: { key: "partners-logos" },
  });
  const data = (setting?.value as { partners?: string[] }) ?? {};
  return Array.isArray(data.partners) ? data.partners : [];
}
