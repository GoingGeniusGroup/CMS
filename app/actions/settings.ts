"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// ─── Auth helpers ─────────────────────────────────────────────────────────────

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return { error: "Unauthenticated" as const };
  if (session.user.role !== "admin") return { error: "Unauthorized" as const };
  return { session };
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const cookieSettingsSchema = z.object({
  /** Whether the cookie consent banner is shown on the public site */
  bannerEnabled: z.boolean(),
  /**
   * If true, visitors must explicitly accept before any analytics /
   * tracking scripts are allowed to run.
   */
  agreementRequired: z.boolean(),
  /**
   * HTML / plain-text body of the banner.
   * Required whenever bannerEnabled is true.
   */
  agreementText: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.bannerEnabled && !data.agreementText?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["agreementText"],
      message: "Agreement text is required when the banner is enabled.",
    });
  }
});

export type CookieSettings = z.infer<typeof cookieSettingsSchema>;

/** Default values used when no row exists in the DB yet */
const COOKIE_DEFAULTS: CookieSettings = {
  bannerEnabled: false,
  agreementRequired: false,
  agreementText: "",
};

// ─── Generic helpers ──────────────────────────────────────────────────────────

async function getRawSetting(key: string): Promise<unknown | null> {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row?.value ?? null;
}

// ─── Cookie settings ──────────────────────────────────────────────────────────

/**
 * ADMIN — read cookie settings.
 */
export async function getCookieSettings(): Promise<
  { success: true; data: CookieSettings } | { success: false; error: string }
> {
  const check = await requireAdmin();
  if ("error" in check) return { success: false, error: check.error };

  const raw = await getRawSetting("cookies");
  if (!raw) return { success: true, data: COOKIE_DEFAULTS };

  const parsed = cookieSettingsSchema.safeParse(raw);
  if (!parsed.success) return { success: true, data: COOKIE_DEFAULTS };

  return { success: true, data: parsed.data };
}

/**
 * ADMIN — persist cookie settings.
 */
export async function updateCookieSettings(
  input: CookieSettings,
): Promise<{ success: true } | { success: false; error: string }> {
  const check = await requireAdmin();
  if ("error" in check) return { success: false, error: check.error };

  const parsed = cookieSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  await prisma.setting.upsert({
    where: { key: "cookies" },
    create: { key: "cookies", value: parsed.data },
    update: { value: parsed.data },
  });

  return { success: true };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * PUBLIC — no auth required.
 *
 * Returns only the fields the public site needs to:
 *  1. Decide whether to show the consent banner.
 *  2. Gate analytics / tracking scripts behind explicit consent if
 *     agreementRequired is true.
 */
export async function getPublicCookieConfig(): Promise<{
  bannerEnabled: boolean;
  agreementRequired: boolean;
  agreementText: string;
}> {
  const raw = await getRawSetting("cookies");
  const parsed = cookieSettingsSchema.safeParse(raw);
  const data = parsed.success ? parsed.data : COOKIE_DEFAULTS;

  return {
    bannerEnabled: data.bannerEnabled,
    agreementRequired: data.agreementRequired,
    agreementText: data.agreementText ?? "",
  };
}
