import { TeamClient } from "./TeamClient";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function TeamPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [members, total, active, inactive] = await Promise.all([
    prisma.team.findMany({
      orderBy: { joinedAt: "desc" },
      skip: 0,
      take: 10,
    }),
    prisma.team.count(),
    prisma.team.count({ where: { status: "Active" } }),
    prisma.team.count({ where: { status: "Inactive" } }),
  ]);

  const data = {
    members,
    total,
    active,
    inactive,
    page: 1,
    pageSize: 10,
    pageCount: Math.ceil(total / 10),
  };

  return <TeamClient initialData={data} />;
}
