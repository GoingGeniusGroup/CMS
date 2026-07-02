import { BlogsClient } from "./BlogsClient";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function BlogPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [blogs, total, published, drafts, authors] = await Promise.all([
    prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      skip: 0,
      take: 10,
      include: { author: true },
    }),
    prisma.blog.count(),
    prisma.blog.count({ where: { status: "Published" } }),
    prisma.blog.count({ where: { status: "Draft" } }),
    prisma.team.findMany({
      select: { id: true, fullName: true },
      orderBy: { fullName: "asc" },
    }),
  ]);

  const data = {
    blogs,
    total,
    published,
    drafts,
    page: 1,
    pageSize: 10,
    pageCount: Math.ceil(total / 10),
  };

  return <BlogsClient initialData={data} authors={authors} />;
}
