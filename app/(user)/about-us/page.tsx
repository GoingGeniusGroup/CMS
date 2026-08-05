import type { Metadata } from "next";
import { getSection } from "@/app/actions/site-content";
import { resolveTokensOnServer } from "@/lib/content/resolve-tokens-server";
import { PageHero } from "@/components/content/PageHero";
import { StatsSection } from "@/components/content/StatsSection";
import { TimelineSection } from "@/components/content/TimelineSection";
import { TwoColumnSection } from "@/components/content/TwoColumnSection";
import { CardsSection } from "@/components/content/CardsSection";
import { CtaSection } from "@/components/content/CtaSection";

// ─── Metadata (Task 24, Phase 19) ───────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  // Title intentionally omitted — the tab title stays the site name from
  // Settings > General (default title set in app/(user)/layout.tsx). Only the
  // description is derived from hero content.
  const heroSection = await getSection("about-us", "about-us.hero");
  const description = heroSection.data.subheading
    ? await resolveTokensOnServer(heroSection.data.subheading)
    : undefined;
  return { description };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AboutUsPage() {
  const [
    heroSection,
    statsSection,
    storySection,
    missionVisionSection,
    valuesSection,
    whyUsSection,
    ctaSection,
  ] = await Promise.all([
    getSection("about-us", "about-us.hero"),
    getSection("about-us", "about-us.stats"),
    getSection("about-us", "about-us.story"),
    getSection("about-us", "about-us.missionVision"),
    getSection("about-us", "about-us.values"),
    getSection("about-us", "about-us.whyUs"),
    getSection("about-us", "about-us.cta"),
  ]);

  return (
    <>
      <PageHero data={heroSection.data} />
      <StatsSection data={statsSection.data} />
      <TimelineSection data={storySection.data} />
      <TwoColumnSection data={missionVisionSection.data} />
      <CardsSection data={valuesSection.data} />
      <CardsSection data={whyUsSection.data} />
      <CtaSection data={ctaSection.data} />
    </>
  );
}