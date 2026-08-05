"use client";

import Image from "next/image";
import type { TimelineData } from "@/lib/content/schemas";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { usePublicLabelResolver } from "@/components/content/PublicLabelProvider";

/**
 * Editable "Our Story" timeline (Phase 3) driven by `timelineSectionSchema`:
 * heading + copy + image on the left, a vertical list of dated milestones on
 * the right. The first milestone keeps the filled dot, later ones the hollow
 * ring — mirroring the original about-us markup exactly.
 */
export function TimelineSection({ data }: { data: TimelineData }) {
  const resolveLabel = usePublicLabelResolver();

  return (
    <section id="our-story" className="bg-[#f8f9ff] px-4 py-20 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Left — heading + copy + image */}
          <RevealOnScroll>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-indigo-600" />
              <h2 className="text-2xl font-extrabold text-zinc-900 sm:text-3xl">
                {resolveLabel(data.heading)}
              </h2>
            </div>
            {data.copy && (
              <p className="mt-4 text-sm leading-relaxed text-zinc-500">
                {resolveLabel(data.copy)}
              </p>
            )}
            {data.imageUrl && (
              <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-100">
                <Image
                  src={data.imageUrl}
                  alt={data.imageAlt || ""}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            )}
          </RevealOnScroll>

          {/* Right — timeline */}
          <RevealOnScroll delay={0.1} className="flex flex-col gap-0 pt-2">
            {data.items.map((item, i) => (
              <div key={i} className="relative flex gap-5 pb-8 last:pb-0">
                {/* Line */}
                {i < data.items.length - 1 && (
                  <div className="absolute left-[11px] top-7 h-full w-0.5 bg-zinc-200" />
                )}
                {/* Dot */}
                <div
                  className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                    i === 0 ? "border-indigo-600 bg-indigo-600" : "border-zinc-300 bg-white"
                  }`}
                >
                  {i === 0 && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-400">{item.year}</p>
                  <p className="mt-0.5 text-sm font-bold text-zinc-900">
                    {resolveLabel(item.title)}
                  </p>
                  {item.description && (
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                      {resolveLabel(item.description)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
