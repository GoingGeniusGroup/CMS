import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding invoices...");

  const customers = await prisma.customer.findMany({ orderBy: { createdAt: "asc" } });
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "asc" } });

  if (customers.length === 0) {
    console.log("  ⚠ No customers found — run seed-settings.ts first. Skipping.");
    return;
  }

  const findCustomer = (email: string) => customers.find((c) => c.email === email);
  const findProject = (slug: string) => projects.find((p) => p.slug === slug);

  const invoices = [
    {
      invoiceNumber: "INV-2026-001",
      customerId: findCustomer("ram@example.com")?.id,
      projectId: findProject("secure-mobile-banking-app")?.id,
      amount: 800000,
      tax: 50000,
      total: 850000,
      status: "Paid",
      issuedDate: new Date("2024-01-20"),
      dueDate: new Date("2024-02-05"),
    },
    {
      invoiceNumber: "INV-2026-002",
      customerId: findCustomer("sita@example.com")?.id,
      projectId: findProject("e-commerce-platform")?.id,
      amount: 1120000,
      tax: 80000,
      total: 1200000,
      status: "Paid",
      issuedDate: new Date("2023-09-10"),
      dueDate: new Date("2023-09-25"),
    },
    {
      invoiceNumber: "INV-2026-003",
      customerId: findCustomer("hari@example.com")?.id,
      projectId: findProject("business-analytics-dashboard")?.id,
      amount: 560000,
      tax: 40000,
      total: 600000,
      status: "Pending",
      issuedDate: new Date("2024-02-10"),
      dueDate: new Date("2026-08-15"),
    },
    {
      invoiceNumber: "INV-2026-004",
      customerId: findCustomer("ram@example.com")?.id,
      projectId: null,
      amount: 45000,
      tax: 3000,
      total: 48000,
      status: "Overdue",
      issuedDate: new Date("2026-05-01"),
      dueDate: new Date("2026-05-15"),
    },
    {
      invoiceNumber: "INV-2026-005",
      customerId: findCustomer("sita@example.com")?.id,
      projectId: null,
      amount: 25000,
      tax: 1750,
      total: 26750,
      status: "Pending",
      issuedDate: new Date("2026-07-01"),
      dueDate: new Date("2026-07-20"),
    },
  ];

  for (const inv of invoices) {
    await prisma.invoice.upsert({
      where: { invoiceNumber: inv.invoiceNumber },
      update: inv,
      create: inv,
    });
    console.log(`  ✓ ${inv.invoiceNumber} — ${inv.status} — रु${inv.total.toLocaleString()}`);
  }

  console.log("Done seeding invoices!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
