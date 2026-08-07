"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { unstable_cache, updateTag } from "next/cache";
import { saveCustomFieldValues } from "./custom-fields";
import { serviceSlug } from "@/lib/service-slug";

const serviceSchema = z.object({
  serviceName: z.string().min(2, "Service name must be at least 2 characters"),
  description: z.string().optional(),
  category: z.string().optional(),
  basePrice: z.number().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  thumbnailUrl: z.string().optional(),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

// Get all services (lightweight, for dropdowns)
export async function getServices() {
  return await prisma.service.findMany({
    select: {
      id: true,
      serviceName: true,
    },
    orderBy: {
      serviceName: "asc",
    },
  });
}

// Get active services for public/user-facing pages (no auth required).
// Cross-request cached — read on the home page and the services page; changes
// only via admin CRUD, invalidated below via the "services" tag.
const getPublicServicesCached = unstable_cache(
  async () =>
    prisma.service.findMany({
      where: { isActive: true },
      select: {
        id: true,
        serviceName: true,
        description: true,
        category: true,
        thumbnailUrl: true,
        isFeatured: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ["public-services"],
  { revalidate: 60, tags: ["services"] }
);

export async function getPublicServices() {
  return getPublicServicesCached();
}

// Get paginated services with stats
export async function getServicesPaginated(page = 1, pageSize = 10) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [services, total, active, inactive] = await Promise.all([
    prisma.service.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.service.count(),
    prisma.service.count({ where: { isActive: true } }),
    prisma.service.count({ where: { isActive: false } }),
  ]);

  return {
    services,
    total,
    active,
    inactive,
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize),
  };
}

export async function getServiceBySlug(slug: string) {
  const services = await prisma.service.findMany();
  return services.find((s) => serviceSlug(s.serviceName) === slug) || null;
}

// Create a service
export async function createService(data: ServiceInput, customFieldValues?: Record<string, string | number | boolean | null | undefined>) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = serviceSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const created = await prisma.service.create({ data: result.data });
    if (customFieldValues && Object.keys(customFieldValues).length > 0) {
      await saveCustomFieldValues("service", created.id, customFieldValues);
    }
    updateTag("services");
    return { success: true };
  } catch (error) {
    console.error("Create service error:", error);
    return { success: false, error: "Failed to create service" };
  }
}

// Update a service
export async function updateService(id: string, data: ServiceInput, customFieldValues?: Record<string, string | number | boolean | null | undefined>) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = serviceSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    await prisma.service.update({ where: { id }, data: result.data });
    if (customFieldValues && Object.keys(customFieldValues).length > 0) {
      await saveCustomFieldValues("service", id, customFieldValues);
    }
    updateTag("services");
    return { success: true };
  } catch (error) {
    console.error("Update service error:", error);
    return { success: false, error: "Failed to update service" };
  }
}

// Delete a service
export async function deleteService(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.service.delete({ where: { id } });
    updateTag("services");
    return { success: true };
  } catch (error) {
    console.error("Delete service error:", error);
    return { success: false, error: "Failed to delete service" };
  }
}