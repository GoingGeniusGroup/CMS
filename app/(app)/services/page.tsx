import { ServicesClient } from "./ServicesClient";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function ServicesPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [services, total, active, inactive] = await Promise.all([
    prisma.service.findMany({
      orderBy: { createdAt: "desc" },
      skip: 0,
      take: 10,
    }),
    prisma.service.count(),
    prisma.service.count({ where: { isActive: true } }),
    prisma.service.count({ where: { isActive: false } }),
  ]);

  const data = {
    services,
    total,
    active,
    inactive,
    page: 1,
    pageSize: 10,
    pageCount: Math.ceil(total / 10),
  };

  return <ServicesClient initialData={data} />;
}
