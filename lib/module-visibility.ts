import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

/**
 * Cached list of sidebar module ids currently hidden by the admin
 * (Setting key "sidebar-modules", written by /settings/navigation).
 * Public-safe — no auth — so the user website can respect the same toggles.
 * Invalidated by revalidateTag("sidebar-modules") on save.
 *
 * DB errors intentionally propagate so a transient failure is never written to
 * the Data Cache (which would hide/show modules incorrectly for the full TTL).
 * The empty-list fallback lives in the wrappers below.
 */
const getDisabledModulesCached = unstable_cache(
  async (): Promise<string[]> => {
    const setting = await prisma.setting.findUnique({ where: { key: "sidebar-modules" } });
    const value = (setting?.value ?? {}) as { disabled?: unknown };
    return Array.isArray(value.disabled)
      ? value.disabled.filter((v): v is string => typeof v === "string")
      : [];
  },
  ["sidebar-modules"],
  { revalidate: 60, tags: ["sidebar-modules"] }
);

export async function getDisabledModules(): Promise<string[]> {
  try {
    return await getDisabledModulesCached();
  } catch (error) {
    console.error("Read sidebar-modules error:", error);
    return [];
  }
}

export async function isModuleDisabled(id: string): Promise<boolean> {
  const disabled = await getDisabledModules();
  return disabled.includes(id);
}
