"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export type ContactSettingInput = {
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
  address: string;
  contactMail: string;
  officeHours: string;
  googleMapEmbed: string;
};

export async function saveContactSettings(data: ContactSettingInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const existing = await prisma.contactSetting.findFirst();

    if (existing) {
      await prisma.contactSetting.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.contactSetting.create({ data });
    }

    return { success: true };
  } catch (error) {
    console.error("Save contact settings error:", error);
    return { success: false, error: "Failed to save contact settings" };
  }
}
