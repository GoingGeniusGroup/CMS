"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { saveCustomFieldValues } from "./custom-fields";

const invoiceSchema = z.object({
  customerId: z.string().optional(),
  projectIds: z.array(z.string()).optional(),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  category: z.string().optional(),
  amount: z.number().min(0),
  tax: z.number().min(0).default(0),
  total: z.number().min(0),
  status: z.string().min(1, "Status is required").default("Pending"),
  issuedDate: z.string().optional(),
  dueDate: z.string().optional(),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type InvoiceCustomValues = Record<string, string | number | boolean | null | undefined>;

export async function getInvoices(page = 1, pageSize = 10) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [invoices, total, paid, pending, overdue] = await Promise.all([
    prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { customer: true, projects: { include: { project: true } } },
    }),
    prisma.invoice.count(),
    prisma.invoice.count({ where: { status: "Paid" } }),
    prisma.invoice.count({ where: { status: "Pending" } }),
    prisma.invoice.count({ where: { status: "Overdue" } }),
  ]);

  return {
    invoices,
    total,
    paid,
    pending,
    overdue,
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize),
  };
}

export async function createInvoice(data: InvoiceInput, customFieldValues?: InvoiceCustomValues) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = invoiceSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const { issuedDate, dueDate, projectIds, ...rest } = result.data;
    const created = await prisma.invoice.create({
      data: {
        ...rest,
        customerId: rest.customerId || null,
        category: rest.category || null,
        issuedDate: issuedDate ? new Date(issuedDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        projects: projectIds?.length
          ? { create: projectIds.map((projectId) => ({ projectId })) }
          : undefined,
      },
    });

    if (customFieldValues && Object.keys(customFieldValues).length > 0) {
      await saveCustomFieldValues("invoice", created.id, customFieldValues);
    }

    return { success: true };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "An invoice with this number already exists" };
    }
    console.error("Create invoice error:", error);
    return { success: false, error: "Failed to create invoice" };
  }
}

export async function updateInvoice(id: string, data: InvoiceInput, customFieldValues?: InvoiceCustomValues) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = invoiceSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const { issuedDate, dueDate, projectIds, ...rest } = result.data;

    // Replace projects: delete old links, create new ones
    if (projectIds) {
      await prisma.invoiceProject.deleteMany({ where: { invoiceId: id } });
      if (projectIds.length > 0) {
        await prisma.invoiceProject.createMany({
          data: projectIds.map((projectId) => ({ invoiceId: id, projectId })),
        });
      }
    }

    await prisma.invoice.update({
      where: { id },
      data: {
        ...rest,
        customerId: rest.customerId || null,
        category: rest.category || null,
        issuedDate: issuedDate ? new Date(issuedDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    if (customFieldValues && Object.keys(customFieldValues).length > 0) {
      await saveCustomFieldValues("invoice", id, customFieldValues);
    }

    return { success: true };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "An invoice with this number already exists" };
    }
    console.error("Update invoice error:", error);
    return { success: false, error: "Failed to update invoice" };
  }
}

export async function getInvoicePrintSettings() {
  const [general, contact] = await Promise.all([
    prisma.generalSetting.findFirst(),
    prisma.contactSetting.findFirst(),
  ]);
  return {
    siteName: general?.siteName || "",
    address: contact?.address || "",
    email: contact?.email1 || "",
    phone: contact?.phone1 || "",
  };
}

export async function deleteInvoice(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.invoice.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Delete invoice error:", error);
    return { success: false, error: "Failed to delete invoice" };
  }
}
