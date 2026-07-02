import { ProjectsClient } from "./ProjectsClient";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [projects, total, published, drafts, customers, teams, services] = await Promise.all([
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      skip: 0,
      take: 10,
      include: { customer: true, team: true, service: true },
    }),
    prisma.project.count(),
    prisma.project.count({ where: { status: "Published" } }),
    prisma.project.count({ where: { status: "Draft" } }),
    prisma.customer.findMany({
      select: { id: true, fullName: true },
      orderBy: { fullName: "asc" },
    }),
    prisma.team.findMany({
      select: { id: true, fullName: true },
      orderBy: { fullName: "asc" },
    }),
    prisma.service.findMany({
      select: { id: true, serviceName: true },
      orderBy: { serviceName: "asc" },
    }),
  ]);

  const data = {
    projects,
    total,
    published,
    drafts,
    page: 1,
    pageSize: 10,
    pageCount: Math.ceil(total / 10),
  };

  return (
    <ProjectsClient
      initialData={data}
      customers={customers.map((c) => ({ id: c.id, label: c.fullName }))}
      teams={teams.map((t) => ({ id: t.id, label: t.fullName }))}
      services={services.map((s) => ({ id: s.id, label: s.serviceName }))}
    />
  );
}
