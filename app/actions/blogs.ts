"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { unstable_cache, revalidateTag } from "next/cache";
import { saveCustomFieldValues } from "./custom-fields";

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
  status: string;
  publishedAt?: string;
};

export type BlogCustomValues = Record<string, string | number | boolean | null | undefined>;

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

export async function createBlog(data: BlogInput, customFieldValues?: BlogCustomValues) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  if (!data.title || data.title.length < 2) {
    return { success: false, error: "Title must be at least 2 characters" };
  }
  if (!data.slug || data.slug.length < 2) {
    return { success: false, error: "Slug is required" };
  }

  try {
    const created = await prisma.blog.create({
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

    if (customFieldValues && Object.keys(customFieldValues).length > 0) {
      await saveCustomFieldValues("blog", created.id, customFieldValues);
    }

    revalidateTag("blogs", { expire: 0 });
    return { success: true };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "A blog with this slug already exists" };
    }
    console.error("Create blog error:", error);
    return { success: false, error: "Failed to create blog" };
  }
}

export async function updateBlog(id: string, data: BlogInput, customFieldValues?: BlogCustomValues) {
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

    if (customFieldValues && Object.keys(customFieldValues).length > 0) {
      await saveCustomFieldValues("blog", id, customFieldValues);
    }

    revalidateTag("blogs", { expire: 0 });
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
    revalidateTag("blogs", { expire: 0 });
    return { success: true };
  } catch (error) {
    console.error("Delete blog error:", error);
    return { success: false, error: "Failed to delete blog" };
  }
}

// ─── Public blog queries (no auth required) ──────────────────────────────────

// Cross-request cached — read on the home page and the blogs listing page;
// changes only via admin CRUD, invalidated via the "blogs" tag in the mutations.
const getPublicBlogsCached = unstable_cache(
  async () =>
    prisma.blog.findMany({
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
    }),
  ["public-blogs"],
  { revalidate: 60, tags: ["blogs"] }
);

export async function getPublicBlogs() {
  return getPublicBlogsCached();
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
