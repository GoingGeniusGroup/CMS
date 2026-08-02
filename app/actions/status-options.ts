"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { getStatusOptionsMap } from "@/lib/status-options";
import { STATUS_MODULES } from "@/lib/config/status-options";
import { z } from "zod";

export type StatusOptionInput = {
  id?: string;
  moduleKey: string;
  statusValue: string;
  label: string;
  color: string;
  sortOrder: number;
  isDefault: boolean;
  isActive: boolean;
};

const statusSchema = z.object({
  moduleKey: z.string().min(1),
  statusValue: z.string().min(1, "Status value is required"),
  label: z.string().min(1, "Display label is required"),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Color must be a hex value like #16a34a")
    .default("#6b7280"),
  sortOrder: z.number().int().default(0),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export async function getStatusOptionsForAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const rows = await prisma.statusOption.findMany({
    orderBy: [{ moduleKey: "asc" }, { sortOrder: "asc" }],
  });

  return rows.map((row) => ({
    id: row.id,
    moduleKey: row.moduleKey,
    statusValue: row.statusValue,
    label: row.label,
    color: row.color,
    sortOrder: row.sortOrder,
    isDefault: row.isDefault,
    isActive: row.isActive,
  }));
}

export async function saveStatusOption(data: StatusOptionInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = statusSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? "Invalid status" };
  }

  try {
    const parsed = result.data;
    const payload = {
      moduleKey: parsed.moduleKey,
      statusValue: parsed.statusValue,
      label: parsed.label,
      color: parsed.color,
      sortOrder: parsed.sortOrder,
      isDefault: parsed.isDefault,
      isActive: parsed.isActive,
    };

    if (parsed.isDefault) {
      await prisma.statusOption.updateMany({
        where: { moduleKey: parsed.moduleKey, isDefault: true },
        data: { isDefault: false },
      });
    }

    if (data.id) {
      await prisma.statusOption.update({ where: { id: data.id }, data: payload });
      return { success: true, id: data.id };
    } else {
      const created = await prisma.statusOption.create({ data: payload });
      return { success: true, id: created.id };
    }
    return { success: true };
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2002") {
      return { success: false, error: "A status with this value already exists for this module" };
    }
    console.error("saveStatusOption error:", err);
    return { success: false, error: "Failed to save status option" };
  }
}

/**
 * Deletes (retires) a status option. Validation: a module must keep at least
 * one active status and a default must always be set.
 */
export async function deleteStatusOption(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const option = await prisma.statusOption.findUnique({ where: { id } });
    if (!option) return { success: false, error: "Status not found" };

    const activeCount = await prisma.statusOption.count({
      where: { moduleKey: option.moduleKey, isActive: true },
    });
    if (activeCount <= 1) {
      return { success: false, error: "At least one active status must remain" };
    }

    if (option.isDefault) {
      return { success: false, error: "Set another default status before removing this one" };
    }

    await prisma.statusOption.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    console.error("deleteStatusOption error:", err);
    return { success: false, error: "Failed to delete status option" };
  }
}

export async function setStatusActive(id: string, isActive: boolean) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const option = await prisma.statusOption.findUnique({ where: { id } });
    if (!option) return { success: false, error: "Status not found" };

    if (!isActive) {
      const activeCount = await prisma.statusOption.count({
        where: { moduleKey: option.moduleKey, isActive: true },
      });
      if (activeCount <= 1) {
        return { success: false, error: "At least one active status must remain" };
      }
      if (option.isDefault) {
        return { success: false, error: "Set another default before deactivating the default status" };
      }
    }

    await prisma.statusOption.update({ where: { id }, data: { isActive } });
    return { success: true };
  } catch (err) {
    console.error("setStatusActive error:", err);
    return { success: false, error: "Failed to update status option" };
  }
}

export async function setStatusDefault(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const option = await prisma.statusOption.findUnique({ where: { id } });
    if (!option) return { success: false, error: "Status not found" };

    await prisma.$transaction([
      prisma.statusOption.updateMany({
        where: { moduleKey: option.moduleKey, isDefault: true },
        data: { isDefault: false },
      }),
      prisma.statusOption.update({ where: { id }, data: { isDefault: true } }),
    ]);
    return { success: true };
  } catch (err) {
    console.error("setStatusDefault error:", err);
    return { success: false, error: "Failed to set default status" };
  }
}

export async function updateStatusColor(id: string, color: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.statusOption.update({ where: { id }, data: { color } });
    return { success: true };
  } catch (err) {
    console.error("updateStatusColor error:", err);
    return { success: false, error: "Failed to update status color" };
  }
}

export async function reorderStatusOption(id: string, direction: "up" | "down") {  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const current = await prisma.statusOption.findUnique({ where: { id } });
    if (!current) return { success: false, error: "Status not found" };

    const siblings = await prisma.statusOption.findMany({
      where: { moduleKey: current.moduleKey },
      orderBy: [{ sortOrder: "asc" }],
    });

    const index = siblings.findIndex((s) => s.id === id);
    const swapWith = direction === "up" ? siblings[index - 1] : siblings[index + 1];
    if (!swapWith) return { success: true };

    await prisma.$transaction([
      prisma.statusOption.update({ where: { id }, data: { sortOrder: swapWith.sortOrder } }),
      prisma.statusOption.update({ where: { id: swapWith.id }, data: { sortOrder: current.sortOrder } }),
    ]);
    return { success: true };
  } catch (err) {
    console.error("reorderStatusOption error:", err);
    return { success: false, error: "Failed to reorder status option" };
  }
}

export async function getStatusModulesForAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return [...STATUS_MODULES];
}

export async function getStatusOptionsClient() {
  const map = await getStatusOptionsMap();
  return map;
}
