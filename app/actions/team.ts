"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { unstable_cache, updateTag } from "next/cache";
import { saveCustomFieldValues } from "./custom-fields";

const teamMemberSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  image: z.string().optional(),
  role: z.string().optional(),
  department: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  bio: z.string().optional(),
  location: z.string().optional(),
  experience: z.string().optional(),
  skills: z.array(z.string()).optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
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

// Cross-request cached read (Data Cache) with a short TTL. Because departments
// change rarely, this dedupes the repeated/duplicate calls (e.g. from modals
// mounting) down to one DB query, invalidated on mutation via the "departments" tag.
const getDepartmentsCached = unstable_cache(
  async () =>
    prisma.department.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
    }),
  ["departments-list"],
  { revalidate: 60, tags: ["departments"] }
);

export async function getDepartments() {
  return getDepartmentsCached();
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
    updateTag("departments");
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
    updateTag("departments");
    return { success: true };
  } catch (error) {
    console.error("Delete department error:", error);
    return { success: false, error: "Failed to delete department" };
  }
}

export async function createTeamMember(data: TeamMemberInput, customFieldValues?: Record<string, string | number | boolean | null | undefined>) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = teamMemberSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const created = await prisma.team.create({ data: result.data });
    if (customFieldValues && Object.keys(customFieldValues).length > 0) {
      await saveCustomFieldValues("team", created.id, customFieldValues);
    }
    updateTag("team-members");
    return { success: true };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "A team member with this email already exists" };
    }
    console.error("Create team member error:", error);
    return { success: false, error: "Failed to create team member" };
  }
}

export async function updateTeamMember(id: string, data: TeamMemberInput, customFieldValues?: Record<string, string | number | boolean | null | undefined>) {
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
    if (customFieldValues && Object.keys(customFieldValues).length > 0) {
      await saveCustomFieldValues("team", id, customFieldValues);
    }
    updateTag("team-members");
    return { success: true };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "A team member with this email already exists" };
    }
    console.error("Update team member error:", error);
    return { success: false, error: "Failed to update team member" };
  }
}

// Get active team members for public/user-facing pages (no auth required).
// Cross-request cached — read on the home page and teams page; changes only via
// admin CRUD, invalidated via the "team-members" tag in the mutations below.
const getPublicTeamMembersCached = unstable_cache(
  async () =>
    prisma.team.findMany({
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
        facebook: true,
        twitter: true,
        instagram: true,
        linkedin: true,
        website: true,
      },
      orderBy: { joinedAt: "asc" },
    }),
  ["public-team-members"],
  { revalidate: 60, tags: ["team-members"] }
);

export async function getPublicTeamMembers() {
  return getPublicTeamMembersCached();
}

export async function deleteTeamMember(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.team.delete({ where: { id } });
    updateTag("team-members");
    return { success: true };
  } catch (error) {
    console.error("Delete team member error:", error);
    return { success: false, error: "Failed to delete team member" };
  }
}
