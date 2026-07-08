import { PagesClient } from "./PagesClient";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function PagesPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [pages, total, published, drafts] = await Promise.all([
    prisma.page.findMany({
      orderBy: { createdAt: "desc" },
      skip: 0,
      take: 10,
    }),
    prisma.page.count(),
    prisma.page.count({ where: { status: "Published" } }),
    prisma.page.count({ where: { status: "Draft" } }),
  ]);

  const data = {
    pages,
    total,
    published,
    drafts,
    page: 1,
    pageSize: 10,
    pageCount: Math.ceil(total / 10),
  };

  return <PagesClient initialData={data} />;
}
