import { ServicesClient } from "./ServicesClient";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

const PAGE_SIZE = 10;

export default async function ServicesPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [services, total, active, inactive] = await Promise.all([
    prisma.service.findMany({
      orderBy: { createdAt: "desc" },
      skip: 0,
      take: PAGE_SIZE,
    }),
    prisma.service.count(),
    prisma.service.count({ where: { isActive: true } }),
    prisma.service.count({ where: { isActive: false } }),
  ]);

  const initialData = {
    services,
    total,
    active,
    inactive,
    page: 1,
    pageSize: PAGE_SIZE,
    pageCount: Math.ceil(total / PAGE_SIZE),
  };

  return <ServicesClient initialData={initialData} />;
}
