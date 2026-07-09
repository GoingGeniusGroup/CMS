import { CategoryClient } from "./CategoryClient";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function CategoryPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [categories, total, active, inactive] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip: 0,
      take: 10,
    }),
    prisma.category.count(),
    prisma.category.count({ where: { status: "Active" } }),
    prisma.category.count({ where: { status: "Inactive" } }),
  ]);

  const data = {
    categories,
    total,
    active,
    inactive,
    page: 1,
    pageSize: 10,
    pageCount: Math.ceil(total / 10),
  };

  return <CategoryClient initialData={data} />;
}
