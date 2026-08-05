import { getPublicProjects } from "@/app/actions/projects";
import { getSection } from "@/app/actions/site-content";
import { isModuleDisabled } from "@/lib/module-visibility";
import { ModuleDisabledPage } from "@/components/content/ModuleDisabledPage";
import { PageHero } from "@/components/content/PageHero";
import { StatsSection } from "@/components/content/StatsSection";
import { CtaSection } from "@/components/content/CtaSection";
import { ProjectsGrid } from "@/components/ProjectsGrid";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function OurProjectsPage() {
  if (await isModuleDisabled("project")) return <ModuleDisabledPage moduleLabel="Projects" />;
  const [projects, heroSection, statsSection, ctaSection] = await Promise.all([
    getPublicProjects(),
    getSection("our-projects", "our-projects.hero"),
    getSection("our-projects", "our-projects.stats"),
    getSection("our-projects", "our-projects.cta"),
  ]);

  return (
    <>
      <PageHero data={heroSection.data} />
      <StatsSection data={statsSection.data} />
      <ProjectsGrid projects={JSON.parse(JSON.stringify(projects))} />
      <CtaSection data={ctaSection.data} />
    </>
  );
}