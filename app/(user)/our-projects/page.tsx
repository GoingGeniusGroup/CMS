import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Rocket,
  Smile,
  Award,
  Building2,
} from "lucide-react";
import { getPublicProjects } from "@/app/actions/projects";
import { ProjectsGrid } from "@/components/ProjectsGrid";

// ─── Hero Section ────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="bg-[#f6f4f3] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-8 rounded-3xl bg-[#2d2d3f] p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Building Digital
              <br />
              Products
              <br />
              That Drive{" "}
              <span className="italic text-indigo-400">Real</span>
              <br />
              <span className="italic text-indigo-400">Impact</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-300">
              We design and develop innovative digital experiences that help
              brands grow, engage users, and achieve measurable business results
              through cutting-edge technology and precision engineering.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Explore Projects
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-500 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-zinc-300 hover:text-white"
              >
                Start a Project
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/ProjectHero.png"
              alt="Web Development"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              loading="eager"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats Section ───────────────────────────────────────────────────────────

function StatsSection({ totalProjects }: { totalProjects: number }) {
  const STATS = [
    { icon: Rocket, value: `${totalProjects}+`, label: "PROJECTS COMPLETED" },
    { icon: Smile, value: "120+", label: "HAPPY CLIENTS" },
    { icon: Award, value: "6+", label: "YEARS EXPERIENCE" },
    { icon: Building2, value: "20+", label: "INDUSTRIES SERVED" },
  ];

  return (
    <section className="bg-[#f6f4f3] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <Icon className="h-7 w-7 text-indigo-500" strokeWidth={1.5} />
              <p className="text-3xl font-extrabold text-zinc-900">{value}</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="bg-[#f6f4f3] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-8 rounded-3xl bg-[#f0eef9] p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              START YOUR PROJECT
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-zinc-900 sm:text-4xl">
              Have an Idea?
              <br />
              Let&apos;s Build It Together
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-500">
              Whether you need a website, mobile app, or a complete digital
              transformation — we&apos;re ready to turn your vision into reality.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Get a Free Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/our-services"
                className="inline-flex items-center rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400"
              >
                Our Services
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/Rectangle.png"
              alt="Start a project"
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function OurProjectsPage() {
  const projects = await getPublicProjects();

  return (
    <>
      <HeroSection />
      <StatsSection totalProjects={projects.length} />
      <ProjectsGrid projects={JSON.parse(JSON.stringify(projects))} />
      <CTASection />
    </>
  );
}
