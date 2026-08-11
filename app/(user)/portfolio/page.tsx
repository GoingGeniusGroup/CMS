import { isModuleDisabled } from "@/lib/module-visibility";
import { ModuleDisabledPage } from "@/components/content/ModuleDisabledPage";
import { PageHero } from "@/components/content/PageHero";
import { StatsSection } from "@/components/content/StatsSection";
import { CtaSection } from "@/components/content/CtaSection";
import { getSection } from "@/app/actions/site-content";
import { getPublicProjects } from "@/app/actions/projects";
import { PortfolioGrid } from "./PortfolioGrid";

export default async function PortfolioPage() {
  if (await isModuleDisabled("project")) return <ModuleDisabledPage moduleLabel="Portfolio" />;

  const [heroSection, statsSection, ctaSection, projects] = await Promise.all([
    getSection("portfolio", "portfolio.hero"),
    getSection("portfolio", "portfolio.stats"),
    getSection("portfolio", "portfolio.cta"),
    getPublicProjects(),
  ]);

  // Derive unique categories from real project data
  const categories = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean) as string[])),
  ];

  return (
    <div className="bg-[#f6f4f3]">
      <PageHero data={heroSection.data} />
      <StatsSection data={statsSection.data} />

      {/* Projects Grid — client component for filtering */}
      <PortfolioGrid
        projects={JSON.parse(JSON.stringify(projects))}
        categories={categories}
      />

      <CtaSection data={ctaSection.data} />
    </div>
  );
}
