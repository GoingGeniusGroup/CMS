import { redirect } from "next/navigation";

/**
 * Redirects /portfolio/[slug] to /our-projects/[slug] where the real
 * project detail page lives.
 */
export default async function PortfolioDetailRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/our-projects/${slug}`);
}
