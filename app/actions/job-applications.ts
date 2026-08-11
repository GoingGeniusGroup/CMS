"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { createNotification } from "./notifications";

export type JobApplicationInput = {
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  experienceLevel?: string;
  totalExperience?: string;
  currentPosition?: string;
  expectedSalary?: string;
  coverLetter?: string;
  skills?: string;
};

export type JobApplicationRow = {
  id: string;
  jobId: string;
  jobTitle: string;
  jobDepartment: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experienceLevel: string;
  totalExperience: string;
  currentPosition: string;
  expectedSalary: string;
  coverLetter: string;
  skills: string;
  status: string;
  createdAt: Date;
};

// ─── Public: Submit application (no auth) ────────────────────────────────────

export async function submitJobApplication(data: JobApplicationInput) {
  try {
    if (!data.fullName?.trim()) return { success: false, error: "Full name is required" };
    if (!data.email?.trim()) return { success: false, error: "Email is required" };
    if (!data.phone?.trim()) return { success: false, error: "Phone number is required" };
    if (!data.jobId?.trim()) return { success: false, error: "Job ID is required" };

    // Verify the job exists
    const job = await prisma.job.findUnique({ where: { id: data.jobId }, select: { title: true, department: true } });
    if (!job) return { success: false, error: "Job not found" };

    await prisma.jobApplication.create({
      data: {
        jobId: data.jobId,
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        location: data.location?.trim() || "",
        experienceLevel: data.experienceLevel || "",
        totalExperience: data.totalExperience?.trim() || "",
        currentPosition: data.currentPosition?.trim() || "",
        expectedSalary: data.expectedSalary?.trim() || "",
        coverLetter: data.coverLetter?.trim() || "",
        skills: data.skills?.trim() || "",
      },
    });

    // Fire notification
    await createNotification({
      type: "career_application",
      title: "New career application",
      message: `${data.fullName} applied for ${job.title}`,
      link: "/careers/applicants",
    });

    return { success: true };
  } catch (error) {
    console.error("submitJobApplication error:", error);
    return { success: false, error: "Failed to submit application. Please try again." };
  }
}

// ─── Admin: Get all applications ─────────────────────────────────────────────

export async function getJobApplications(filters?: {
  jobId?: string;
  status?: string;
  search?: string;
}): Promise<JobApplicationRow[]> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const where: Record<string, unknown> = {};
  if (filters?.jobId) where.jobId = filters.jobId;
  if (filters?.status && filters.status !== "all") where.status = filters.status;
  if (filters?.search) {
    where.OR = [
      { fullName: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
      { phone: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const rows = await prisma.jobApplication.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  // Batch-fetch job titles
  const jobIds = [...new Set(rows.map((r) => r.jobId))];
  const jobs = await prisma.job.findMany({
    where: { id: { in: jobIds } },
    select: { id: true, title: true, department: true },
  });
  const jobMap = new Map(jobs.map((j) => [j.id, j]));

  return rows.map((r) => ({
    id: r.id,
    jobId: r.jobId,
    jobTitle: jobMap.get(r.jobId)?.title || "Unknown",
    jobDepartment: jobMap.get(r.jobId)?.department || "",
    fullName: r.fullName,
    email: r.email,
    phone: r.phone,
    location: r.location,
    experienceLevel: r.experienceLevel,
    totalExperience: r.totalExperience,
    currentPosition: r.currentPosition,
    expectedSalary: r.expectedSalary,
    coverLetter: r.coverLetter,
    skills: r.skills,
    status: r.status,
    createdAt: r.createdAt,
  }));
}

// ─── Admin: Update application status ────────────────────────────────────────

export async function updateApplicationStatus(id: string, status: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  await prisma.jobApplication.update({ where: { id }, data: { status } });
  return { success: true };
}

// ─── Admin: Delete application ───────────────────────────────────────────────

export async function deleteJobApplication(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  await prisma.jobApplication.delete({ where: { id } });
  return { success: true };
}

// ─── Admin: Get application count per job ────────────────────────────────────

export async function getApplicationCountByJob(jobId: string): Promise<number> {
  return prisma.jobApplication.count({ where: { jobId } });
}

// ─── Admin: Get total application stats ──────────────────────────────────────

export async function getApplicationStats() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [total, newCount, reviewed, shortlisted, rejected] = await Promise.all([
    prisma.jobApplication.count(),
    prisma.jobApplication.count({ where: { status: "New" } }),
    prisma.jobApplication.count({ where: { status: "Reviewed" } }),
    prisma.jobApplication.count({ where: { status: "Shortlisted" } }),
    prisma.jobApplication.count({ where: { status: "Rejected" } }),
  ]);

  return { total, new: newCount, reviewed, shortlisted, rejected };
}
