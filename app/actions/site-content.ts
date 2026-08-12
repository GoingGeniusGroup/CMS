"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { unstable_cache, revalidatePath, revalidateTag } from "next/cache";
import {
  SECTION_REGISTRY,
  parseSectionData,
  type SectionKey,
  type SectionDataFor,
} from "@/lib/content/schemas";

/**
 * Read/write layer for public-site content (Phase 16). Mirrors the pattern
 * already established by `getEntityLabels` (app/actions/labels.ts) and
 * `getDepartments` (app/actions/team.ts): cross-request cached reads via
 * `unstable_cache`, invalidated by tag on write.
 *
 * Reads are intentionally NOT behind `auth()` — this is public-site content,
 * fetched from server components rendering pages under app/(user). Writes ARE
 * auth-gated, same as every other admin-mutating action in this codebase.
 */

export type SiteContentSection<K extends SectionKey = SectionKey> = {
  sectionKey: K;
  pageKey: string;
  variant: string;
  isVisible: boolean;
  order: number;
  data: SectionDataFor<K>;
};

const getPageContentCached = unstable_cache(
  async (pageKey: string): Promise<SiteContentSection[]> => {
    const rows = await prisma.siteContent.findMany({
      where: { pageKey },
      orderBy: { order: "asc" },
    });

    const sections: SiteContentSection[] = [];
    for (const row of rows) {
      // A row's sectionKey might reference a section type that no longer exists
      // in the registry (e.g. removed in a future refactor) — skip it rather
      // than surface an unrenderable section.
      if (!(row.sectionKey in SECTION_REGISTRY)) continue;
      const key = row.sectionKey as SectionKey;
      sections.push({
        sectionKey: key,
        pageKey: row.pageKey,
        variant: row.variant,
        isVisible: row.isVisible,
        order: row.order,
        data: parseSectionData(key, row.data),
      });
    }
    return sections;
  },
  ["site-content-page"],
  { revalidate: false, tags: ["site-content"] }
);

/** All sections for a page, in display order, each already validated/fallback-safe. */
export async function getPageContent(pageKey: string): Promise<SiteContentSection[]> {
  try {
    return await getPageContentCached(pageKey);
  } catch (error) {
    console.error("Error fetching page content:", error);
    return [];
  }
}

/** A single section, with its registry default substituted if no row exists yet. */
export async function getSection<K extends SectionKey>(
  pageKey: string,
  sectionKey: K
): Promise<SiteContentSection<K>> {
  const sections = await getPageContent(pageKey);
  const found = sections.find((s) => s.sectionKey === sectionKey);
  if (found) return found as SiteContentSection<K>;

  const entry = SECTION_REGISTRY[sectionKey];
  return {
    sectionKey,
    pageKey: entry.pageKey,
    variant: "default",
    isVisible: true,
    order: entry.defaultOrder,
    data: entry.defaultData,
  };
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

/**
 * Validates `data` against the section's own schema before writing — an
 * invalid payload is rejected here rather than reaching the DB, per the
 * "Editor JSON drifts" risk in the plan doc.
 */
export async function saveSection<K extends SectionKey>(
  pageKey: string,
  sectionKey: K,
  data: unknown
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  const entry = SECTION_REGISTRY[sectionKey];
  if (!entry || entry.pageKey !== pageKey) {
    return { success: false, error: "Unknown section" };
  }

  const result = entry.schema.safeParse(data);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    return { success: false, error: firstIssue ? `${firstIssue.path.join(".")}: ${firstIssue.message}` : "Invalid data" };
  }

  try {
    const existing = await prisma.siteContent.findUnique({
      where: { pageKey_sectionKey: { pageKey, sectionKey } },
    });

    await prisma.siteContent.upsert({
      where: { pageKey_sectionKey: { pageKey, sectionKey } },
      update: { data: result.data as object },
      create: {
        pageKey,
        sectionKey,
        variant: "default",
        isVisible: true,
        order: existing?.order ?? entry.defaultOrder,
        data: result.data as object,
      },
    });

    revalidateTag("site-content", { expire: 0 });
    revalidatePath(`/${pageKey === "home" ? "home" : pageKey}`);
    return { success: true };
  } catch (error) {
    console.error("Error saving section:", error);
    return { success: false, error: "Failed to save section" };
  }
}

export async function toggleSection(
  pageKey: string,
  sectionKey: SectionKey,
  isVisible: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  const entry = SECTION_REGISTRY[sectionKey];
  if (!entry || entry.pageKey !== pageKey) {
    return { success: false, error: "Unknown section" };
  }

  try {
    const existing = await prisma.siteContent.findUnique({
      where: { pageKey_sectionKey: { pageKey, sectionKey } },
    });

    await prisma.siteContent.upsert({
      where: { pageKey_sectionKey: { pageKey, sectionKey } },
      update: { isVisible },
      create: {
        pageKey,
        sectionKey,
        variant: "default",
        isVisible,
        order: existing?.order ?? entry.defaultOrder,
        data: entry.defaultData as object,
      },
    });

    revalidateTag("site-content", { expire: 0 });
    revalidatePath(`/${pageKey}`);
    return { success: true };
  } catch (error) {
    console.error("Error toggling section:", error);
    return { success: false, error: "Failed to toggle section" };
  }
}

/**
 * Persists a new display order for every section on a page in one pass.
 * `orderedSectionKeys` is the full list for the page, front to back — each
 * section's `order` becomes its index in that array.
 */
export async function reorderSections(
  pageKey: string,
  orderedSectionKeys: SectionKey[]
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  for (const key of orderedSectionKeys) {
    const entry = SECTION_REGISTRY[key];
    if (!entry || entry.pageKey !== pageKey) {
      return { success: false, error: `Section "${key}" does not belong to page "${pageKey}"` };
    }
  }

  try {
    await prisma.$transaction(
      orderedSectionKeys.map((sectionKey, index) => {
        const entry = SECTION_REGISTRY[sectionKey];
        return prisma.siteContent.upsert({
          where: { pageKey_sectionKey: { pageKey, sectionKey } },
          update: { order: index },
          create: {
            pageKey,
            sectionKey,
            variant: "default",
            isVisible: true,
            order: index,
            data: entry.defaultData as object,
          },
        });
      })
    );

    revalidateTag("site-content", { expire: 0 });
    revalidatePath(`/${pageKey}`);
    return { success: true };
  } catch (error) {
    console.error("Error reordering sections:", error);
    return { success: false, error: "Failed to reorder sections" };
  }
}
