"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { saveCustomFieldValues } from "./custom-fields";

const pageSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required"),
  content: z.unknown().optional(),
  thumbnail: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  keywords: z.string().optional(),
  metaImage: z.string().optional(),
  status: z.string().min(1, "Status is required"),
});

export type PageInput = z.infer<typeof pageSchema>;

export async function getPages(page = 1, pageSize = 10) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [pages, total, published, drafts] = await Promise.all([
    prisma.page.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.page.count(),
    prisma.page.count({ where: { status: "Published" } }),
    prisma.page.count({ where: { status: "Draft" } }),
  ]);

  return {
    pages,
    total,
    published,
    drafts,
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize),
  };
}

// ─── Public (no auth) — for client-side rendering ────────────────────────────

export async function getPublicPageBySlug(slug: string) {
  const page = await prisma.page.findFirst({
    where: { slug, status: "Published" },
  });
  return page;
}

function buildData(data: PageInput) {
  return {
    title: data.title,
    slug: data.slug,
    content: (data.content ?? undefined) as object | undefined,
    thumbnail: data.thumbnail,
    metaTitle: data.metaTitle,
    metaDesc: data.metaDesc,
    keywords: data.keywords,
    metaImage: data.metaImage,
    status: data.status,
  };
}

export async function createPage(data: PageInput, customFieldValues?: Record<string, string | number | boolean | null | undefined>) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = pageSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const created = await prisma.page.create({ data: buildData(result.data) });
    if (customFieldValues && Object.keys(customFieldValues).length > 0) {
      await saveCustomFieldValues("page", created.id, customFieldValues);
    }
    return { success: true };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "A page with this slug already exists" };
    }
    console.error("Create page error:", error);
    return { success: false, error: "Failed to create page" };
  }
}

export async function updatePage(id: string, data: PageInput, customFieldValues?: Record<string, string | number | boolean | null | undefined>) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = pageSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    await prisma.page.update({ where: { id }, data: buildData(result.data) });
    if (customFieldValues && Object.keys(customFieldValues).length > 0) {
      await saveCustomFieldValues("page", id, customFieldValues);
    }
    return { success: true };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "A page with this slug already exists" };
    }
    console.error("Update page error:", error);
    return { success: false, error: "Failed to update page" };
  }
}

export async function deletePage(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.page.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Delete page error:", error);
    return { success: false, error: "Failed to delete page" };
  }
}
