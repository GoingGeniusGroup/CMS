"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export type SecuritySettingInput = {
  twoFactorEnabled: boolean;
  loginAttempts: number;
  sessionTimeout: number;
  passwordMinLength: number;
};

export async function getSecuritySettings() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const data = await prisma.securitySetting.findFirst();
  return data ?? { twoFactorEnabled: false, loginAttempts: 5, sessionTimeout: 30, passwordMinLength: 8 };
}

export async function saveSecuritySettings(data: SecuritySettingInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const existing = await prisma.securitySetting.findFirst();
    if (existing) {
      await prisma.securitySetting.update({ where: { id: existing.id }, data });
    } else {
      await prisma.securitySetting.create({ data });
    }
    return { success: true };
  } catch (error) {
    console.error("Save security settings error:", error);
    return { success: false, error: "Failed to save security settings" };
  }
}
