"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  category: z.string().min(2, "Category is required"),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  status: z.enum(["Published", "Draft"]),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export async function getProjects(page = 1, pageSize = 10) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.project.count(),
  ]);

  const published = await prisma.project.count({ where: { status: "Published" } });
  const drafts = await prisma.project.count({ where: { status: "Draft" } });

  return {
    projects,
    total,
    published,
    drafts,
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize),
  };
}

export async function createProject(data: ProjectInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = projectSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    await prisma.project.create({ data: result.data });
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Create project error:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProject(id: string, data: ProjectInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = projectSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    await prisma.project.update({
      where: { id },
      data: result.data,
    });
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Update project error:", error);
    return { success: false, error: "Failed to update project" };
  }
}

export async function deleteProject(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Delete project error:", error);
    return { success: false, error: "Failed to delete project" };
  }
}
