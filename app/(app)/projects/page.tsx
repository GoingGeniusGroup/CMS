import { getProjects } from "@/app/actions/projects";
import { ProjectsClient } from "./ProjectsClient";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [data, customers, teams, services] = await Promise.all([
    getProjects(1, 10),
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

  return (
    <ProjectsClient
      initialData={data}
      customers={customers.map((c) => ({ id: c.id, label: c.fullName }))}
      teams={teams.map((t) => ({ id: t.id, label: t.fullName }))}
      services={services.map((s) => ({ id: s.id, label: s.serviceName }))}
    />
  );
}
