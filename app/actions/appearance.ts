"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export type AppearanceData = {
  baseColor: string;
  hoverColor: string;
  timezone: string;
};

export async function getAppearanceSettings(): Promise<AppearanceData> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const setting = await prisma.appearanceSetting.findFirst();
  return (
    setting ?? {
      baseColor: "#825DD2",
      hoverColor: "#D78539",
      timezone: "(GMT+06:45) Asia/Kathmandu",
    }
  );
}

export async function saveAppearanceSettings(data: AppearanceData) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const existing = await prisma.appearanceSetting.findFirst();
  if (existing) {
    await prisma.appearanceSetting.update({ where: { id: existing.id }, data });
  } else {
    await prisma.appearanceSetting.create({ data });
  }
  return { success: true };
}
