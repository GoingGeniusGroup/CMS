"use server";

import { auth } from "@/auth";
import { getEntityLabels } from "@/app/actions/labels";
import { getStatusOptionsMap, type StatusOptionsMap } from "@/lib/status-options";
import prisma from "@/lib/prisma";

const SIDEBAR_SETTING_KEY = "sidebar-modules";

export type AdminConfigBundle = {
  labels: Array<{ entityKey: string; singular: string; plural: string }>;
  statusOptions: StatusOptionsMap;
  disabledNavIds: string[];
};

/**
 * Single server action that fetches all admin config in one request.
 * Replaces three separate calls (getEntityLabelsArray, getStatusOptionsClient,
 * getSidebarModuleConfig) to reduce HTTP round-trips from client to server.
 */
export async function getAdminConfigBundle(): Promise<AdminConfigBundle> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const [labelsMap, statusOptions, sidebarSetting] = await Promise.all([
    getEntityLabels(),
    getStatusOptionsMap(),
    prisma.setting.findUnique({ where: { key: SIDEBAR_SETTING_KEY } }),
  ]);

  const labels = Object.entries(labelsMap).map(([entityKey, value]) => ({
    entityKey,
    singular: value.singular,
    plural: value.plural,
  }));

  const sidebarValue = (sidebarSetting?.value as { disabled?: unknown }) ?? {};
  const disabledNavIds = Array.isArray(sidebarValue.disabled)
    ? sidebarValue.disabled.filter((v): v is string => typeof v === "string")
    : [];

  return { labels, statusOptions, disabledNavIds };
}
