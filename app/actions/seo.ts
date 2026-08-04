"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { unstable_cache, updateTag } from "next/cache";

export type SeoData = {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  metaImage: string;
};

export async function getSeoSettings(): Promise<SeoData> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const setting = await prisma.seoSetting.findFirst();
  return (
    setting ?? {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      metaImage: "",
    }
  );
}

export async function saveSeoSettings(data: SeoData) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const existing = await prisma.seoSetting.findFirst();
  if (existing) {
    await prisma.seoSetting.update({ where: { id: existing.id }, data });
  } else {
    await prisma.seoSetting.create({ data });
  }
  updateTag("seo-settings");
  return { success: true };
}

// Public access - no auth required (for user-facing meta tags). Cross-request
// cached — read in app/(user)/layout.tsx's generateMetadata on every public
// page; invalidated via the "seo-settings" tag on save.
const getPublicSeoSettingsCached = unstable_cache(
  async (): Promise<SeoData> => {
    const setting = await prisma.seoSetting.findFirst();
    return (
      setting ?? {
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        metaImage: "",
      }
    );
  },
  ["public-seo-settings"],
  { revalidate: 60, tags: ["seo-settings"] }
);

export async function getPublicSeoSettings(): Promise<SeoData> {
  return getPublicSeoSettingsCached();
}
