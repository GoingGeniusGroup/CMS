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
  onClick,
  href,
  fallback,
}: {
  title: string;
  description: string;
  imageUrl: string | null;
  actionLabel: string;
  /** Opens a modal. Mutually exclusive with `href`. */
  onClick?: () => void;
  /** Navigates instead of opening a modal. Mutually exclusive with `onClick`. */
  href?: string;
  /** Rendered in place of the image when `imageUrl` is null. */
  fallback?: ReactNode;
}) {
  const surfaceClasses = `group relative block w-full aspect-[3/2] overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2`;

  const inner = (
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

        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="text-base font-bold text-white">{title}</h3>

          <div className="max-h-32 overflow-hidden opacity-100 transition-all duration-300 ease-out sm:max-h-0 sm:opacity-0 sm:group-hover:max-h-32 sm:group-hover:opacity-100 sm:group-focus-visible:max-h-32 sm:group-focus-visible:opacity-100">
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/75">
              {description}
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
              {actionLabel}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
    </>
  );

  return (
    <MotionCard className="h-full rounded-2xl">
      {href ? (
        <Link href={href} aria-label={`${actionLabel}: ${title}`} className={surfaceClasses}>
          {inner}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onClick}
          aria-label={`${actionLabel}: ${title}`}
          className={surfaceClasses}
        >
          {inner}
        </button>
      )}
    </MotionCard>
  );
}
