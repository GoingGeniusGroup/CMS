"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { unstable_cache, revalidateTag } from "next/cache";
import { saveCustomFieldValues } from "./custom-fields";

const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  overview: z.string().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  liveUrl: z.string().optional().or(z.literal("")),
  customerId: z.string().optional().or(z.literal("")),
  teamId: z.string().optional().or(z.literal("")),
  serviceId: z.string().optional().or(z.literal("")),
  status: z.string().min(1, "Status is required"),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  budget: z.number().optional(),
  thumbnail: z.string().optional().or(z.literal("")).nullable(),
  gallery: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  challenges: z.array(z.string()).optional(),
  solutions: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  features: z.any().optional(),
  results: z.any().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type CustomValuesMap = Record<string, string | number | boolean | null | undefined>;

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

// Get published projects for public/user-facing pages (no auth required).
// Cross-request cached — read on the home page and portfolio/projects pages;
// changes only via admin CRUD, invalidated below via the "projects" tag.
const getPublicProjectsCached = unstable_cache(
  async () =>
    prisma.project.findMany({
      where: { status: "Published" },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        category: true,
        thumbnail: true,
        budget: true,
        liveUrl: true,
        startDate: true,
        endDate: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ["public-projects"],
  { revalidate: 60, tags: ["projects"] }
);

export async function getPublicProjects() {
  return getPublicProjectsCached();
}

export async function createProject(data: ProjectInput, customFieldValues?: CustomValuesMap) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = projectSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const { startDate, endDate, thumbnail, features, results: projectResults, ...rest } = result.data;
    const created = await prisma.project.create({
      data: {
        ...rest,
        slug: rest.slug || null,
        customerId: rest.customerId || null,
        teamId: rest.teamId || null,
        serviceId: rest.serviceId || null,
        overview: rest.overview || null,
        category: rest.category || null,
        liveUrl: rest.liveUrl || null,
        thumbnail: thumbnail || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        gallery: rest.gallery ?? [],
        highlights: rest.highlights ?? [],
        challenges: rest.challenges ?? [],
        solutions: rest.solutions ?? [],
        technologies: rest.technologies ?? [],
        features: features ?? undefined,
        results: projectResults ?? undefined,
      },
    });

    if (customFieldValues && Object.keys(customFieldValues).length > 0) {
      await saveCustomFieldValues("project", created.id, customFieldValues);
    }

    // Fire notification
    const { createNotification } = await import("./notifications");
    await createNotification({
      type: "project_updated",
      title: "New project created",
      message: `Project "${result.data.title}" was created`,
      link: "/projects",
    });

    revalidateTag("projects", { expire: 0 });
    return { success: true };
  } catch (error) {
    console.error("Create project error:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProject(id: string, data: ProjectInput, customFieldValues?: CustomValuesMap) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = projectSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const { startDate, endDate, thumbnail, features, results: projectResults, ...rest } = result.data;
    await prisma.project.update({
      where: { id },
      data: {
        ...rest,
        slug: rest.slug || null,
        customerId: rest.customerId || null,
        teamId: rest.teamId || null,
        serviceId: rest.serviceId || null,
        overview: rest.overview || null,
        category: rest.category || null,
        liveUrl: rest.liveUrl || null,
        thumbnail: thumbnail || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        gallery: rest.gallery ?? [],
        highlights: rest.highlights ?? [],
        challenges: rest.challenges ?? [],
        solutions: rest.solutions ?? [],
        technologies: rest.technologies ?? [],
        features: features ?? undefined,
        results: projectResults ?? undefined,
      },
    });

    if (customFieldValues && Object.keys(customFieldValues).length > 0) {
      await saveCustomFieldValues("project", id, customFieldValues);
    }

    // Fire notification
    const { createNotification } = await import("./notifications");
    await createNotification({
      type: "project_updated",
      title: "Project updated",
      message: `Project "${result.data.title}" was updated`,
      link: "/projects",
    });

    revalidateTag("projects", { expire: 0 });
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
    revalidateTag("projects", { expire: 0 });
    return { success: true };
  } catch (error) {
    console.error("Delete project error:", error);
    return { success: false, error: "Failed to delete project" };
  }
}
