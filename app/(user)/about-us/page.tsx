import Link from "next/link";
import {
  ArrowRight,
  BarChart2,
  BookOpen,
  Globe,
  Heart,
  Lightbulb,
  MessageSquare,
  Rocket,
  Scale,
  Shield,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import { getSection } from "@/app/actions/site-content";
import { resolveTokensOnServer } from "@/lib/content/resolve-tokens-server";
import { PageHero } from "@/components/content/PageHero";

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

// ─── Section 2: Stats ─────────────────────────────────────────────────────────

const STATS = [
  { icon: Rocket,   value: "250+", label: "Projects Completed" },
  { icon: Heart,    value: "120+", label: "Happy Clients"       },
  { icon: BookOpen, value: "8+",   label: "Years Experience"    },
  { icon: Users,    value: "40+",  label: "Team Members"        },
];

function StatsSection() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <Icon className="h-7 w-7 text-indigo-500" strokeWidth={1.5} />
              <p className="text-3xl font-extrabold text-zinc-900">{value}</p>
              <p className="text-xs text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 3: Our Story + Timeline ─────────────────────────────────────────

const TIMELINE = [
  { year: "2021", title: "Company Founded",       desc: "Started with a small office and a big vision to redefine digital solutions." },
  { year: "2022", title: "Expanded Our Services", desc: "Grew our capabilities to include mobile app development and UI/UX design." },
  { year: "2023", title: "Crossed 100+ Projects", desc: "Successfully delivered over 100 high-impact projects for global clients." },
  { year: "2024", title: "Growing Stronger Together", desc: "Expanding our global footprint with 40+ dedicated geniuses on board." },
];

function OurStorySection() {
  return (
    <section id="our-story" className="bg-[#f8f9ff] px-4 py-20 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Left */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-indigo-600" />
              <h2 className="text-2xl font-extrabold text-zinc-900 sm:text-3xl">
                Our Story
              </h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              Founded in 2021, Going Genius started with a simple idea — help
              businesses grow the right way. Today, we are a team of passionate
              designers, developers and strategists delivering world-class digital
              experiences.
            </p>
            <div className="relative aspect-[4/3] mt-8 overflow-hidden rounded-2xl border border-zinc-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/career3.png"
                alt="Going Genius team"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right — Timeline */}
          <div className="flex flex-col gap-0 pt-2">
            {TIMELINE.map((item, i) => (
              <div key={item.year} className="relative flex gap-5 pb-8 last:pb-0">
                {/* Line */}
                {i < TIMELINE.length - 1 && (
                  <div className="absolute left-[11px] top-7 h-full w-0.5 bg-zinc-200" />
                )}
                {/* Dot */}
                <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${i === 0 ? "border-indigo-600 bg-indigo-600" : "border-zinc-300 bg-white"}`}>
                  {i === 0 && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-400">{item.year}</p>
                  <p className="mt-0.5 text-sm font-bold text-zinc-900">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 4: Mission & Vision ─────────────────────────────────────────────

function MissionVisionSection() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
              <Globe className="h-6 w-6 text-indigo-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-extrabold text-zinc-900">Our Mission</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              To empower businesses with innovative and reliable digital solutions
              that solve real problems and create lasting value in an ever-evolving
              tech landscape.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
              <Star className="h-6 w-6 text-indigo-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-extrabold text-zinc-900">Our Vision</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              To be a leading digital transformation partner known for excellence,
              creativity and customer success worldwide, setting new standards for
              innovation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 5: Core Values ───────────────────────────────────────────────────

const VALUES = [
  { icon: Lightbulb, title: "Innovation",     desc: "We embrace new ideas and technologies." },
  { icon: Shield,    title: "Integrity",      desc: "We believe in honesty and transparency." },
  { icon: Star,      title: "Excellence",     desc: "We never settle for anything less." },
  { icon: Users,     title: "Collaboration",  desc: "We grow together as a team." },
  { icon: Heart,     title: "Customer First", desc: "Your success is our success." },
];

function CoreValuesSection() {
  return (
    <section className="bg-[#f8f9ff] px-4 py-20 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-zinc-900">Our Core Values</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-500">
            The principles that guide every decision we make and every project we undertake.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <Icon className="h-7 w-7 text-indigo-500" strokeWidth={1.5} />
              <p className="text-sm font-extrabold text-zinc-900">{title}</p>
              <p className="text-xs leading-relaxed text-zinc-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 6: Why Work With Us + CTA ───────────────────────────────────────

const WHY_US = [
  { icon: TrendingUp,   title: "Growth & Learning",  desc: "Continuous learning and professional development opportunities." },
  { icon: Heart,        title: "Great Culture",       desc: "Friendly and supportive work environment that values people." },
  { icon: BarChart2,    title: "Exciting Projects",   desc: "Work on impactful and innovative projects for global clients." },
  { icon: Scale,        title: "Work-Life Balance",   desc: "We value your time and well-being outside of work." },
];

function WhyWorkSection() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm lg:p-12">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            {/* Left */}
            <div>
              <h2 className="text-3xl font-extrabold text-zinc-900 sm:text-4xl">
                Why work with us?
              </h2>
              <div className="mt-8 flex flex-col gap-5">
                {WHY_US.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                      <Icon className="h-5 w-5 text-indigo-500" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">{title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — CTA card */}
            <div className="flex items-center">
              <div className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                  <MessageSquare className="h-6 w-6 text-indigo-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-extrabold leading-snug text-zinc-900">
                  Let&apos;s build something amazing together
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                  Have a project in mind? We would love to hear from you and
                  discuss how we can help you achieve your goals.
                </p>
                <Link
                  href="/contact"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                >
                  Get In Touch
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AboutUsPage() {
  const heroSection = await getSection("about-us", "about-us.hero");

  return (
    <>
      <PageHero data={heroSection.data} />
      <StatsSection />
      <OurStorySection />
      <MissionVisionSection />
      <CoreValuesSection />
      <WhyWorkSection />
    </>
  );
}
