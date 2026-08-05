import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Code2, CheckCircle, Pencil, Search, Send } from "lucide-react";
import { getPublicServices } from "@/app/actions/services";
import { getSection } from "@/app/actions/site-content";
import { isModuleDisabled } from "@/lib/module-visibility";
import { ModuleDisabledPage } from "@/components/content/ModuleDisabledPage";
import { resolveTokensOnServer } from "@/lib/content/resolve-tokens-server";
import { PageHero } from "@/components/content/PageHero";
import { ServicesGrid } from "@/components/ServicesGrid";
import { FeaturedServicesGrid } from "@/components/FeaturedServicesGrid";

// ─── Static process steps ────────────────────────────────────────────────────

const PROCESS_STEPS = [
  { num: "01", icon: Search, label: "Discovery" },
  { num: "02", icon: BookOpen, label: "Planning" },
  { num: "03", icon: Pencil, label: "Design" },
  { num: "04", icon: Code2, label: "Development" },
  { num: "05", icon: CheckCircle, label: "Testing" },
  { num: "06", icon: Send, label: "Delivery" },
];

// ─── Section: Development Process ────────────────────────────────────────────

function DevelopmentProcess() {
  return (
    <section className="bg-[#f8f9ff] px-4 py-20 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-extrabold text-zinc-900 sm:text-3xl">
            Development Process
          </h2>
          <div className="mx-auto mt-3 h-0.5 w-24 rounded-full bg-zinc-300" />
        </div>

        <div className="flex flex-wrap items-start justify-center">
          {PROCESS_STEPS.map(({ num, icon: Icon, label }, i) => (
            <div key={label} className="w-1/2 sm:w-1/3 lg:w-auto flex flex-col items-center px-2 sm:px-4 lg:px-0">
              <div className="flex items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-indigo-200 bg-white shadow-sm shrink-0">
                  <Icon className="h-7 w-7 text-indigo-400" strokeWidth={1.5} />
                </div>
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="hidden lg:block h-0.5 w-28 bg-indigo-200" />
                )}
              </div>
              <p className="text-[10px] font-bold text-zinc-400 mt-3">{num}</p>
              <p className="text-xs font-semibold text-zinc-700 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: CTA ────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              <span className="text-amber-500">Ready to Start</span>
              <br />
              <span className="text-zinc-900">Your Project?</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-500">
              Let&apos;s build something amazing together. Get in touch with our
              team today.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
              >
                Get a Free Quote
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/Rectangle.png"
              alt="Web development"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Metadata (Task 24, Phase 19) ───────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  // Title intentionally omitted — the tab title stays the site name from
  // Settings > General (default title set in app/(user)/layout.tsx). Only the
  // description is derived from hero content.
  const heroSection = await getSection("our-services", "our-services.hero");
  const description = heroSection.data.subheading
    ? await resolveTokensOnServer(heroSection.data.subheading)
    : undefined;
  return { description };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ServicesPublicPage() {
  if (await isModuleDisabled("service")) return <ModuleDisabledPage moduleLabel="Services" />;
  const [services, heroSection] = await Promise.all([
    getPublicServices(),
    getSection("our-services", "our-services.hero"),
  ]);

  // "Total Services" is the one stat that must reflect live data rather than
  // admin-authored content, so it's computed here and prepended in front of
  // whatever stats are configured in the CMS, rather than being part of the
  // editable schema itself.
  const heroData = {
    ...heroSection.data,
    stats: [
      { value: `${services.length}+`, label: "TOTAL {{service.plural}}", iconName: "layers" },
      ...(heroSection.data.stats ?? []),
    ],
  };

  return (
    <>
      <PageHero data={heroData} />
      <FeaturedServicesGrid services={services} />
      <ServicesGrid services={services} />
      <DevelopmentProcess />
      <CTASection />
    </>
  );
}
