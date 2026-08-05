import { LeadsClient } from "./LeadsClient";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function LeadsPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [leads, total, newLeads, thisMonth, services] = await Promise.all([
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      skip: 0,
      take: 10,
    }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "New" } }),
    prisma.lead.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.service.findMany({ select: { serviceName: true }, orderBy: { serviceName: "asc" } }),
  ]);

  const data = {
    leads,
    total,
    newLeads,
    thisMonth,
    page: 1,
    pageSize: 10,
    pageCount: Math.ceil(total / 10),
  };

  return (
    <LeadsClient
      initialData={data}
      services={services.map((s) => s.serviceName)}
    />
  );
}