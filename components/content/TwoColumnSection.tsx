"use client";

import Link from "next/link";
import type { TwoColumnData } from "@/lib/content/schemas";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { IconRenderer } from "@/components/content/IconRenderer";
import { usePublicLabelResolver } from "@/components/content/PublicLabelProvider";

/**
 * Editable two-column icon-card block (Phase 3) driven by
 * `twoColumnSectionSchema` — the about-us Mission & Vision cards. The header
 * (eyebrow/heading/copy) and trailing button are optional; a section with none
 * of them renders just the two cards, like the original Mission & Vision.
 */
export function TwoColumnSection({ data }: { data: TwoColumnData }) {
  const resolveLabel = usePublicLabelResolver();

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {(data.eyebrow || data.heading || data.copy) && (
          <RevealOnScroll className="mb-10 max-w-2xl">
            {data.eyebrow && (
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                {resolveLabel(data.eyebrow)}
              </p>
            )}
            {data.heading && (
              <h2 className="mt-2 text-3xl font-extrabold text-zinc-900">
                {resolveLabel(data.heading)}
              </h2>
            )}
            {data.copy && (
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                {resolveLabel(data.copy)}
              </p>
            )}
          </RevealOnScroll>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {data.items.map((item, i) => {
            return (
              <RevealOnScroll
                key={i}
                delay={i * 0.05}
                className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
              >
                {item.iconName && (
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                    <IconRenderer name={item.iconName} className="h-6 w-6 text-indigo-500" strokeWidth={1.5} />
                  </div>
                )}
                <h3 className="text-lg font-extrabold text-zinc-900">
                  {resolveLabel(item.title)}
                </h3>
                {item.description && (
                  <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                    {resolveLabel(item.description)}
                  </p>
                )}
              </RevealOnScroll>
            );
          })}
        </div>

        {data.buttonLabel && (
          <RevealOnScroll className="mt-10">
            <Link
              href={data.buttonHref || "/contact"}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              {resolveLabel(data.buttonLabel)}
            </Link>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}
