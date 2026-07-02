import { getBlogs } from "@/app/actions/blogs";
import { BlogsClient } from "./BlogsClient";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function BlogPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [data, authors] = await Promise.all([
    getBlogs(1, 10),
    prisma.team.findMany({
      select: { id: true, fullName: true },
      orderBy: { fullName: "asc" },
    }),
  ]);

  return <BlogsClient initialData={data} authors={authors} />;
}
