"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { getProfileConfig, isCustomProfile } from "@/lib/config/industry-profiles";

export type GeneralSettingInput = {
  siteName: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  metaKeywords: string;
  themeColor: string;
  themeTextColor: string;
  baseColorEnabled: boolean;
  industryProfile: string;
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
      baseColorEnabled: true,
      industryProfile: "Generic",
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
    baseColorEnabled: setting.baseColorEnabled,
    industryProfile: setting.industryProfile || "Generic",
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
    }

    return { success: true };
  } catch (err) {
    console.error("saveGeneralSettings error:", err);
    return { success: false, error: "Failed to save settings" };
  }
}
