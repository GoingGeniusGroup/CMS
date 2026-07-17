"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bookmark, Briefcase, ChevronDown, MapPin, Clock } from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const DEPARTMENTS = ["All Departments", "Developer", "Design", "Marketing", "Operations"];

const JOBS = [
  {
    id: 1,
    dept: "Developer",
    title: "Frontend Developer",
    type: "Full-time",
    mode: "Remote",
    desc: "Help us build high-performance, accessible, and beautiful interfaces for our core platform using modern tech stacks.",
    tags: ["React", "TypeScript", "Tailwind", "Next.js"],
  },
  {
    id: 2,
    dept: "Developer",
    title: "Frontend Developer",
    type: "Full-time",
    mode: "Remote",
    desc: "Help us build high-performance, accessible, and beautiful interfaces for our core platform using modern tech stacks.",
    tags: ["React", "TypeScript", "Tailwind", "Next.js"],
  },
  {
    id: 3,
    dept: "Developer",
    title: "Frontend Developer",
    type: "Full-time",
    mode: "Remote",
    desc: "Help us build high-performance, accessible, and beautiful interfaces for our core platform using modern tech stacks.",
    tags: ["React", "TypeScript", "Tailwind", "Next.js"],
  },
  {
    id: 4,
    dept: "Developer",
    title: "Frontend Developer",
    type: "Full-time",
    mode: "Remote",
    desc: "Help us build high-performance, accessible, and beautiful interfaces for our core platform using modern tech stacks.",
    tags: ["React", "TypeScript", "Tailwind", "Next.js"],
  },
  {
    id: 5,
    dept: "Developer",
    title: "Frontend Developer",
    type: "Full-time",
    mode: "Remote",
    desc: "Help us build high-performance, accessible, and beautiful interfaces for our core platform using modern tech stacks.",
    tags: ["React", "TypeScript", "Tailwind", "Next.js"],
  },
  {
    id: 6,
    dept: "Developer",
    title: "Frontend Developer",
    type: "Full-time",
    mode: "Remote",
    desc: "Help us build high-performance, accessible, and beautiful interfaces for our core platform using modern tech stacks.",
    tags: ["React", "TypeScript", "Tailwind", "Next.js"],
  },
];

const LIFE_IMAGES = [
  { label: "Collaborative Environment", span: "col-span-2 row-span-2", bg: "bg-gradient-to-br from-slate-300 via-slate-200 to-zinc-300" },
  { label: "Team Meeting",              span: "col-span-1 row-span-1", bg: "bg-gradient-to-br from-indigo-200 to-blue-300" },
  { label: "Night Coding",              span: "col-span-1 row-span-1", bg: "bg-gradient-to-br from-zinc-700 to-zinc-900" },
];

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden text-center">
      <div className="relative w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/career1.png"
          alt="Careers at Going Genius"
          className="w-full"
        />
        {/* Text overlay — sits in the lower-center of the image */}
        <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/65 via-black/25 to-transparent px-4 pb-10">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-indigo-300">
            CAREERS AT GOING GENIUS
          </p>
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            Build Your Career With
            <br />
            Going Genius
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-200">
            Join a team of visionaries, engineers, and designers dedicated to
            building the future of corporate intelligence and efficient modern
            systems.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────

function JobCard({ job }: { job: (typeof JOBS)[number] }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-500">
          {job.dept}
        </span>
        <button
          type="button"
          aria-label="Bookmark job"
          className="text-zinc-400 hover:text-indigo-500 transition-colors"
        >
          <Bookmark className="h-4 w-4" />
        </button>
      </div>

      {/* Title */}
      <h3 className="mt-2 text-base font-bold text-zinc-900">{job.title}</h3>

      {/* Meta */}
      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {job.type}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {job.mode}
        </span>
      </div>

      {/* Description */}
      <p className="mt-3 text-xs leading-relaxed text-zinc-500 line-clamp-3">
        {job.desc}
      </p>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Apply */}
      <Link
        href="/career/apply"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-800 transition-all hover:gap-3 hover:text-indigo-600"
      >
        Apply Now
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

// ─── Open Positions ───────────────────────────────────────────────────────────

function OpenPositions() {
  const [activeDept, setActiveDept] = useState("All Departments");
  const [deptOpen, setDeptOpen] = useState(false);

  const filtered =
    activeDept === "All Departments"
      ? JOBS
      : JOBS.filter((j) => j.dept === activeDept);

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-900 sm:text-3xl">
              Open Positions
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Explore opportunities to make an impact.
            </p>
          </div>

          {/* Department filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDeptOpen((v) => !v)}
              className="inline-flex min-w-[160px] items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
            >
              {activeDept}
              <ChevronDown className={`h-4 w-4 transition-transform ${deptOpen ? "rotate-180" : ""}`} />
            </button>
            {deptOpen && (
              <div className="absolute right-0 top-full z-20 mt-1 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => { setActiveDept(dept); setDeptOpen(false); }}
                    className={`block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-indigo-50 hover:text-indigo-600 ${activeDept === dept ? "bg-indigo-50 font-semibold text-indigo-600" : "text-zinc-700"}`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 flex flex-col items-center gap-3 text-center">
            <Briefcase className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">
              No open positions in this department right now.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Life at Going Genius ─────────────────────────────────────────────────────

function LifeSection() {
  return (
    <section className="bg-[#f8f9ff] px-4 py-16 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-2xl font-extrabold text-zinc-900 sm:text-3xl">
          Life at Going Genius
        </h2>

        <div className="grid grid-cols-3 grid-rows-2 gap-4" style={{ height: 500 }}>
          {/* Large left — career2.png */}
          <div className="relative col-span-2 row-span-2 overflow-hidden rounded-2xl bg-[#d4cfc9]">
            <Image
              src="/career2.png"
              alt="Collaborative Environment"
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-contain"
            />
          </div>

          {/* Top right — career3.png */}
          <div className="relative overflow-hidden rounded-2xl bg-white">
            <Image
              src="/career3.png"
              alt="Team Meeting"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-contain"
            />
          </div>

          {/* Bottom right — career4.png */}
          <div className="relative overflow-hidden rounded-2xl bg-[#1a1a2e]">
            <Image
              src="/career4.png"
              alt="Night Coding"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CareerPage() {
  return (
    <>
      <HeroSection />
      <OpenPositions />
      <LifeSection />
    </>
  );
}
