"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";

type Project = {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  category: string | null;
  thumbnail: string | null;
  liveUrl: string | null;
  createdAt: string;
};

export function PortfolioGrid({
  projects,
  categories,
}: {
  projects: Project[];
  categories: string[];
}) {
  const [active, setActive] = useState("All");

  const filtered = active === "All"
    ? projects
    : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Category filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                active === cat
                  ? "bg-indigo-600 text-white"
                  : "border border-zinc-300 bg-white text-zinc-600 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-zinc-900">
            {active === "All" ? "All Projects" : active}
            <span className="ml-2 text-base font-normal text-zinc-400">({filtered.length})</span>
          </h2>
          <Link
            href="/our-projects"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-200 bg-white py-20">
            <Briefcase className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">No projects in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((project) => (
              <Link
                key={project.id}
                href={`/our-projects/${project.slug || project.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                  {project.thumbnail ? (
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Briefcase className="h-10 w-10 text-zinc-300" />
                    </div>
                  )}
                  {project.category && (
                    <span className="absolute left-3 top-3 rounded-md bg-indigo-600 px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                      {project.category}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 group-hover:gap-2.5 transition-all">
                    View Project <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
