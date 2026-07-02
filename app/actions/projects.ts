"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  customerId: z.string().optional(),
  teamId: z.string().optional(),
  serviceId: z.string().optional(),
  status: z.enum(["Published", "Draft"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export async function getProjects(page = 1, pageSize = 10) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [projects, total, published, drafts] = await Promise.all([
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { customer: true, team: true, service: true },
    }),
    prisma.project.count(),
    prisma.project.count({ where: { status: "Published" } }),
    prisma.project.count({ where: { status: "Draft" } }),
  ]);

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
    const { startDate, endDate, ...rest } = result.data;
    await prisma.project.create({
      data: {
        ...rest,
        customerId: rest.customerId || null,
        teamId: rest.teamId || null,
        serviceId: rest.serviceId || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });
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
    const { startDate, endDate, ...rest } = result.data;
    await prisma.project.update({
      where: { id },
      data: {
        ...rest,
        customerId: rest.customerId || null,
        teamId: rest.teamId || null,
        serviceId: rest.serviceId || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });
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
    return { success: true };
  } catch (error) {
    console.error("Delete project error:", error);
    return { success: false, error: "Failed to delete project" };
  }
}
