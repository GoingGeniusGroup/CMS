"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const invoiceSchema = z.object({
  customerId: z.string().optional(),
  projectId: z.string().optional(),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  amount: z.number().min(0),
  tax: z.number().min(0).default(0),
  total: z.number().min(0),
  status: z.enum(["Paid", "Pending", "Overdue"]).default("Pending"),
  issuedDate: z.string().optional(),
  dueDate: z.string().optional(),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;

export async function getInvoices(page = 1, pageSize = 10) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [invoices, total, paid, pending, overdue] = await Promise.all([
    prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { customer: true, project: true },
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

export async function createInvoice(data: InvoiceInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = invoiceSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const { issuedDate, dueDate, ...rest } = result.data;
    await prisma.invoice.create({
      data: {
        ...rest,
        customerId: rest.customerId || null,
        projectId: rest.projectId || null,
        issuedDate: issuedDate ? new Date(issuedDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });
    return { success: true };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "An invoice with this number already exists" };
    }
    console.error("Create invoice error:", error);
    return { success: false, error: "Failed to create invoice" };
  }
}

export async function updateInvoice(id: string, data: InvoiceInput) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = invoiceSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const { issuedDate, dueDate, ...rest } = result.data;
    await prisma.invoice.update({
      where: { id },
      data: {
        ...rest,
        customerId: rest.customerId || null,
        projectId: rest.projectId || null,
        issuedDate: issuedDate ? new Date(issuedDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });
    return { success: true };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "An invoice with this number already exists" };
    }
    console.error("Update invoice error:", error);
    return { success: false, error: "Failed to update invoice" };
  }
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
