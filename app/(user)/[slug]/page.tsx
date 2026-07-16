import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import { getPublicPageBySlug } from "@/app/actions/pages";
import { DynamicPageView } from "@/components/DynamicPageView";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublicPageBySlug(slug);
  if (!page) return { title: "Page Not Found" };

  return {
    title: page.metaTitle || page.title,
    description: page.metaDesc || undefined,
    keywords: page.keywords ? page.keywords.split(",").map((k) => k.trim()) : undefined,
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDesc || undefined,
      images: page.metaImage ? [{ url: page.metaImage }] : undefined,
    },
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPublicPageBySlug(slug);

  if (!page) notFound();

  const updatedAt = new Date(page.updatedAt).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <DynamicPageView
      title={page.title}
      content={(page.content as JSONContent) ?? null}
      updatedAt={updatedAt}
    />
  );
}
