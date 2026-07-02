"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/lib/generated/prisma";
import { z } from "zod";

// ─── Validation Schemas ────────────────────────────────────────────────────

const customerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email address"),
  phoneNumber: z.string().min(6, "Enter a valid phone number").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  servicesID: z.string().optional().or(z.literal("")),
  companyName: z.string().optional().or(z.literal("")),
  status: z.enum(["Active", "Inactive"]).default("Active"),
  image: z.string().default("https://api.dicebear.com/7.x/avataaars/svg?seed=default"),
});

export type CustomerInput = z.infer<typeof customerSchema>;

// ─── Helper: resolve a service id, fall back to null (NA) if invalid ──────

async function resolveServiceId(serviceId: string | null | undefined): Promise<string | null> {
  if (!serviceId) return null;
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    console.warn(`Service id "${serviceId}" not found — storing as NA`);
    return null;
  }
  return service.id;
}

// ─── Read: Get all customers ───────────────────────────────────────────────

export async function getCustomers(page = 1, pageSize = 10, search = "") {
  try {
    const skip = (page - 1) * pageSize;

    const where = search
      ? {
        OR: [
          { fullName: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { phoneNumber: { contains: search, mode: "insensitive" as const } },
          { companyName: { contains: search, mode: "insensitive" as const } },
        ],
      }
      : {};

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          invoices: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { status: true },
          },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      success: true,
      customers,
      total,
      pageCount: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("getCustomers error:", error);
    return { success: false, error: "Failed to fetch customers", customers: [], total: 0, pageCount: 0 };
  }
}

// ─── Read: Get customer stats ──────────────────────────────────────────────

export async function getCustomerStats() {
  try {
    const [total, active, thisMonth] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({ where: { status: "Active" } }),
      prisma.customer.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    return { success: true, total, active, newThisMonth: thisMonth };
  } catch (error) {
    console.error("getCustomerStats error:", error);
    return { success: false, total: 0, active: 0, newThisMonth: 0 };
  }
}

// ─── Read: Get single customer ─────────────────────────────────────────────

export async function getCustomerById(id: string) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        invoices: { orderBy: { createdAt: "desc" } },
        projects: true,
      },
    });

    if (!customer) return { success: false, error: "Customer not found" };

    return { success: true, customer };
  } catch (error) {
    console.error("getCustomerById error:", error);
    return { success: false, error: "Failed to fetch customer" };
  }
}

// ─── Create ────────────────────────────────────────────────────────────────

export async function createCustomer(data: CustomerInput) {
  try {
    const validated = customerSchema.parse(data);

    // Deduplicate email
    const existing = await prisma.customer.findUnique({
      where: { email: validated.email },
    });
    if (existing) return { success: false, error: "Email already exists" };

    // Resolve the service id — if it doesn't exist, store null (NA) instead of failing
    const serviceId = await resolveServiceId(validated.servicesID || null);

    const customer = await prisma.customer.create({
      data: {
        fullName: validated.fullName,
        email: validated.email,
        phoneNumber: validated.phoneNumber || null,
        address: validated.address || null,
        serviceId: serviceId,
        companyName: validated.companyName || null,
        status: validated.status,
        image: validated.image,
      },
    });

    revalidatePath("/customer");
    return { success: true, customer };
  } catch (error) {
    console.error("createCustomer error:", error);

    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return { success: false, error: "Selected service is invalid" };
    }
    return { success: false, error: "Failed to create customer" };
  }
}

// ─── Update ────────────────────────────────────────────────────────────────

export async function updateCustomer(id: string, data: Partial<CustomerInput>) {
  try {
    const existing = await prisma.customer.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Customer not found" };

    // If email changed, check uniqueness
    if (data.email && data.email !== existing.email) {
      const emailTaken = await prisma.customer.findUnique({
        where: { email: data.email },
      });
      if (emailTaken) return { success: false, error: "Email already in use" };
    }

    // Resolve service id if it's part of this update — fall back to null (NA) if invalid
    const serviceId =
      data.servicesID!== undefined ? await resolveServiceId(data.servicesID || null) : undefined;

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(data.fullName !== undefined && { fullName: data.fullName }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber || null }),
        ...(data.address !== undefined && { address: data.address || null }),
        ...(serviceId !== undefined && { services: serviceId }),
        ...(data.companyName !== undefined && { companyName: data.companyName || null }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.image !== undefined && { image: data.image }),
      },
    });

    revalidatePath("/customer");
    return { success: true, customer };
  } catch (error) {
    console.error("updateCustomer error:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return { success: false, error: "Selected service is invalid" };
    }
    return { success: false, error: "Failed to update customer" };
  }
}

// ─── Delete ────────────────────────────────────────────────────────────────

export async function deleteCustomer(id: string) {
  try {
    const existing = await prisma.customer.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Customer not found" };

    await prisma.customer.delete({ where: { id } });

    revalidatePath("/customer");
    return { success: true };
  } catch (error) {
    console.error("deleteCustomer error:", error);
    return { success: false, error: "Failed to delete customer" };
  }
}
