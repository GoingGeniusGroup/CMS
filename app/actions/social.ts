"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { unstable_cache, revalidateTag } from "next/cache";

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

// Cross-request cached read (Data Cache) with a short TTL. auth() must stay
// OUTSIDE this function since unstable_cache cannot read request-scoped data
// like cookies. Invalidated on save via the "social-settings" tag.
const getSocialData = unstable_cache(
  async (): Promise<SocialLinks> => {
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
  },
  ["social-settings"],
  { revalidate: 60, tags: ["social-settings"] }
);

export async function getSocialSettings(): Promise<SocialLinks> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return getSocialData();
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
    revalidateTag("social-settings", { expire: 0 });
    return { success: true };
  } catch (err) {
    console.error("saveSocialSettings error:", err);
    return { success: false, error: "Failed to save social settings" };
  }
}
