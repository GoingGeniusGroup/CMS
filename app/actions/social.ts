"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export type SocialLinks = {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  pinterest: string;
  youtube: string;
  whatsapp: string;
};

const DEFAULT_SOCIAL: SocialLinks = {
  facebook: "",
  twitter: "",
  linkedin: "",
  instagram: "",
  pinterest: "",
  youtube: "",
  whatsapp: "",
};

export async function getSocialSettings(): Promise<SocialLinks> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const row = await prisma.socialSetting.findFirst();
  if (!row) return DEFAULT_SOCIAL;

  return {
    facebook: row.facebook,
    twitter: row.twitter,
    linkedin: row.linkedin,
    instagram: row.instagram,
    pinterest: row.pinterest,
    youtube: row.youtube,
    whatsapp: row.whatsapp,
  };
}

export async function saveSocialSettings(data: SocialLinks) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const existing = await prisma.socialSetting.findFirst();
    if (existing) {
      await prisma.socialSetting.update({ where: { id: existing.id }, data });
    } else {
      await prisma.socialSetting.create({ data });
    }
    return { success: true };
  } catch (err) {
    console.error("saveSocialSettings error:", err);
    return { success: false, error: "Failed to save social settings" };
  }
}
