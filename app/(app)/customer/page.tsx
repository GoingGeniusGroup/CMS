import { CustomersClient } from "./CustomersClient";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function CustomerPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [customers, total, active, inactive, services] = await Promise.all([
    prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      skip: 0,
      take: 10,
      include: { service: true },
    }),
    prisma.customer.count(),
    prisma.customer.count({ where: { status: "Active" } }),
    prisma.customer.count({ where: { status: "Inactive" } }),
    prisma.service.findMany({
      select: { id: true, serviceName: true },
      orderBy: { serviceName: "asc" },
    }),
  ]);

  const data = {
    customers,
    total,
    active,
    inactive,
    page: 1,
    pageSize: 10,
    pageCount: Math.ceil(total / 10),
  };

  return (
    <CustomersClient
      initialData={data}
      services={services.map((s) => ({ id: s.id, label: s.serviceName }))}
    />
  );
}
