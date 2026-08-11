"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { unstable_cache, revalidateTag } from "next/cache";

export type SubMenuItem = { label: string; path: string };
export type MenuItem = { label: string; path: string; children?: SubMenuItem[] };

export type WebsiteHeaderInput = {
  stickyHeader: boolean;
  bannerImageUrl: string;
  bannerLink: string;
  helpNumber: string;
  menuItems: MenuItem[];
};

export type WebsiteHeaderData = {
  stickyHeader: boolean;
  bannerImageUrl: string;
  bannerLink: string;
  helpNumber: string;
  menuItems: MenuItem[];
};

const DEFAULTS: WebsiteHeaderData = {
  stickyHeader: true,
  bannerImageUrl: "",
  bannerLink: "",
  helpNumber: "",
  menuItems: [],
};

// ─── Public (no auth) — for client-side pages ────────────────────────────────

// Cross-request Data Cache read. The header renders in app/(user)/layout.tsx on
// EVERY public page, and changes only when an admin saves — so caching it (and
// invalidating via the "website-header" tag on save) removes one cross-region
// DB round trip per public request. TTL is a safety net; writes invalidate
// immediately.
const getPublicWebsiteHeaderCached = unstable_cache(
  async (): Promise<WebsiteHeaderData> => {
    const row = await prisma.websiteHeader.findFirst();
    if (!row) return DEFAULTS;
    return {
      stickyHeader: row.stickyHeader,
      bannerImageUrl: row.bannerImageUrl || "",
      bannerLink: row.bannerLink || "",
      helpNumber: row.helpNumber || "",
      menuItems: (row.menuItems as MenuItem[]) ?? [],
    };
  },
  ["public-website-header"],
  { revalidate: 60, tags: ["website-header"] }
);

export async function getPublicWebsiteHeader(): Promise<WebsiteHeaderData> {
  return getPublicWebsiteHeaderCached();
}

// ─── Admin (auth required) ───────────────────────────────────────────────────

export async function getWebsiteHeader(): Promise<WebsiteHeaderData> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const row = await prisma.websiteHeader.findFirst();
  if (!row) return DEFAULTS;
  return {
    stickyHeader: row.stickyHeader,
    bannerImageUrl: row.bannerImageUrl || "",
    bannerLink: row.bannerLink || "",
    helpNumber: row.helpNumber || "",
    menuItems: (row.menuItems as MenuItem[]) ?? [],
  };
}

export async function saveWebsiteHeader(data: WebsiteHeaderInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const existing = await prisma.websiteHeader.findFirst();
    const payload = {
      stickyHeader: data.stickyHeader,
      bannerImageUrl: data.bannerImageUrl || "",
      bannerLink: data.bannerLink || "",
      helpNumber: data.helpNumber || "",
      menuItems: data.menuItems as unknown as object,
    };

    if (existing) {
      await prisma.websiteHeader.update({ where: { id: existing.id }, data: payload });
    } else {
      await prisma.websiteHeader.create({ data: payload });
    }
    revalidateTag("website-header", { expire: 0 });
    return { success: true };
  } catch (error) {
    console.error("saveWebsiteHeader error:", error);
    return { success: false, error: "Failed to save website header settings" };
  }
}
