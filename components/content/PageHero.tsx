"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import type { HeroData } from "@/lib/content/schemas";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { StatsCards } from "@/components/content/StatsCards";
import { usePublicLabelResolver } from "@/components/content/PublicLabelProvider";

/**
 * Universal hero (Task 16, Phase 18) — one component driving four layouts by
 * `data.layout`, replacing the six bespoke `Hero()`/`HeroSection()` functions
 * that used to exist one per page. Every field is optional except
 * `headingLines`, so a page can start from a minimal hero and grow into a
 * fuller one purely through the Landing Page editor, no code changes.
 */
/**
 * Converts a regular video URL (YouTube watch, Vimeo page, etc.) into an
 * embeddable iframe URL. If already an embed URL or unrecognized, returns as-is.
 * Appends player parameters for autoplay, loop, mute, and controls.
 */
function toEmbedUrl(url: string, opts?: { autoplay?: boolean; loop?: boolean; muted?: boolean; controls?: boolean }): string {
  if (!url) return url;

  let baseUrl = url;
  let videoId = "";

  // YouTube: youtube.com/watch?v=ID or youtu.be/ID → youtube-nocookie.com/embed/ID
  const ytWatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytWatch) {
    videoId = ytWatch[1];
    baseUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
  }

  // YouTube: already embed URL — switch to nocookie domain
  const ytEmbed = url.match(/youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (ytEmbed && !ytWatch) {
    videoId = ytEmbed[1];
    baseUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
  }

  // Vimeo: vimeo.com/ID → player.vimeo.com/video/ID
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo && !url.includes("player.vimeo.com")) {
    baseUrl = `https://player.vimeo.com/video/${vimeo[1]}`;
  }

  // Append query parameters
  if (opts) {
    const params = new URLSearchParams();
    const isYouTube = baseUrl.includes("youtube");
    const isVimeo = baseUrl.includes("vimeo");

    // Browsers require muted for autoplay to work — always muted
    const effectiveMuted = true;

    if (opts.autoplay) {
      params.set("autoplay", "1");
    }
    if (opts.loop) {
      params.set("loop", "1");
      if (isYouTube && videoId) params.set("playlist", videoId); // YT requires playlist param for loop
    }
    if (effectiveMuted) {
      if (isYouTube) params.set("mute", "1");
      if (isVimeo) params.set("muted", "1");
    }
    if (isYouTube) {
      params.set("controls", opts.controls ? "1" : "0");
      params.set("rel", "0");
      params.set("modestbranding", "1");
      params.set("playsinline", "1");
      params.set("enablejsapi", "1");
    }
    if (isVimeo) {
      if (!opts.controls) params.set("controls", "0");
      params.set("playsinline", "1");
      if (effectiveMuted) params.set("background", "1");
    }

    const qs = params.toString();
    if (qs) baseUrl += (baseUrl.includes("?") ? "&" : "?") + qs;
  }

  return baseUrl;
}

export function PageHero({ data }: { data: HeroData }) {
  const resolveLabel = usePublicLabelResolver();

  // Video mode — render a full-width embedded video instead of text/image content
  if (data.heroMode === "video" && data.videoEmbedUrl) {
    const embedSrc = toEmbedUrl(data.videoEmbedUrl, {
      autoplay: data.videoAutoplay ?? true,
      loop: data.videoLoop ?? true,
      muted: true,
      controls: data.videoControls ?? true,
    });
    return (
      <section className="bg-[#f6f4f3] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
            <iframe
              src={embedSrc}
              className="h-full w-full border-0"
              allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Hero video"
            />
          </div>
        </div>
      </section>
    );
  }

  const heading = <HeroHeading data={data} resolveLabel={resolveLabel} />;
  const ctas = <HeroCtas data={data} resolveLabel={resolveLabel} />;
  const eyebrow = data.eyebrow ? resolveLabel(data.eyebrow) : undefined;
  const subHeading = data["Subheading"] ? resolveLabel(data["Subheading"]) : undefined;
  const microcopy = data.microcopy ? resolveLabel(data.microcopy) : undefined;

  if (data.layout === "minimal") {
    return (
      <section className="border-b border-zinc-100 bg-[#f6f4f3] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <RevealOnScroll>
            {eyebrow && <HeroEyebrow>{eyebrow}</HeroEyebrow>}
            {heading}
            {subHeading && <HeroSubHeading center>{subHeading}</HeroSubHeading>}
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
                      {highlightLine(resolveLabel(line), highlightsForLine(data, resolveLabel(line)))}
                    </span>
                  ))}
                </h1>
                {subHeading && (
                  <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/95 [text-shadow:0_1px_4px_rgba(0,0,0,0.4)]">
                    {subHeading}
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
            {data.logoUrl && (
              <div className="mb-4 flex justify-center">
                <Image
                  src={data.logoUrl}
                  alt=""
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full object-contain"
                />
              </div>
            )}
            {eyebrow && <HeroEyebrow center>{eyebrow}</HeroEyebrow>}
            {heading}
            {subHeading && <HeroSubHeading center>{subHeading}</HeroSubHeading>}
            {ctas && <div className="mt-7 flex flex-wrap justify-center gap-3">{ctas}</div>}
          </RevealOnScroll>
        </div>
      </section>
    );
  }

  // "split" and "stats" share the same two-column layout; "stats" adds the row below.
  if (data.darkCardStyle) {
    return (
      <section className="border-b border-zinc-100 bg-[#f6f4f3] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-[#2d2d3f] p-8 sm:p-12 lg:p-16">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <RevealOnScroll>
                {eyebrow && (
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-400">
                    {eyebrow}
                  </p>
                )}
                <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
                  {data.headingLines.map((line, i) => {
                    const label = resolveLabel(line);
                    return (
                      <span key={i}>
                        {i > 0 && <br />}
                        <DarkHighlightedLine
                          label={label}
                          highlights={highlightsForLine(data, label)}
                        />
                      </span>
                    );
                  })}
                </h1>
                {subHeading && (
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-300">{subHeading}</p>
                )}
                {ctas && <div className="mt-8 flex flex-wrap gap-3">{ctas}</div>}
                {microcopy && (
                  <p className="mt-4 flex items-center gap-1.5 text-xs text-zinc-400">
                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                    {microcopy}
                  </p>
                )}
              </RevealOnScroll>

              {data.imageUrl && (
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={data.imageUrl}
                    alt={data.imageAlt || ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center"
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const columns = (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <RevealOnScroll>
        {eyebrow && <HeroEyebrow>{eyebrow}</HeroEyebrow>}
        {heading}
        {subHeading && <HeroSubHeading>{subHeading}</HeroSubHeading>}
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
    <div className="mt-14">
      <StatsCards data={{ items: data.stats }} />
    </div>
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

function HeroSubHeading({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
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
      {data.headingLines.map((line, i) => {
        const label = resolveLabel(line);
        return (
          <span key={i}>
            {i > 0 && <br />}
            {highlightLine(label, highlightsForLine(data, label))}
          </span>
        );
      })}
    </h1>
  );
}

/** Collect all highlights that match within this line, ordered by position. */
function highlightsForLine(data: HeroData, lineLabel: string): Array<{ word: string; color?: string }> {
  if (data.coloredHighlights && data.coloredHighlights.length > 0) {
    return data.coloredHighlights.filter((e) => e.word && lineLabel.includes(e.word));
  }
  if (data.highlightedWords && data.highlightedWords.length > 0) {
    return data.highlightedWords
      .filter((w) => w && lineLabel.includes(w))
      .map((w) => ({ word: w }));
  }
  if (data.highlightedWord && lineLabel.includes(data.highlightedWord)) {
    return [{ word: data.highlightedWord }];
  }
  return [];
}

/** Renders a line with multiple highlighted words/phrases, each in its own color. */
function highlightLine(line: string, highlights: Array<{ word: string; color?: string }>) {
  if (highlights.length === 0) return line;

  // Build a list of non-overlapping highlight ranges sorted by position
  const ranges: Array<{ start: number; end: number; color?: string }> = [];
  for (const h of highlights) {
    const idx = line.indexOf(h.word);
    if (idx === -1) continue;
    // Skip if overlapping an existing range
    const overlaps = ranges.some((r) => idx < r.end && idx + h.word.length > r.start);
    if (overlaps) continue;
    ranges.push({ start: idx, end: idx + h.word.length, color: h.color });
  }
  if (ranges.length === 0) return line;

  ranges.sort((a, b) => a.start - b.start);

  const parts: React.ReactNode[] = [];
  let cursor = 0;
  for (const range of ranges) {
    if (cursor < range.start) {
      parts.push(line.slice(cursor, range.start));
    }
    const text = line.slice(range.start, range.end);
    parts.push(
      <span key={range.start} className={range.color ? undefined : "text-indigo-600"} style={range.color ? { color: range.color } : undefined}>
        {text}
      </span>
    );
    cursor = range.end;
  }
  if (cursor < line.length) {
    parts.push(line.slice(cursor));
  }
  return <>{parts}</>;
}

/** Dark hero variant — italic with custom colors. */
function DarkHighlightedLine({ label, highlights }: { label: string; highlights: Array<{ word: string; color?: string }> }) {
  if (highlights.length === 0) return <>{label}</>;

  const ranges: Array<{ start: number; end: number; color?: string }> = [];
  for (const h of highlights) {
    const idx = label.indexOf(h.word);
    if (idx === -1) continue;
    const overlaps = ranges.some((r) => idx < r.end && idx + h.word.length > r.start);
    if (overlaps) continue;
    ranges.push({ start: idx, end: idx + h.word.length, color: h.color });
  }
  if (ranges.length === 0) return <>{label}</>;

  ranges.sort((a, b) => a.start - b.start);

  const parts: React.ReactNode[] = [];
  let cursor = 0;
  for (const range of ranges) {
    if (cursor < range.start) {
      parts.push(label.slice(cursor, range.start));
    }
    const text = label.slice(range.start, range.end);
    parts.push(
      <span key={range.start} className={range.color ? "italic" : "italic text-indigo-400"} style={range.color ? { color: range.color } : undefined}>
        {text}
      </span>
    );
    cursor = range.end;
  }
  if (cursor < label.length) {
    parts.push(label.slice(cursor));
  }
  return <>{parts}</>;
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
        <HeroCtaLink
          href={data.primaryCtaHref}
          primary
          showArrow={data.primaryCtaShowArrow}
          dark={data.darkCardStyle}
        >
          {resolveLabel(data.primaryCtaLabel)}
        </HeroCtaLink>
      )}
      {data.secondaryCtaLabel && (
        <HeroCtaLink href={data.secondaryCtaHref} dark={data.darkCardStyle}>
          {resolveLabel(data.secondaryCtaLabel)}
        </HeroCtaLink>
      )}
    </>
  );
}

function HeroCtaLink({
  href,
  primary = false,
  showArrow = false,
  dark = false,
  children,
}: {
  href?: string;
  primary?: boolean;
  showArrow?: boolean;
  dark?: boolean;
  children: React.ReactNode;
}) {
  const resolvedHref = href || "#";
  const className = primary
    ? "inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
    : dark
      ? "inline-flex items-center rounded-lg border border-zinc-500 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-zinc-300 hover:text-white"
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
