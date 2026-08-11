"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { unstable_cache, revalidateTag } from "next/cache";

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
  // Floating chat widget
  floatingChatEnabled: z.boolean().default(false),
  floatingChatPlatform: z.enum(["whatsapp", "messenger", "custom"]).default("whatsapp"),
  floatingChatValue: z.string().max(300).optional().or(z.literal("")),
  floatingChatLabel: z.string().max(100).optional().or(z.literal("")),
});

export type ContactSettingInput = z.infer<typeof contactSettingsSchema>;

// Get contact settings for public/user-facing pages (no auth required).
// Cross-request cached — used by the footer (every public page) and the contact
// page; invalidated via the "contact-settings" tag on save.
const getPublicContactSettingsCached = unstable_cache(
  async () => {
    const data = await prisma.contactSetting.findFirst();
    return data;
  },
  ["public-contact-settings"],
  { revalidate: 60, tags: ["contact-settings"] }
);

export async function getPublicContactSettings() {
  return getPublicContactSettingsCached();
}

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

    revalidateTag("contact-settings", { expire: 0 });
    return { success: true };
  } catch (error) {
    console.error("Save contact settings error:", error);
    return { success: false, error: "Failed to save contact settings" };
  }
}
