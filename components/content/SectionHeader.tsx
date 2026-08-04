"use client";

import Link from "next/link";
import type { SectionHeaderData } from "@/lib/content/schemas";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { usePublicLabelTokens } from "@/components/content/PublicLabelProvider";

/**
 * Renders an "eyebrow + heading + optional subheading + optional CTA" block
 * from admin-editable content, using the same DOM shape and classes every
 * section previously hardcoded — so wiring this in changes zero pixels until
 * an admin actually edits the section in the Landing Page editor (Phase 17).
 *
 * `data` should already be the resolved value: DB content if a row exists, or
 * the section's registry default otherwise (see `getSection` in
 * app/actions/site-content.ts). This stays a plain client component — no
 * fetching here — so it can sit inside otherwise-client `Landing*Section`
 * components without forcing them to become server components.
 *
 * The CTA, if present, renders as a Next `<Link>` for internal paths
 * (`ctaHref` starting with `/`) so it benefits from prefetching, and a plain
 * `<a>` for anchors (`#...`) or external URLs.
 */
export function SectionHeader({
  data,
  align = "center",
  className = "",
}: {
  data: SectionHeaderData;
  align?: "center" | "left";
  className?: string;
}) {
  const alignClass = align === "center" ? "text-center" : "";
  const eyebrow = usePublicLabelTokens(data.eyebrow ?? "");
  const heading = usePublicLabelTokens(data.heading);
  const subheading = usePublicLabelTokens(data.subheading ?? "");

  return (
    <RevealOnScroll className={`${alignClass} ${className}`}>
      {eyebrow && (
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-600">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-extrabold text-zinc-900 sm:text-3xl">{heading}</h2>
      {subheading && (
        <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-500">{subheading}</p>
      )}
    </RevealOnScroll>
  );
}

/**
 * The "View All X" / "Contact Sales"-style link that sits below a section's
 * card grid, as its own separately-timed `RevealOnScroll` — matching the
 * original markup's two-block structure (header reveals first, then the CTA
 * a beat later) rather than collapsing both into one block.
 */
export function SectionCta({
  data,
  className = "mt-10 text-center",
  delay = 0.1,
}: {
  data: Pick<SectionHeaderData, "ctaLabel" | "ctaHref">;
  className?: string;
  delay?: number;
}) {
  const ctaLabel = usePublicLabelTokens(data.ctaLabel ?? "");
  if (!ctaLabel) return null;
  const href = data.ctaHref || "#";

  return (
    <RevealOnScroll className={className} delay={delay}>
      {href.startsWith("/") ? (
        <Link href={href} className={CTA_CLASS}>
          {ctaLabel}
        </Link>
      ) : (
        <a href={href} className={CTA_CLASS}>
          {ctaLabel}
        </a>
      )}
    </RevealOnScroll>
  );
}

const CTA_CLASS =
  "inline-flex items-center rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-indigo-400 hover:text-indigo-600";
