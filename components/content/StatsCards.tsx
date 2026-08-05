"use client";

import type { StatsData } from "@/lib/content/schemas";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { getHeroStatIcon } from "@/lib/content/hero-icons";
import { usePublicLabelResolver } from "@/components/content/PublicLabelProvider";

/**
 * Shared stat-card markup (Phase 1) — the exact card UI PageHero's "stats"
 * layout renders, extracted so standalone, admin-editable stats sections
 * (our-projects, about-us, company) can use the identical look. A header is
 * only rendered if `data.eyebrow`/`data.heading` are set; the caller owns the
 * section wrapper (PageHero puts the row under its fold, pages wrap it in
 * their own section chrome).
 */
export function StatsCards({ data, className }: { data: StatsData; className?: string }) {
  const resolveLabel = usePublicLabelResolver();

  return (
    <>
      {(data.eyebrow || data.heading) && (
        <div className="mb-12 text-center">
          {data.eyebrow && (
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-600">
              {resolveLabel(data.eyebrow)}
            </p>
          )}
          {data.heading && (
            <h2 className="text-2xl font-extrabold text-zinc-900 sm:text-3xl">
              {resolveLabel(data.heading)}
            </h2>
          )}
        </div>
      )}

      <StaggerGrid className={`grid grid-cols-2 gap-4 sm:grid-cols-4 ${className ?? ""}`.trim()}>
        {data.items.map((stat) => {
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
    </>
  );
}
