"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export type JobRow = {
  id: string;
  title: string;
  department: string;
  type: string;
  mode: string;
  location: string;
  salaryRange: string;
  experience: string;
  vacanciesCount: number;
  deadline: string | null;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  thumbnailUrl: string;
  applicantsCount: number;
  createdAt: string;
  updatedAt: string;
};

function toJobRow(job: {
  id: string;
  title: string;
  department: string;
  type: string;
  mode: string;
  location: string;
  salaryRange: string;
  experience: string;
  vacanciesCount: number;
  deadline: Date | null;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  thumbnailUrl: string;
  createdAt: Date;
  updatedAt: Date;
  applicants: { id: string }[];
}): JobRow {
  return {
    id: job.id,
    title: job.title,
    department: job.department,
    type: job.type,
    mode: job.mode,
    location: job.location,
    salaryRange: job.salaryRange,
    experience: job.experience,
    vacanciesCount: job.vacanciesCount,
    deadline: job.deadline ? job.deadline.toISOString().split("T")[0] : null,
    isActive: job.isActive,
    isFeatured: job.isFeatured,
    tags: job.tags,
    description: job.description,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
    thumbnailUrl: job.thumbnailUrl,
    applicantsCount: job.applicants?.length ?? 0,
    createdAt: job.createdAt.toISOString().split("T")[0],
    updatedAt: job.updatedAt.toISOString().split("T")[0],
  };
}

export async function getJobs(page = 1, pageSize = 10) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const skip = (page - 1) * pageSize;

  const [total, active, inactive, items] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where: { isActive: true } }),
    prisma.job.count({ where: { isActive: false } }),
    prisma.job.findMany({
      skip,
      take: pageSize,
      include: { applicants: { select: { id: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    total,
    active,
    inactive,
    jobs: items.map(toJobRow),
  };
}

export async function getPublicJobs() {
  const rows = await prisma.job.findMany({
    where: { isActive: true },
    include: { applicants: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toJobRow);
}

export type JobInput = {
  title: string;
  department: string;
  type: string;
  mode: string;
  location: string;
  salaryRange: string;
  experience: string;
  vacanciesCount: number;
  deadline: string | null;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  thumbnailUrl: string;
};

export async function getJobById(id: string): Promise<JobRow | null> {
  const job = await prisma.job.findUnique({
    where: { id },
    include: { applicants: { select: { id: true } } },
  });
  return job ? toJobRow(job) : null;
}

export async function createJob(data: JobInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" as const };

  try {
    await prisma.job.create({
      data: {
        title: data.title,
        department: data.department,
        type: data.type,
        mode: data.mode,
        location: data.location,
        salaryRange: data.salaryRange,
        experience: data.experience,
        vacanciesCount: data.vacanciesCount,
        deadline: data.deadline ? new Date(data.deadline) : null,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        tags: data.tags,
        description: data.description,
        responsibilities: data.responsibilities,
        requirements: data.requirements,
        thumbnailUrl: data.thumbnailUrl,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("createJob error:", error);
    return { success: false, error: "Failed to create job" as const };
  }
}

export async function updateJob(id: string, data: JobInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" as const };

  try {
    await prisma.job.update({
      where: { id },
      data: {
        title: data.title,
        department: data.department,
        type: data.type,
        mode: data.mode,
        location: data.location,
        salaryRange: data.salaryRange,
        experience: data.experience,
        vacanciesCount: data.vacanciesCount,
        deadline: data.deadline ? new Date(data.deadline) : null,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        tags: data.tags,
        description: data.description,
        responsibilities: data.responsibilities,
        requirements: data.requirements,
        thumbnailUrl: data.thumbnailUrl,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("updateJob error:", error);
    return { success: false, error: "Failed to update job" as const };
  }
}

export async function deleteJob(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" as const };

  try {
    await prisma.job.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("deleteJob error:", error);
    return { success: false, error: "Failed to delete job" as const };
  }
}
