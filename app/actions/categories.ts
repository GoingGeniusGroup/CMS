"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(1, "Slug is required"),
  parent: z.string().optional(),
  order: z.number().default(0),
  banner: z.string().optional(),
  icon: z.string().optional(),
  link: z.string().optional(),
  status: z.enum(["Active", "Draft", "Inactive"]).default("Active"),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export async function getCategories(page = 1, pageSize = 10) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [categories, total, active, inactive] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.category.count(),
    prisma.category.count({ where: { status: "Active" } }),
    prisma.category.count({ where: { status: "Inactive" } }),
  ]);

  return {
    categories,
    total,
    active,
    inactive,
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize),
  };
}

export async function createCategory(data: CategoryInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = categorySchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const { parent, banner, icon, link, ...rest } = result.data;
    await prisma.category.create({
      data: {
        ...rest,
        parent: parent || null,
        banner: banner || null,
        icon: icon || null,
        link: link || null,
      },
    });
    return { success: true };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "A category with this slug already exists" };
    }
    console.error("Create category error:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(id: string, data: CategoryInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = categorySchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const { parent, banner, icon, link, ...rest } = result.data;
    await prisma.category.update({
      where: { id },
      data: {
        ...rest,
        parent: parent || null,
        banner: banner || null,
        icon: icon || null,
        link: link || null,
      },
    });
    return { success: true };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "A category with this slug already exists" };
    }
    console.error("Update category error:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.category.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Delete category error:", error);
    return { success: false, error: "Failed to delete category" };
  }
}
