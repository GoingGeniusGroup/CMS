import { InvoicesClient } from "./InvoicesClient";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function InvoicesPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [invoices, total, paid, pending, overdue, customers, projects, general, contact] = await Promise.all([
    prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      skip: 0,
      take: 10,
      include: { customer: true, projects: { include: { project: true } } },
    }),
    prisma.invoice.count(),
    prisma.invoice.count({ where: { status: "Paid" } }),
    prisma.invoice.count({ where: { status: "Pending" } }),
    prisma.invoice.count({ where: { status: "Overdue" } }),
    prisma.customer.findMany({
      select: { id: true, fullName: true },
      orderBy: { fullName: "asc" },
    }),
    prisma.project.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
    prisma.generalSetting.findFirst(),
    prisma.contactSetting.findFirst(),
  ]);

  const data = {
    invoices,
    total,
    paid,
    pending,
    overdue,
    page: 1,
    pageSize: 10,
    pageCount: Math.ceil(total / 10),
  };

  const printSettings = {
    siteName: general?.siteName || "",
    address: contact?.address || "",
    email: contact?.email1 || "",
    phone: contact?.phone1 || "",
  };

  return (
    <InvoicesClient
      initialData={data}
      customers={customers.map((c) => ({ id: c.id, label: c.fullName }))}
      projects={projects.map((p) => ({ id: p.id, label: p.title }))}
      printSettings={printSettings}
    />
  );
}
