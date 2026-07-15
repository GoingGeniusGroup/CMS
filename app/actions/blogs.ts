"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const blogSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required"),
  content: z.any().optional(), // Tiptap JSON content
  category: z.string().optional(),
  authorId: z.string().optional(),
  thumbnail: z.string().optional(),
  status: z.enum(["Published", "Draft"]),
  publishedAt: z.string().optional(),
});

export type BlogInput = {
  title: string;
  slug: string;
  content?: unknown;
  excerpt?: string;
  category?: string;
  tags?: string[];
  readTime?: string;
  authorId?: string;
  thumbnail?: string;
  status: "Published" | "Draft";
  publishedAt?: string;
};

export async function getBlogs(page = 1, pageSize = 10) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [blogs, total, published, drafts] = await Promise.all([
    prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { author: true },
    }),
    prisma.blog.count(),
    prisma.blog.count({ where: { status: "Published" } }),
    prisma.blog.count({ where: { status: "Draft" } }),
  ]);

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

  if (!data.title || data.title.length < 2) {
    return { success: false, error: "Title must be at least 2 characters" };
  }
  if (!data.slug || data.slug.length < 2) {
    return { success: false, error: "Slug is required" };
  }

  try {
    await prisma.blog.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content ? (data.content as object) : undefined,
        excerpt: data.excerpt || null,
        category: data.category || null,
        tags: data.tags ?? [],
        readTime: data.readTime || null,
        authorId: data.authorId || null,
        thumbnail: data.thumbnail || null,
        status: data.status,
        publishedAt: data.publishedAt
          ? new Date(data.publishedAt)
          : data.status === "Published"
            ? new Date()
            : null,
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

  if (!data.title || data.title.length < 2) {
    return { success: false, error: "Title must be at least 2 characters" };
  }
  if (!data.slug || data.slug.length < 2) {
    return { success: false, error: "Slug is required" };
  }

  try {
    await prisma.blog.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content ? (data.content as object) : undefined,
        excerpt: data.excerpt || null,
        category: data.category || null,
        tags: data.tags ?? [],
        readTime: data.readTime || null,
        authorId: data.authorId || null,
        thumbnail: data.thumbnail || null,
        status: data.status,
        publishedAt: data.publishedAt
          ? new Date(data.publishedAt)
          : data.status === "Published"
            ? new Date()
            : null,
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

// ─── Public blog queries (no auth required) ──────────────────────────────────

export async function getPublicBlogs() {
  return await prisma.blog.findMany({
    where: { status: "Published" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      category: true,
      tags: true,
      readTime: true,
      thumbnail: true,
      publishedAt: true,
      createdAt: true,
      author: { select: { fullName: true, image: true } },
    },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPublicBlogBySlug(slug: string) {
  return await prisma.blog.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      excerpt: true,
      category: true,
      tags: true,
      readTime: true,
      thumbnail: true,
      publishedAt: true,
      createdAt: true,
      author: { select: { fullName: true, image: true } },
    },
  });
}
