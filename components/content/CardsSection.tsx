"use client";

import type { CardsData } from "@/lib/content/schemas";
import { getHeroStatIcon } from "@/lib/content/hero-icons";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { MotionCard } from "@/components/motion/MotionCard";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { usePublicLabelResolver } from "@/components/content/PublicLabelProvider";

/**
 * Editable icon-card section (Phase 3) driven by `cardsSchema`, in one of two
 * presentations:
 *  - "grid": centered icon-card grid on a tinted band (about-us Core Values,
 *    the original homepage Products look)
 *  - "list": left-aligned icon list inside a bordered container (about-us
 *    Why Work With Us)
 * Icons resolve from the same named registry as stat cards
 * (`lib/content/hero-icons.ts`) via each item's `iconName`.
 */
export function CardsSection({ data }: { data: CardsData }) {
  const resolveLabel = usePublicLabelResolver();

  if (data.items.length === 0) return null;

  if (data.variant === "list") {
    return (
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm lg:p-12">
            <RevealOnScroll>
              {data.eyebrow && (
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                  {resolveLabel(data.eyebrow)}
                </p>
              )}
              {data.heading && (
                <h2 className="text-3xl font-extrabold text-zinc-900 sm:text-4xl">
                  {resolveLabel(data.heading)}
                </h2>
              )}
              {data.subheading && (
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-500">
                  {resolveLabel(data.subheading)}
                </p>
              )}
            </RevealOnScroll>

            <div className="mt-8 flex flex-col gap-5">
              {data.items.map((item, i) => {
                const Icon = getHeroStatIcon(item.iconName);
                return (
                  <RevealOnScroll
                    key={item.id}
                    delay={i * 0.05}
                    className="flex items-start gap-4"
                  >
                    {Icon && (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                        <Icon className="h-5 w-5 text-indigo-500" strokeWidth={1.5} />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-zinc-900">
                        {resolveLabel(item.title)}
                      </p>
                      {item.description && (
                        <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
                          {resolveLabel(item.description)}
                        </p>
                      )}
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>

            {data.ctaLabel && (
              <div className="mt-8">
                <a
                  href={data.ctaHref || "#"}
                  className="text-sm font-semibold text-indigo-600 hover:underline"
                >
                  {resolveLabel(data.ctaLabel)}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f8f9ff] px-4 py-20 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mb-12 text-center">
          {data.eyebrow && (
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-600">
              {resolveLabel(data.eyebrow)}
            </p>
          )}
          {data.heading && (
            <h2 className="text-3xl font-extrabold text-zinc-900">
              {resolveLabel(data.heading)}
            </h2>
          )}
          {data.subheading && (
            <p className="mx-auto mt-3 max-w-md text-sm text-zinc-500">
              {resolveLabel(data.subheading)}
            </p>
          )}
        </RevealOnScroll>

        <StaggerGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {data.items.map((item) => {
            const Icon = getHeroStatIcon(item.iconName);
            return (
              <StaggerItem key={item.id}>
                <MotionCard className="h-full rounded-2xl">
                  <div className="flex h-full flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                    {Icon && <Icon className="h-7 w-7 text-indigo-500" strokeWidth={1.5} />}
                    <p className="text-sm font-extrabold text-zinc-900">
                      {resolveLabel(item.title)}
                    </p>
                    {item.description && (
                      <p className="text-xs leading-relaxed text-zinc-500">
                        {resolveLabel(item.description)}
                      </p>
                    )}
                  </div>
                </MotionCard>
              </StaggerItem>
            );
          })}
        </StaggerGrid>

        {data.ctaLabel && (
          <div className="mt-10 text-center">
            <a
              href={data.ctaHref || "#"}
              className="text-sm font-semibold text-indigo-600 hover:underline"
            >
              {resolveLabel(data.ctaLabel)}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
