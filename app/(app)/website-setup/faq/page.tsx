import { FaqClient } from "./FaqClient";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function FaqPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });

  return <FaqClient initialFaqs={faqs} />;
}
