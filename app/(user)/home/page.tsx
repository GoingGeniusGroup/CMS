import type { Metadata } from "next";
import { resolveTokensOnServer } from "@/lib/content/resolve-tokens-server";
import { LandingServicesSection } from "@/components/LandingServicesSection";
import { LandingFeaturedProjects } from "@/components/LandingFeaturedProjects";
import { LandingBlogSection } from "@/components/LandingBlogSection";
import { LandingTeamSection } from "@/components/LandingTeamSection";
import { LandingPartnersSection } from "@/components/LandingPartnersSection";
import { LandingTechSection } from "@/components/LandingTechSection";
import { FaqSection } from "@/components/FaqSection";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { MotionCard } from "@/components/motion/MotionCard";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { PageHero } from "@/components/content/PageHero";
import type { CardsData } from "@/lib/content/schemas";
import { getPublicPartners } from "@/app/actions/settings";
import { getPublicTechnologies } from "@/app/actions/public-settings";
import { getPublicServices } from "@/app/actions/services";
import { getPublicProjects } from "@/app/actions/projects";
import { getPublicBlogs } from "@/app/actions/blogs";
import { getPublicTeamMembers } from "@/app/actions/team";
import { getPublicFaqs } from "@/app/actions/faq";
import { getSection } from "@/app/actions/site-content";

// ─── Featured Works ───────────────────────────────────────────────────────────

function Products({ data }: { data: CardsData }) {
  if (data.items.length === 0) return null;

  return (
    <section id="products" className="bg-[#f6f4f3] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mb-8 flex items-center justify-between">
          <div>
            {data.eyebrow && (
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                {data.eyebrow}
              </p>
            )}
            {data.heading && (
              <h2 className="mt-2 text-2xl font-extrabold text-zinc-900">{data.heading}</h2>
            )}
          </div>
          {data.ctaLabel && (
            <a
              href={data.ctaHref || "#contact"}
              className="text-sm font-semibold text-indigo-600 hover:underline"
            >
              {data.ctaLabel}
            </a>
          )}
        </RevealOnScroll>

        <StaggerGrid className="grid gap-6 sm:grid-cols-3">
          {data.items.map((product) => (
            <StaggerItem key={product.id}>
              <MotionCard className="h-full rounded-2xl">
                <div className="h-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-bold text-zinc-900">{product.title}</h3>
                  {product.description && (
                    <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                      {product.description}
                    </p>
                  )}
                </div>
              </MotionCard>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}


// ─── FAQ ───────────────────────────────────────────────────────────────────
// (dynamic content from database — see FaqSection component)

// ─── Metadata (Task 24, Phase 19) ───────────────────────────────────────────
// Derived from the hero's own heading/subheading, so the browser tab and any
// share preview reflect whatever an admin has actually configured for the
// homepage hero — rather than a static string unrelated to the visible page.

export async function generateMetadata(): Promise<Metadata> {
  // Title intentionally omitted — the tab title stays the site name from
  // Settings > General (default title set in app/(user)/layout.tsx). Only the
  // description is derived from hero content.
  const heroSection = await getSection("home", "home.hero");
  const description = heroSection.data.subheading
    ? await resolveTokensOnServer(heroSection.data.subheading)
    : undefined;
  return { description };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function Page() {
  const [
    rawPartners,
    rawTechnologies,
    rawServices,
    rawProjects,
    rawBlogs,
    rawTeam,
    rawFaqs,
    heroSection,
    productsSection,
    partnersHeader,
    techHeader,
    servicesHeader,
    projectsHeader,
    blogHeader,
    teamHeader,
    faqHeader,
  ] = await Promise.all([
    getPublicPartners(),
    getPublicTechnologies(),
    getPublicServices(),
    getPublicProjects(),
    getPublicBlogs(),
    getPublicTeamMembers(),
    getPublicFaqs(),
    getSection("home", "home.hero"),
    getSection("home", "home.products"),
    getSection("home", "home.partners"),
    getSection("home", "home.tech"),
    getSection("home", "home.services"),
    getSection("home", "home.projects"),
    getSection("home", "home.blog"),
    getSection("shared", "shared.team"),
    getSection("shared", "shared.faq"),
  ]);

  // Serialize Date objects to strings for client component props
  const partners = JSON.parse(JSON.stringify(rawPartners));
  const technologies = JSON.parse(JSON.stringify(rawTechnologies));
  const services = JSON.parse(JSON.stringify(rawServices));
  const projects = JSON.parse(JSON.stringify(rawProjects));
  const blogs = JSON.parse(JSON.stringify(rawBlogs));
  const team = JSON.parse(JSON.stringify(rawTeam));
  const faqs = JSON.parse(JSON.stringify(rawFaqs));

  return (
    <>
      <PageHero data={heroSection.data} />
      <LandingPartnersSection initialPartners={partners} headerData={partnersHeader.data} />
      <LandingTechSection initialTechnologies={technologies} headerData={techHeader.data} />
      <LandingServicesSection initialServices={services} headerData={servicesHeader.data} />
      <Products data={productsSection.data} />
      <LandingFeaturedProjects initialProjects={projects} headerData={projectsHeader.data} />
      <LandingBlogSection initialBlogs={blogs} headerData={blogHeader.data} />
      <LandingTeamSection initialMembers={team} headerData={teamHeader.data} />
      <FaqSection initialFaqs={faqs} headerData={faqHeader.data} />
    </>
  );
}