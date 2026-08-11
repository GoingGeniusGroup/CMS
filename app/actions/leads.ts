"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { Prisma } from "@/lib/generated/prisma";
import { z } from "zod";
import { saveCustomFieldValues } from "@/app/actions/custom-fields";

// ─── Validation Schemas ────────────────────────────────────────────────────

const leadSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email address"),
  phone: z.string().default(""),
  company: z.string().default(""),
  subject: z.string().default(""),
  message: z.string().default(""),
  serviceInterest: z.string().default(""),
  budget: z.string().default(""),
  status: z.string().min(1, "Status is required").default("New"),
});

export type LeadInput = z.infer<typeof leadSchema>;

// ─── Public: Submit a lead from the contact form ───────────────────────────
// Called from the public /contact page — intentionally NOT auth-guarded.

export async function submitContactLead(data: unknown) {
  try {
    const validated = leadSchema.parse(data);

    await prisma.lead.create({
      data: {
        fullName: validated.fullName,
        email: validated.email,
        phone: validated.phone,
        company: validated.company,
        subject: validated.subject,
        message: validated.message,
        serviceInterest: validated.serviceInterest,
        budget: validated.budget,
        status: "New",
      },
    });

    // Fire notification
    const { createNotification } = await import("./notifications");
    await createNotification({
      type: "contact_message",
      title: "New contact message",
      message: `${validated.fullName} sent you a message${validated.subject ? `: ${validated.subject}` : ""}`,
      link: "/leads",
    });

    return { success: true };
  } catch (error) {
    console.error("submitContactLead error:", error);

    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to send your message. Please try again." };
  }
}

// ─── Read: List leads (admin) ───────────────────────────────────────────────

export async function getLeads(
  page = 1,
  pageSize = 10,
  search = "",
  statusFilter = ""
) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
        { phone: { contains: search, mode: "insensitive" as const } },
        { company: { contains: search, mode: "insensitive" as const } },
        { subject: { contains: search, mode: "insensitive" as const } },
      ];
    }
    if (statusFilter && statusFilter !== "all") {
      where.status = statusFilter;
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.lead.count({ where }),
    ]);

    return {
      success: true,
      leads,
      total,
      pageCount: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("getLeads error:", error);
    return { success: false, error: "Failed to fetch leads", leads: [], total: 0, pageCount: 0 };
  }
}

// ─── Read: Get lead stats (admin) ──────────────────────────────────────────

export async function getLeadStats() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    const [total, newLeads, contacted] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "New" } }),
      prisma.lead.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    return { success: true, total, newLeads, thisMonth: contacted };
  } catch (error) {
    console.error("getLeadStats error:", error);
    return { success: false, total: 0, newLeads: 0, thisMonth: 0 };
  }
}

// ─── Read: Get single lead (admin) ─────────────────────────────────────────

export async function getLeadById(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return { success: false, error: "Lead not found" };
    return { success: true, lead };
  } catch (error) {
    console.error("getLeadById error:", error);
    return { success: false, error: "Failed to fetch lead" };
  }
}

// ─── Create (admin, manual) ────────────────────────────────────────────────

export async function createLead(data: LeadInput, customFieldValues?: Record<string, string | number | boolean | null | undefined>) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const validated = leadSchema.parse(data);

    const lead = await prisma.lead.create({
      data: {
        fullName: validated.fullName,
        email: validated.email,
        phone: validated.phone,
        company: validated.company,
        subject: validated.subject,
        message: validated.message,
        serviceInterest: validated.serviceInterest,
        budget: validated.budget,
        status: validated.status,
      },
    });

    if (customFieldValues && Object.keys(customFieldValues).length > 0) {
      await saveCustomFieldValues("lead", lead.id, customFieldValues);
    }

    // Fire notification
    const { createNotification } = await import("./notifications");
    await createNotification({
      type: "lead_received",
      title: "New lead received",
      message: `${validated.fullName} — ${validated.subject || validated.serviceInterest || "General inquiry"}`,
      link: "/leads",
    });

    revalidatePath("/leads");
    return { success: true, lead };
  } catch (error) {
    console.error("createLead error:", error);

    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to create lead" };
  }
}

// ─── Update (admin) ────────────────────────────────────────────────────────

export async function updateLead(
  id: string,
  data: Partial<LeadInput>,
  customFieldValues?: Record<string, string | number | boolean | null | undefined>
) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Lead not found" };

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...(data.fullName !== undefined && { fullName: data.fullName }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.company !== undefined && { company: data.company }),
        ...(data.subject !== undefined && { subject: data.subject }),
        ...(data.message !== undefined && { message: data.message }),
        ...(data.serviceInterest !== undefined && { serviceInterest: data.serviceInterest }),
        ...(data.budget !== undefined && { budget: data.budget }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });

    if (customFieldValues && Object.keys(customFieldValues).length > 0) {
      await saveCustomFieldValues("lead", id, customFieldValues);
    }

    revalidatePath("/leads");
    return { success: true, lead };
  } catch (error) {
    console.error("updateLead error:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return { success: false, error: "Invalid service selected" };
    }
    return { success: false, error: "Failed to update lead" };
  }
}

// ─── Delete (admin) ────────────────────────────────────────────────────────

export async function deleteLead(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Lead not found" };

    await prisma.lead.delete({ where: { id } });
    revalidatePath("/leads");
    return { success: true };
  } catch (error) {
    console.error("deleteLead error:", error);
    return { success: false, error: "Failed to delete lead" };
  }
}