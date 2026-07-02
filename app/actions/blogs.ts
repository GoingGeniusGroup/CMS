"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const blogSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required"),
  content: z.string().optional(),
  category: z.string().optional(),
  authorId: z.string().optional(),
  status: z.enum(["Published", "Draft"]),
  publishedAt: z.string().optional(),
});

export type BlogInput = z.infer<typeof blogSchema>;

export async function getBlogs(page = 1, pageSize = 10) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { author: true },
    }),
    prisma.blog.count(),
  ]);

  const published = await prisma.blog.count({ where: { status: "Published" } });
  const drafts = await prisma.blog.count({ where: { status: "Draft" } });

  return {
    blogs,
    total,
    published,
    drafts,
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize),
  };
}

export async function createBlog(data: BlogInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = blogSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const { publishedAt, ...rest } = result.data;
    await prisma.blog.create({
      data: {
        ...rest,
        publishedAt: publishedAt ? new Date(publishedAt) : rest.status === "Published" ? new Date() : null,
      },
    });
    return { success: true };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "A blog with this slug already exists" };
    }
    console.error("Create blog error:", error);
    return { success: false, error: "Failed to create blog" };
  }
}

export async function updateBlog(id: string, data: BlogInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = blogSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const { publishedAt, ...rest } = result.data;
    await prisma.blog.update({
      where: { id },
      data: {
        ...rest,
        publishedAt: publishedAt ? new Date(publishedAt) : rest.status === "Published" ? new Date() : null,
      },
    });
    return { success: true };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "A blog with this slug already exists" };
    }
    console.error("Update blog error:", error);
    return { success: false, error: "Failed to update blog" };
  }
}

export async function deleteBlog(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.blog.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Delete blog error:", error);
    return { success: false, error: "Failed to delete blog" };
  }
}
