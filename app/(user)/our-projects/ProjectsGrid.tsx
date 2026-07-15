"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Layers } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type ProjectData = {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  budget: number | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
};

// ─── Project Detail Modal ────────────────────────────────────────────────────

function ProjectDetailModal({
  project,
  open,
  onClose,
}: {
  project: ProjectData | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-zinc-500 shadow-sm backdrop-blur-sm hover:bg-white hover:text-zinc-900"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Thumbnail */}
        {project.thumbnail && (
          <div className="relative h-56 w-full overflow-hidden rounded-t-2xl">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              sizes="500px"
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-extrabold text-zinc-900 sm:text-2xl">
            {project.title}
          </h2>

          {project.description && (
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 whitespace-pre-line">
              {project.description}
            </p>
          )}

          {/* Meta info */}
          <div className="mt-5 flex flex-wrap gap-4 text-xs text-zinc-500">
            {project.budget != null && (
              <span className="rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-600">
                Budget: Rs. {project.budget.toLocaleString()}
              </span>
            )}
            {project.startDate && (
              <span className="rounded-full bg-zinc-100 px-3 py-1">
                Started: {new Date(project.startDate).toLocaleDateString()}
              </span>
            )}
            {project.endDate && (
              <span className="rounded-full bg-zinc-100 px-3 py-1">
                Completed: {new Date(project.endDate).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="mt-6">
            <a
              href="/contact"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Start Similar Project
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Project Card ────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  onViewDetails,
}: {
  project: ProjectData;
  onViewDetails: () => void;
}) {
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
        <h3 className="text-base font-bold text-zinc-900">{project.title}</h3>
        {project.description && (
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 line-clamp-2">
            {project.description}
          </p>
        )}

        {/* View Project link */}
        <button
          type="button"
          onClick={onViewDetails}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:gap-2.5 transition-all"
        >
          View Project
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Projects Grid ───────────────────────────────────────────────────────────

export function ProjectsGrid({ projects }: { projects: ProjectData[] }) {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  return (
    <>
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
                <ProjectCard
                  key={project.id}
                  project={project}
                  onViewDetails={() => setSelectedProject(project)}
                />
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

      <ProjectDetailModal
        open={!!selectedProject}
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
