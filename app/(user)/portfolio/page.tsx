"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Rocket,
  Smile,
  Award,
  Building2,
  Code2,
  FileCode2,
} from "lucide-react";
import { images } from "@/lib/images";

// ─── Data ────────────────────────────────────────────────────────────────────

const STATS = [
  { icon: Rocket, value: "150+", label: "PROJECTS COMPLETED" },
  { icon: Smile, value: "120+", label: "HAPPY CLIENTS" },
  { icon: Award, value: "6+", label: "YEARS EXPERIENCE" },
  { icon: Building2, value: "20+", label: "INDUSTRIES SERVED" },
];

const CATEGORIES = [
  "All Projects",
  "Web Development",
  "Mobile Apps",
  "UI/UX Design",
  "SaaS",
  "E-commerce",
  "Graphic Design",
];

const SORT_OPTIONS = ["Newest First", "Oldest First", "A-Z", "Z-A"];

const PROJECTS = [
  {
    title: "Mobile Banking App",
    description:
      "Secure and seamless mobile banking experience with advanced biometrics.",
    category: "Mobile Apps",
    badge: "MOBILE APP",
    badgeColor: "bg-indigo-600",
    image: images.container3,
    techs: [
      { icon: FileCode2, name: "HTML" },
      { icon: Code2, name: "JS" },
    ],
  },
  {
    title: "Batch 8",
    description:
      "Secure and seamless mobile banking experience with advanced biometrics.",
    category: "Web Development",
    badge: "WEB APPLICATION",
    badgeColor: "bg-green-600",
    image: images.container3,
    techs: [
      { icon: Code2, name: "React" },
      { icon: Code2, name: "Node.js" },
    ],
  },
  {
    title: "Mobile Banking App",
    description:
      "Secure and seamless mobile banking experience with advanced biometrics.",
    category: "Mobile Apps",
    badge: "MOBILE APP",
    badgeColor: "bg-indigo-600",
    image: images.container3,
    techs: [
      { icon: FileCode2, name: "HTML" },
      { icon: Code2, name: "JS" },
    ],
  },
  {
    title: "Batch 8",
    description:
      "Secure and seamless mobile banking experience with advanced biometrics.",
    category: "Web Development",
    badge: "WEB APPLICATION",
    badgeColor: "bg-green-600",
    image: images.container3,
    techs: [
      { icon: Code2, name: "React" },
      { icon: Code2, name: "Node.js" },
    ],
  },
  {
    title: "Mobile Banking App",
    description:
      "Secure and seamless mobile banking experience with advanced biometrics.",
    category: "Mobile Apps",
    badge: "MOBILE APP",
    badgeColor: "bg-indigo-600",
    image: images.container3,
    techs: [
      { icon: FileCode2, name: "HTML" },
      { icon: Code2, name: "JS" },
    ],
  },
  {
    title: "Batch 8",
    description:
      "Secure and seamless mobile banking experience with advanced biometrics.",
    category: "Web Development",
    badge: "WEB APPLICATION",
    badgeColor: "bg-green-600",
    image: images.container3,
    techs: [
      { icon: Code2, name: "React" },
      { icon: Code2, name: "Node.js" },
    ],
  },
  {
    title: "Mobile Banking App",
    description:
      "Secure and seamless mobile banking experience with advanced biometrics.",
    category: "Mobile Apps",
    badge: "MOBILE APP",
    badgeColor: "bg-indigo-600",
    image: images.container3,
    techs: [
      { icon: FileCode2, name: "HTML" },
      { icon: Code2, name: "JS" },
    ],
  },
  {
    title: "Batch 8",
    description:
      "Secure and seamless mobile banking experience with advanced biometrics.",
    category: "Web Development",
    badge: "WEB APPLICATION",
    badgeColor: "bg-green-600",
    image: images.container3,
    techs: [
      { icon: Code2, name: "React" },
      { icon: Code2, name: "Node.js" },
    ],
  },
];

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
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-500 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-zinc-300 hover:text-white"
              >
                See How We Work
                <Play className="h-4 w-4" fill="currentColor" />
              </button>
            </div>

            {/* Trusted by */}
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                <Image
                  src={images.container3}
                  alt="Client avatars"
                  width={80}
                  height={32}
                  className="h-8 w-auto rounded-full object-contain"
                />
              </div>
              <p className="text-sm text-zinc-300">
                Trusted by{" "}
                <span className="font-semibold text-white">150+</span> clients
                worldwide
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={images.projectHero}
              alt="Web Development"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats Section ───────────────────────────────────────────────────────────

function StatsSection() {
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

// ─── Filter Bar ──────────────────────────────────────────────────────────────

function FilterBar({
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              activeCategory === cat
                ? "bg-indigo-600 text-white"
                : "border border-zinc-300 bg-white text-zinc-600 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-500">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 focus:border-indigo-500 focus:outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ─── Project Card ────────────────────────────────────────────────────────────

function ProjectCard({
  project,
}: {
  project: (typeof PROJECTS)[number];
}) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform group-hover:scale-105"
        />
        {/* Badge */}
        <span
          className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase text-white ${project.badgeColor}`}
        >
          {project.badge}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-zinc-900">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="mt-4 flex flex-wrap gap-3">
          {project.techs.map(({ icon: Icon, name }) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 text-xs text-zinc-500"
            >
              <Icon className="h-3.5 w-3.5" />
              {name}
            </span>
          ))}
        </div>

        {/* View Project link */}
        <Link
          href="#"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:gap-2.5 transition-all"
        >
          View Project
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

// ─── Projects Grid Section ───────────────────────────────────────────────────

function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("All Projects");
  const [sortBy, setSortBy] = useState("Newest First");

  const filteredProjects =
    activeCategory === "All Projects"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="bg-[#f6f4f3] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Filter */}
        <FilterBar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Section Header */}
        <div className="mt-10 mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-zinc-900">
            Our Projects
          </h2>
          <Link
            href="#"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline"
          >
            View All Projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProjects.map((project, idx) => (
            <ProjectCard key={idx} project={project} />
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
          {/* Left Content */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              LET&apos;S WORK TOGETHER
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-zinc-900 sm:text-4xl">
              Have a Project in Mind?
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-500">
              We&apos;re here to turn your ideas into powerful digital solutions
              that drive results. Our team of experts is ready to help you scale
              your business.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/home#contact"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Start Your Project
              </Link>
              <Link
                href="/home#contact"
                className="inline-flex items-center rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={images.projectHero}
              alt="Web Development"
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

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ProjectsSection />
      <CTASection />
    </>
  );
}
