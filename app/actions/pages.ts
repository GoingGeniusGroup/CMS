"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const pageSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required"),
  content: z.string().optional(),
  thumbnail: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  keywords: z.string().optional(),
  metaImage: z.string().optional(),
  status: z.enum(["Published", "Draft"]).default("Draft"),
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

export async function createPage(data: PageInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = pageSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    await prisma.page.create({ data: result.data });
    return { success: true };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "A page with this slug already exists" };
    }
    console.error("Create page error:", error);
    return { success: false, error: "Failed to create page" };
  }
}

export async function updatePage(id: string, data: PageInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = pageSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    await prisma.page.update({ where: { id }, data: result.data });
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
