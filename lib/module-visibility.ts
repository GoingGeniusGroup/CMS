import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

/**
 * Cached list of sidebar module ids currently hidden by the admin
 * (Setting key "sidebar-modules", written by /settings/navigation).
 * Public-safe — no auth — so the user website can respect the same toggles.
 * Invalidated by updateTag("sidebar-modules") on save.
 */
const getDisabledModulesCached = unstable_cache(
  async (): Promise<string[]> => {
    try {
      const setting = await prisma.setting.findUnique({ where: { key: "sidebar-modules" } });
      const value = (setting?.value ?? {}) as { disabled?: unknown };
      return Array.isArray(value.disabled)
        ? value.disabled.filter((v): v is string => typeof v === "string")
        : [];
    } catch (error) {
      console.error("Read sidebar-modules error:", error);
      return [];
    }
  },
  ["sidebar-modules"],
  { revalidate: 60, tags: ["sidebar-modules"] }
);

export async function getDisabledModules(): Promise<string[]> {
  return getDisabledModulesCached();
}

export async function isModuleDisabled(id: string): Promise<boolean> {
  const disabled = await getDisabledModulesCached();
  return disabled.includes(id);
}
