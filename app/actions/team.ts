"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const teamMemberSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  image: z.string().optional(),
  role: z.string().optional(),
  department: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
  bio: z.string().optional(),
  location: z.string().optional(),
  experience: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;

export async function getTeamMembers(page = 1, pageSize = 10) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [members, total, active, inactive] = await Promise.all([
    prisma.team.findMany({
      orderBy: { joinedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.team.count(),
    prisma.team.count({ where: { status: "Active" } }),
    prisma.team.count({ where: { status: "Inactive" } }),
  ]);

  return {
    members,
    total,
    active,
    inactive,
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize),
  };
}

// ─── Departments ──────────────────────────────────────────────────────────

export async function getDepartments() {
  return await prisma.department.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
}

export async function createDepartment(name: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const trimmed = name.trim();
  if (!trimmed) return { success: false, error: "Department name is required" };

  try {
    const count = await prisma.department.count();
    const department = await prisma.department.create({
      data: { name: trimmed, order: count },
    });
    return { success: true, department };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "This department already exists" };
    }
    console.error("Create department error:", error);
    return { success: false, error: "Failed to create department" };
  }
}

export async function deleteDepartment(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.department.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Delete department error:", error);
    return { success: false, error: "Failed to delete department" };
  }
}

export async function createTeamMember(data: TeamMemberInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = teamMemberSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    await prisma.team.create({ data: result.data });
    return { success: true };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "A team member with this email already exists" };
    }
    console.error("Create team member error:", error);
    return { success: false, error: "Failed to create team member" };
  }
}

export async function updateTeamMember(id: string, data: TeamMemberInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = teamMemberSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    await prisma.team.update({
      where: { id },
      data: result.data,
    });
    return { success: true };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "A team member with this email already exists" };
    }
    console.error("Update team member error:", error);
    return { success: false, error: "Failed to update team member" };
  }
}

// Get active team members for public/user-facing pages (no auth required)
export async function getPublicTeamMembers() {
  return await prisma.team.findMany({
    where: { status: "Active" },
    select: {
      id: true,
      fullName: true,
      role: true,
      department: true,
      image: true,
      bio: true,
      location: true,
      experience: true,
      skills: true,
      email: true,
      phone: true,
    },
    orderBy: { joinedAt: "asc" },
  });
}

export async function deleteTeamMember(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.team.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Delete team member error:", error);
    return { success: false, error: "Failed to delete team member" };
  }
}
