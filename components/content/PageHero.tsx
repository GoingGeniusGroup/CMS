"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import type { HeroData } from "@/lib/content/schemas";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { splitHighlight } from "@/lib/content/hero-text";
import { getHeroStatIcon } from "@/lib/content/hero-icons";
import { usePublicLabelResolver } from "@/components/content/PublicLabelProvider";

/**
 * Universal hero (Task 16, Phase 18) — one component driving four layouts by
 * `data.layout`, replacing the six bespoke `Hero()`/`HeroSection()` functions
 * that used to exist one per page. Every field is optional except
 * `headingLines`, so a page can start from a minimal hero and grow into a
 * fuller one purely through the Landing Page editor, no code changes.
 */
export function PageHero({ data }: { data: HeroData }) {
  const resolveLabel = usePublicLabelResolver();
  const heading = <HeroHeading data={data} resolveLabel={resolveLabel} />;
  const ctas = <HeroCtas data={data} resolveLabel={resolveLabel} />;
  const eyebrow = data.eyebrow ? resolveLabel(data.eyebrow) : undefined;
  const subheading = data.subheading ? resolveLabel(data.subheading) : undefined;
  const microcopy = data.microcopy ? resolveLabel(data.microcopy) : undefined;

  if (data.layout === "minimal") {
    return (
      <section className="border-b border-zinc-100 bg-[#f6f4f3] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <RevealOnScroll>
            {eyebrow && <HeroEyebrow>{eyebrow}</HeroEyebrow>}
            {heading}
            {subheading && <HeroSubheading center>{subheading}</HeroSubheading>}
          </RevealOnScroll>
        </div>
      </section>
    );
  }

  if (data.layout === "centered") {
    if (data.backdropImageUrl) {
      return (
        <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-[21/9] overflow-hidden rounded-2xl bg-zinc-900">
            <Image
              src={data.backdropImageUrl}
              alt={data.imageAlt || ""}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
              <RevealOnScroll>
                {eyebrow && (
                  <span className="mb-2.5 inline-block rounded-full border border-white/50 bg-white/15 px-3.5 py-[3px] text-[11px] font-bold uppercase tracking-widest text-white">
                    {eyebrow}
                  </span>
                )}
                <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold leading-tight text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.5)]">
                  {data.headingLines.map((line, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      {highlightLine(resolveLabel(line), data.highlightedWord)}
                    </span>
                  ))}
                </h1>
                {subheading && (
                  <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/95 [text-shadow:0_1px_4px_rgba(0,0,0,0.4)]">
                    {subheading}
                  </p>
                )}
              </RevealOnScroll>
            </div>
          </div>
        </div>
      );
    }

    return (
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <RevealOnScroll>
            {eyebrow && <HeroEyebrow center>{eyebrow}</HeroEyebrow>}
            {heading}
            {subheading && <HeroSubheading center>{subheading}</HeroSubheading>}
            {ctas && <div className="mt-7 flex flex-wrap justify-center gap-3">{ctas}</div>}
          </RevealOnScroll>
        </div>
      </section>
    );
  }

  // "split" and "stats" share the same two-column layout; "stats" adds the row below.
  const columns = (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <RevealOnScroll>
        {eyebrow && <HeroEyebrow>{eyebrow}</HeroEyebrow>}
        {heading}
        {subheading && <HeroSubheading>{subheading}</HeroSubheading>}
        {ctas && <div className="mt-7 flex flex-wrap gap-3">{ctas}</div>}
        {microcopy && (
          <p className="mt-4 flex items-center gap-1.5 text-xs text-zinc-400">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            {microcopy}
          </p>
        )}
      </RevealOnScroll>

      {data.imageUrl && (
        <RevealOnScroll delay={0.1} className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100">
            <Image
              src={data.imageUrl}
              alt={data.imageAlt || ""}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </div>
          {data.imageBadge && (
            <div className="absolute bottom-4 left-4 rounded-2xl bg-white px-4 py-3 shadow-lg">
              <p className="text-2xl font-extrabold text-zinc-900">{data.imageBadge.value}</p>
              <p className="text-xs text-zinc-500">{resolveLabel(data.imageBadge.label)}</p>
            </div>
          )}
        </RevealOnScroll>
      )}
    </div>
  );

  const statsRow = data.layout === "stats" && data.stats && data.stats.length > 0 && (
    <StaggerGrid className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {data.stats.map((stat) => {
        const Icon = getHeroStatIcon(stat.iconName);
        return (
          <StaggerItem key={stat.label}>
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-zinc-100 bg-white p-6 text-center shadow-sm">
              {Icon && <Icon className="h-7 w-7 text-indigo-500" strokeWidth={1.5} />}
              <p className="text-3xl font-extrabold text-zinc-900">{stat.value}</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                {resolveLabel(stat.label)}
              </p>
            </div>
          </StaggerItem>
        );
      })}
    </StaggerGrid>
  );

  if (data.cardStyle) {
    return (
      <section className="border-b border-zinc-100 bg-[#f6f4f3] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border-2 border-indigo-500/70 bg-white p-8 sm:p-12">
            {columns}
          </div>
          {statsRow}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {columns}
        {statsRow}
      </div>
    </section>
  );
}

function HeroEyebrow({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <p
      className={`mb-3 text-xs font-bold uppercase tracking-widest text-indigo-600 ${
        center ? "text-center" : ""
      }`}
    >
      {children}
    </p>
  );
}

function HeroSubheading({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <p
      className={`mt-5 text-sm leading-relaxed text-zinc-500 ${
        center ? "mx-auto max-w-xl text-center" : "max-w-md"
      }`}
    >
      {children}
    </p>
  );
}

function HeroHeading({
  data,
  resolveLabel,
}: {
  data: HeroData;
  resolveLabel: (text: string) => string;
}) {
  const sizeClass =
    data.layout === "minimal"
      ? "text-3xl sm:text-4xl"
      : "text-4xl sm:text-5xl";
  const alignClass = data.layout === "centered" || data.layout === "minimal" ? "text-center" : "";

  return (
    <h1 className={`font-extrabold leading-tight tracking-tight text-zinc-900 ${sizeClass} ${alignClass}`}>
      {data.headingLines.map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {highlightLine(resolveLabel(line), data.highlightedWord)}
        </span>
      ))}
    </h1>
  );
}

/** Wraps the highlighted word/phrase in the accent color if it appears in this line. */
function highlightLine(line: string, highlight?: string) {
  const parts = splitHighlight(line, highlight);
  if (!parts) return line;
  return (
    <>
      {parts.before}
      <span className="text-indigo-600">{parts.match}</span>
      {parts.after}
    </>
  );
}

function HeroCtas({
  data,
  resolveLabel,
}: {
  data: HeroData;
  resolveLabel: (text: string) => string;
}) {
  if (!data.primaryCtaLabel && !data.secondaryCtaLabel) return null;

  return (
    <>
      {data.primaryCtaLabel && (
        <HeroCtaLink href={data.primaryCtaHref} primary showArrow={data.primaryCtaShowArrow}>
          {resolveLabel(data.primaryCtaLabel)}
        </HeroCtaLink>
      )}
      {data.secondaryCtaLabel && (
        <HeroCtaLink href={data.secondaryCtaHref}>{resolveLabel(data.secondaryCtaLabel)}</HeroCtaLink>
      )}
    </>
  );
}

function HeroCtaLink({
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
    ? "inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
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
