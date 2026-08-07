"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import { getProfileConfig, isCustomProfile } from "@/lib/config/industry-profiles";
import { contrastRatio, normalizeHex } from "@/lib/color-contrast";

export type GeneralSettingInput = {
  siteName: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  metaKeywords: string;
  themeColor: string;
  themeTextColor: string;
  lightThemeColor: string;
  lightThemeTextColor: string;
  darkThemeColor: string;
  darkThemeTextColor: string;
  baseColorEnabled: boolean;
  industryProfile: string;
  currency?: string;
  currencySymbol?: string;
  dateFormat?: string;
  numberFormat?: string;
};

export async function getGeneralSettings() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const setting = await prisma.generalSetting.findFirst();
  if (!setting) {
    return {
      id: null as string | null,
      siteName: "",
      description: "",
      logoUrl: "",
      faviconUrl: "",
      metaKeywords: "",
      themeColor: "#fe9a00",
      themeTextColor: "#ffffff",
      lightThemeColor: "#fe9a00",
      lightThemeTextColor: "#000000",
      darkThemeColor: "#fbbf24",
      darkThemeTextColor: "#18181b",
      baseColorEnabled: true,
      industryProfile: "Generic",
      currency: "NPR",
      currencySymbol: "Rs.",
      dateFormat: "DD/MM/YYYY",
      numberFormat: "en-US",
    };
  }
  return {
    id: setting.id as string | null,
    siteName: setting.siteName,
    description: setting.description,
    logoUrl: setting.logoUrl,
    faviconUrl: setting.faviconUrl,
    metaKeywords: setting.metaKeywords,
    themeColor: setting.themeColor,
    themeTextColor: setting.themeTextColor,
    lightThemeColor: setting.lightThemeColor || setting.themeColor || "#fe9a00",
    lightThemeTextColor: setting.lightThemeTextColor || setting.themeTextColor || "#000000",
    darkThemeColor: setting.darkThemeColor || "#fbbf24",
    darkThemeTextColor: setting.darkThemeTextColor || "#18181b",
    baseColorEnabled: setting.baseColorEnabled,
    industryProfile: setting.industryProfile || "Generic",
    currency: setting.currency,
    currencySymbol: setting.currencySymbol,
    dateFormat: setting.dateFormat,
    numberFormat: setting.numberFormat,
  };
}

/**
 * Applies an industry profile preset. Only creates label overrides and
 * suggested custom fields that do NOT already exist — admin-customized values
 * are never overwritten. "Custom" profile applies nothing.
 */
async function applyIndustryProfile(profile: string) {
  if (isCustomProfile(profile)) return;

  const config = getProfileConfig(profile);

  // Labels: seed a default override only if the admin has not customized it.
  if (config.labels) {
    for (const [entityKey, label] of Object.entries(config.labels)) {
      if (!label?.singular && !label?.plural) continue;
      const existing = await prisma.labelOverride.findUnique({ where: { entityKey } });
      if (existing) continue;

      await prisma.labelOverride.create({
        data: {
          entityKey,
          singular: label.singular ?? entityKey,
          plural: label.plural ?? `${entityKey}s`,
        },
      });
    }
  }

  // Suggested custom fields: create inactive entries, skipping existing keys.
  if (config.customFields) {
    for (const [moduleKey, suggestions] of Object.entries(config.customFields)) {
      for (const suggestion of suggestions) {
        const exists = await prisma.customField.findUnique({
          where: { moduleKey_fieldKey: { moduleKey, fieldKey: suggestion.fieldKey } },
        });
        if (exists) continue;

        const maxOrder = await prisma.customField.aggregate({
          where: { moduleKey },
          _max: { displayOrder: true },
        });

        await prisma.customField.create({
          data: {
            moduleKey,
            fieldKey: suggestion.fieldKey,
            label: suggestion.label,
            type: suggestion.type,
            options: suggestion.options ?? [],
            required: suggestion.required ?? false,
            displayOrder: (maxOrder._max.displayOrder ?? -1) + 1,
            isActive: false,
          },
        });
      }
    }
  }
}

export async function saveGeneralSettings(data: GeneralSettingInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const palettes = [
      ["Light", data.lightThemeColor, data.lightThemeTextColor],
      ["Dark", data.darkThemeColor, data.darkThemeTextColor],
    ] as const;
    for (const [name, color, textColor] of palettes) {
      const primary = normalizeHex(color);
      const onPrimary = normalizeHex(textColor);
      if (!primary || !onPrimary) {
        return { success: false, error: `${name} theme colors must be valid hex values.` };
      }
      if (contrastRatio(primary, onPrimary) < 4.5) {
        return { success: false, error: `${name} theme text color must have at least 4.5:1 contrast.` };
      }
      if (name === "Light") {
        data.lightThemeColor = primary;
        data.lightThemeTextColor = onPrimary;
        // Keep legacy fields current until the compatibility cleanup release.
        data.themeColor = primary;
        data.themeTextColor = onPrimary;
      } else {
        data.darkThemeColor = primary;
        data.darkThemeTextColor = onPrimary;
      }
    }
    const existing = await prisma.generalSetting.findFirst();
    const previousProfile = existing?.industryProfile || "Generic";
    const nextProfile = data.industryProfile || "Generic";

    if (existing) {
      await prisma.generalSetting.update({ where: { id: existing.id }, data });
    } else {
      await prisma.generalSetting.create({ data });
    }

    // Apply the preset only when the profile actually changes.
    if (nextProfile !== previousProfile) {
      await applyIndustryProfile(nextProfile);
      // Switching profile seeds new label overrides, so the public label cache
      // must be invalidated too.
      revalidateTag("entity-labels", { expire: 0 });
    }

    // Invalidate the public site-settings Data Cache (site name, logo, theme, etc.).
    // NOTE: getSiteSettings() uses the legacy unstable_cache API with `tags`,
    // which is only invalidated by revalidateTag() — updateTag() only affects
    // caches created with cacheTag()/`use cache`, so it silently did nothing here.
    // { expire: 0 } forces immediate expiration so the change shows right away.
    revalidateTag("site-settings", { expire: 0 });
    return { success: true };
  } catch (err) {
    console.error("saveGeneralSettings error:", err);
    return { success: false, error: "Failed to save settings" };
  }
}
