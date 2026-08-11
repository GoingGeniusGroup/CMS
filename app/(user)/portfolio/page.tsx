import { isModuleDisabled } from "@/lib/module-visibility";
import { ModuleDisabledPage } from "@/components/content/ModuleDisabledPage";
import { PageHero } from "@/components/content/PageHero";
import { CtaSection } from "@/components/content/CtaSection";
import { getSection } from "@/app/actions/site-content";
import { getPublicProjects } from "@/app/actions/projects";
import { PortfolioGrid } from "./PortfolioGrid";

export default async function PortfolioPage() {
  if (await isModuleDisabled("project")) return <ModuleDisabledPage moduleLabel="Portfolio" />;

  const [heroSection, ctaSection, projects] = await Promise.all([
    getSection("portfolio", "portfolio.hero"),
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

      {/* Stats from real data */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: `${projects.length}+`, label: "Projects Completed" },
            { value: `${new Set(projects.map((p) => p.category).filter(Boolean)).size}+`, label: "Industries Served" },
            { value: "6+", label: "Years Experience" },
            { value: "120+", label: "Happy Clients" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1.5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-2xl font-extrabold text-zinc-900 sm:text-3xl">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Grid — client component for filtering */}
      <PortfolioGrid
        projects={JSON.parse(JSON.stringify(projects))}
        categories={categories}
      />

      <CtaSection data={ctaSection.data} />
    </div>
  );
}
