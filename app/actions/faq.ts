"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export type FaqData = {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function getFaqs(): Promise<FaqData[]> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return prisma.faq.findMany({ orderBy: { order: "asc" } });
}

export async function createFaq(data: { question: string; answer?: string; category?: string }) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const maxOrder = await prisma.faq.aggregate({ _max: { order: true } });
    await prisma.faq.create({
      data: {
        question: data.question,
        answer: data.answer ?? "",
        category: data.category ?? "",
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });
    revalidatePath("/website-setup/faq");
    return { success: true };
  } catch (error) {
    console.error("Create FAQ error:", error);
    return { success: false, error: "Failed to create FAQ" };
  }
}

export async function updateFaq(id: string, data: { question?: string; answer?: string; category?: string }) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.faq.update({ where: { id }, data });
    revalidatePath("/website-setup/faq");
    return { success: true };
  } catch (error) {
    console.error("Update FAQ error:", error);
    return { success: false, error: "Failed to update FAQ" };
  }
}

/** Public — no auth required, returns only active FAQs ordered by category and order. */
export async function getPublicFaqs(): Promise<{ question: string; answer: string; category: string }[]> {
  try {
    const faqs = await prisma.faq.findMany({
      where: { status: "Active" },
      orderBy: [{ category: "asc" }, { order: "asc" }],
      select: { question: true, answer: true, category: true },
    });
    return faqs;
  } catch {
    return [];
  }
}

export async function deleteFaq(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.faq.delete({ where: { id } });
    revalidatePath("/website-setup/faq");
    return { success: true };
  } catch (error) {
    console.error("Delete FAQ error:", error);
    return { success: false, error: "Failed to delete FAQ" };
  }
}
