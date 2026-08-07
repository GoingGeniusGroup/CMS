import type { Metadata } from "next";
import { getPublicServices } from "@/app/actions/services";
import { getSection } from "@/app/actions/site-content";
import { isModuleDisabled } from "@/lib/module-visibility";
import { ModuleDisabledPage } from "@/components/content/ModuleDisabledPage";
import { resolveTokensOnServer } from "@/lib/content/resolve-tokens-server";
import { PageHero } from "@/components/content/PageHero";
import { CtaSection } from "@/components/content/CtaSection";
import { StatsSection } from "@/components/content/StatsSection";
import { ServicesGrid } from "@/components/ServicesGrid";
import { FeaturedServicesGrid } from "@/components/FeaturedServicesGrid";

// ─── Metadata (Task 24, Phase 19) ───────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  // Title intentionally omitted — the tab title stays the site name from
  // Settings > General (default title set in app/(user)/layout.tsx). Only the
  // description is derived from hero content.
  const heroSection = await getSection("our-services", "our-services.hero");
  const description = heroSection.data.Subheading
    ? await resolveTokensOnServer(heroSection.data.Subheading)
    : undefined;
  return { description };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ServicesPublicPage() {
  if (await isModuleDisabled("service")) return <ModuleDisabledPage moduleLabel="Services" />;
  const [services, heroSection, statsSection, ctaSection] = await Promise.all([
    getPublicServices(),
    getSection("our-services", "our-services.hero"),
    getSection("our-services", "our-services.stats"),
    getSection("our-services", "our-services.cta"),
  ]);

  // Stats live in their own editable section (kind "stats"), managed
  // separately from the hero, so the hero's stale `stats` payload (kept in
  // existing DB rows) is dropped before rendering. All stats — including
  // "TOTAL SERVICES" — are ordinary admin-editable cards.
  const heroData = { ...heroSection.data };
  delete heroData.stats;

  return (
    <>
      <PageHero data={heroData} />
      <StatsSection data={statsSection.data} />
      <FeaturedServicesGrid services={services} />
      <ServicesGrid services={services} />
      <CtaSection data={ctaSection.data} />
    </>
  );
}