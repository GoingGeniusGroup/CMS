"use client";

import type { StatsData } from "@/lib/content/schemas";
import { StatsCards } from "@/components/content/StatsCards";

/**
 * Standalone, admin-editable stats section (Phase 1) — the standard section
 * chrome (white band, page padding) around the shared `StatsCards` row. Every
 * page with stats (our-services, our-projects, about-us, company) renders
 * this from its own "stats"-kind section.
 */
export function StatsSection({ data }: { data: StatsData }) {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <StatsCards data={data} />
      </div>
    </section>
  );
}
