"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type ProjectData = {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  category: string | null;
  thumbnail: string | null;
  budget: number | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
};

// ─── Project Card ────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: ProjectData }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
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
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
            <span className="text-4xl font-extrabold text-indigo-200">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {project.category && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            {project.category}
          </p>
        )}
        <h3 className="text-base font-bold text-zinc-900">{project.title}</h3>
        {project.description && (
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 line-clamp-2">
            {project.description}
          </p>
        )}

        {/* View Project link */}
        <Link
          href={`/our-projects/${project.id}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:gap-2.5 transition-all"
        >
          View Project
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

// ─── Projects Grid ───────────────────────────────────────────────────────────

export function ProjectsGrid({ projects }: { projects: ProjectData[] }) {
  return (
    <section id="projects" className="bg-[#f6f4f3] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-zinc-900 sm:text-3xl">
            Our Projects
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Explore our latest work and see how we help businesses grow.
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Layers className="h-12 w-12 text-zinc-300" />
            <p className="mt-4 text-sm text-zinc-500">
              No projects published yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
