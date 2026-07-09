"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

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
  return { success: true };
}
