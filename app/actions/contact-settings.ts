"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { cache } from "react";

// Phone: allow digits, +, spaces, dashes, parentheses. Empty is allowed for optional fields.
const phoneRegex = /^[0-9+\-\s()]*$/;

const contactSettingsSchema = z.object({
  phone1: z
    .string()
    .min(1, "Phone number 1 is required")
    .regex(phoneRegex, "Phone number can only contain digits, +, -, spaces, and parentheses"),
  phone2: z
    .string()
    .regex(phoneRegex, "Phone number can only contain digits, +, -, spaces, and parentheses")
    .optional()
    .or(z.literal("")),
  email1: z
    .string()
    .min(1, "Email address 1 is required")
    .email("Please enter a valid email address"),
  email2: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  contactMail: z
    .string()
    .min(1, "Contact mail is required")
    .email("Please enter a valid email address"),
  officeHours: z.string().optional().or(z.literal("")),
  googleMapEmbed: z.string().optional().or(z.literal("")),
});

export type ContactSettingInput = z.infer<typeof contactSettingsSchema>;

// Get contact settings for public/user-facing pages (no auth required)
export const getPublicContactSettings = cache(async () => {
  const data = await prisma.contactSetting.findFirst();
  return data;
});

export async function saveContactSettings(data: ContactSettingInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  // Validate
  const result = contactSettingsSchema.safeParse(data);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string;
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return { success: false, error: "Validation failed", fieldErrors };
  }

  try {
    const existing = await prisma.contactSetting.findFirst();

    if (existing) {
      await prisma.contactSetting.update({
        where: { id: existing.id },
        data: result.data,
      });
    } else {
      await prisma.contactSetting.create({ data: result.data });
    }

    return { success: true };
  } catch (error) {
    console.error("Save contact settings error:", error);
    return { success: false, error: "Failed to save contact settings" };
  }
}
