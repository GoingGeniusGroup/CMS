"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export type CookieSettingInput = {
  cookiesAgreement: boolean;
  showCookiesAgreement: boolean;
  cookiesAgreementText: string;
};

export async function getCookieSettings() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const data = await prisma.cookieSetting.findFirst();
  return data ?? { cookiesAgreement: true, showCookiesAgreement: true, cookiesAgreementText: "" };
}

export async function saveCookieSettings(data: CookieSettingInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const existing = await prisma.cookieSetting.findFirst();
    if (existing) {
      await prisma.cookieSetting.update({ where: { id: existing.id }, data });
    } else {
      await prisma.cookieSetting.create({ data });
    }
    return { success: true };
  } catch (error) {
    console.error("Save cookie settings error:", error);
    return { success: false, error: "Failed to save cookie settings" };
  }
}
