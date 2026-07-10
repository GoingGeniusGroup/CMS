"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export type EmailSettingInput = {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  fromName: string;
  fromEmail: string;
  encryption: string;
};

export async function getEmailSettings() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const data = await prisma.emailSetting.findFirst();
  return data ?? { smtpHost: "", smtpPort: "", smtpUser: "", smtpPassword: "", fromName: "", fromEmail: "", encryption: "tls" };
}

export async function saveEmailSettings(data: EmailSettingInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const existing = await prisma.emailSetting.findFirst();
    if (existing) {
      await prisma.emailSetting.update({ where: { id: existing.id }, data });
    } else {
      await prisma.emailSetting.create({ data });
    }
    return { success: true };
  } catch (error) {
    console.error("Save email settings error:", error);
    return { success: false, error: "Failed to save email settings" };
  }
}
