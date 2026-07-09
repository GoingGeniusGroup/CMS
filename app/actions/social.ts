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

  const row = await prisma.setting.findUnique({ where: { key: "social" } });
  if (!row) return DEFAULT_SOCIAL;

  return { ...DEFAULT_SOCIAL, ...(row.value as object) } as SocialLinks;
}

export async function saveSocialSettings(data: SocialLinks) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.setting.upsert({
      where: { key: "social" },
      create: { key: "social", value: data as object },
      update: { value: data as object },
    });
    return { success: true };
  } catch (err) {
    console.error("saveSocialSettings error:", err);
    return { success: false, error: "Failed to save social settings" };
  }
}
