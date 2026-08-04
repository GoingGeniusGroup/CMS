"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { unstable_cache, updateTag } from "next/cache";

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
    updateTag("cookie-settings");
    return { success: true };
  } catch (error) {
    console.error("Save cookie settings error:", error);
    return { success: false, error: "Failed to save cookie settings" };
  }
}

// Public access - no auth required (for user-facing cookie banner). Cross-request
// cached (renders on every public page via the layout); invalidated via the
// "cookie-settings" tag on save.
const getPublicCookieSettingsCached = unstable_cache(
  async () => {
    const data = await prisma.cookieSetting.findFirst();
    return data ?? { cookiesAgreement: true, showCookiesAgreement: true, cookiesAgreementText: "" };
  },
  ["public-cookie-settings"],
  { revalidate: 60, tags: ["cookie-settings"] }
);

export async function getPublicCookieSettings() {
  return getPublicCookieSettingsCached();
}
