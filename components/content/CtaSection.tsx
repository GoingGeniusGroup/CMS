"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CtaData } from "@/lib/content/schemas";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { usePublicLabelResolver } from "@/components/content/PublicLabelProvider";

/**
 * Editable call-to-action banner driven by `ctaSchema`:
 * "split" renders the heading-left/image-right block (our-services plain,
 * our-projects as a tinted card via `cardStyle`), "centered" the text-only
 * centered variant (about-us final CTA card, company contact CTA). Words
 * matched by `highlightedWord` keep their amber accent, mirroring the hero's
 * highlight mechanism.
 */
export function CtaSection({ data }: { data: CtaData }) {
  const resolveLabel = usePublicLabelResolver();

  if (data.variant === "centered") {
    return (
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <RevealOnScroll>
            {data.eyebrow && (
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-600">
                {resolveLabel(data.eyebrow)}
              </p>
            )}
            <h2 className="text-3xl font-extrabold leading-tight text-zinc-900 sm:text-4xl">
              {data.headingLines.map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {ctaHighlightLine(resolveLabel(line), data)}
                </span>
              ))}
            </h2>
            {data.Subheading && (
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-zinc-500">
                {resolveLabel(data.Subheading)}
              </p>
            )}
            {ctas(data)}
          </RevealOnScroll>
        </div>
      </section>
    );
  }

  const splitContent = (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <RevealOnScroll>
        {data.eyebrow && (
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-600">
            {resolveLabel(data.eyebrow)}
          </p>
        )}
        <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
          {data.headingLines.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {ctaHighlightLine(resolveLabel(line), data)}
            </span>
          ))}
        </h2>
        {data.Subheading && (
          <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-500">
            {resolveLabel(data.Subheading)}
          </p>
        )}
        {data.primaryCtaLabel || data.secondaryCtaLabel ? (
          <div className="mt-7 flex flex-wrap gap-3">{ctas(data)}</div>
        ) : null}
      </RevealOnScroll>

      {data.imageUrl && (
        <RevealOnScroll delay={0.1} className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={data.imageUrl}
              alt={data.imageAlt || ""}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </RevealOnScroll>
      )}
    </div>
  );

  if (data.cardStyle) {
    return (
      <section className="bg-[#f6f4f3] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-[#f0eef9] p-8 sm:p-12 lg:p-16">{splitContent}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">{splitContent}</div>
    </section>
  );
}

function ctas(data: CtaData) {
  if (!data.primaryCtaLabel && !data.secondaryCtaLabel) return null;

  return (
    <>
      {data.primaryCtaLabel && (
        <CtaLink href={data.primaryCtaHref} primary showArrow={data.primaryCtaShowArrow}>
          {data.primaryCtaLabel}
        </CtaLink>
      )}
      {data.secondaryCtaLabel && (
        <CtaLink href={data.secondaryCtaHref}>{data.secondaryCtaLabel}</CtaLink>
      )}
    </>
  );
}

function CtaLink({
  href,
  primary = false,
  showArrow = false,
  children,
}: {
  href?: string;
  primary?: boolean;
  showArrow?: boolean;
  children: React.ReactNode;
}) {
  const resolvedHref = href || "#";
  const className = primary
    ? "inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
    : "inline-flex items-center rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400";

  const content =
    primary && showArrow ? (
      <>
        {children}
        <ArrowRight className="h-4 w-4" />
      </>
    ) : (
      children
    );

  if (resolvedHref.startsWith("/")) {
    return (
      <Link href={resolvedHref} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a href={resolvedHref} className={className}>
      {content}
    </a>
  );
}

/** Applies highlight colors to matched words in the line. Uses coloredHighlights
 * if available, falls back to highlightedWord with amber accent. */
function ctaHighlightLine(line: string, data: CtaData) {
  // Collect applicable highlights
  type HL = { word: string; color?: string };
  const highlights: HL[] = [];
  if (data.coloredHighlights && data.coloredHighlights.length > 0) {
    for (const e of data.coloredHighlights) {
      if (e.word && line.includes(e.word)) highlights.push({ word: e.word, color: e.color });
    }
  } else if (data.highlightedWord && line.includes(data.highlightedWord)) {
    highlights.push({ word: data.highlightedWord, color: "#f59e0b" }); // amber-500 default for CTA
  }
  if (highlights.length === 0) return line;

  // Build non-overlapping ranges
  const ranges: Array<{ start: number; end: number; color?: string }> = [];
  for (const h of highlights) {
    const idx = line.indexOf(h.word);
    if (idx === -1) continue;
    const overlaps = ranges.some((r) => idx < r.end && idx + h.word.length > r.start);
    if (overlaps) continue;
    ranges.push({ start: idx, end: idx + h.word.length, color: h.color });
  }
  if (ranges.length === 0) return line;
  ranges.sort((a, b) => a.start - b.start);

  const parts: React.ReactNode[] = [];
  let cursor = 0;
  for (const range of ranges) {
    if (cursor < range.start) parts.push(line.slice(cursor, range.start));
    parts.push(
      <span key={range.start} style={{ color: range.color || "#f59e0b" }}>
        {line.slice(range.start, range.end)}
      </span>
    );
    cursor = range.end;
  }
  if (cursor < line.length) parts.push(line.slice(cursor));
  return <>{parts}</>;
}