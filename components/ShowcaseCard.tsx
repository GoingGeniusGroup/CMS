"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { MotionCard } from "@/components/motion/MotionCard";

/**
 * Shared image-led card for services / projects / articles on the public site.
 *
 * Replaces the previous 3D flip card (which fired on every hover and hid content
 * behind an interaction) with a calmer reveal:
 *   - image zooms slightly on hover
 *   - a gradient scrim keeps the title legible over any image
 *   - description + action slide up on hover or keyboard focus
 *
 * On touch screens there is no hover, so the description is shown up-front and
 * only collapses from the `sm` breakpoint up.
 */
export function ShowcaseCard({
  title,
  description,
  imageUrl,
  actionLabel,
  href,
  secondaryActionLabel,
  secondaryHref,
  fallback,
}: {
  title: string;
  description: string;
  imageUrl: string | null;
  actionLabel: string;
  /** Navigates to the detail page. The whole card is a link to this. */
  href: string;
  /**
   * An optional second action rendered next to the primary one (e.g. "View
   * Live Demo"). Opens in a new tab since it points off-site. Stops
   * propagation so clicking it doesn't also navigate via the card's `href`.
   */
  secondaryActionLabel?: string;
  secondaryHref?: string;
  /** Rendered in place of the image when `imageUrl` is null. */
  fallback?: ReactNode;
}) {
  const surfaceClasses = `group relative block w-full aspect-[3/2] overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2`;

  const image = (
    <>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.06]"
        />
      ) : (
        fallback ?? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
            <span className="text-5xl font-extrabold text-white/40">{title.charAt(0)}</span>
          </div>
        )
      )}

      {/* Scrim — keeps the title readable regardless of the underlying image */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/35 to-transparent transition-opacity duration-300 group-hover:via-zinc-950/50" />
    </>
  );

  const showSecondary = !!secondaryActionLabel && !!secondaryHref;

  const body = (
    <div className="absolute inset-x-0 bottom-0 p-5">
      <h3 className="text-base font-bold text-white">{title}</h3>

      <div className="max-h-32 overflow-hidden opacity-100 transition-all duration-300 ease-out sm:max-h-0 sm:opacity-0 sm:group-hover:max-h-32 sm:group-hover:opacity-100 sm:group-focus-visible:max-h-32 sm:group-focus-visible:opacity-100">
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/75">
          {description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white">
            {actionLabel}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          {showSecondary && (
            <a
              href={secondaryHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 -m-1 inline-flex items-center gap-1.5 rounded p-1 text-sm font-semibold text-white/85 underline-offset-2 hover:text-white hover:underline"
            >
              {secondaryActionLabel}
              <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );

  // When there's a secondary link (e.g. "View Live Demo"), the primary link
  // can't wrap the whole card — an <a> can't contain another <a>, which is
  // invalid HTML and breaks hydration. Instead the primary link becomes an
  // absolutely-positioned overlay that fills the card, and the secondary
  // link sits on top of it (higher z-index) as a sibling, so clicks on it
  // reach the secondary anchor instead of falling through to the overlay.
  if (showSecondary) {
    return (
      <MotionCard className="relative h-full rounded-2xl">
        <div className={surfaceClasses}>
          {image}
          {body}
          <Link href={href} aria-label={`${actionLabel}: ${title}`} className="absolute inset-0 z-0" />
        </div>
      </MotionCard>
    );
  }

  return (
    <MotionCard className="h-full rounded-2xl">
      <Link href={href} aria-label={`${actionLabel}: ${title}`} className={surfaceClasses}>
        {image}
        {body}
      </Link>
    </MotionCard>
  );
}
