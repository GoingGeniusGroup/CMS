"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Layers } from "lucide-react";

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

export function ProjectsGrid({ projects }: { projects: ProjectData[] }) {
  const [flippedIds, setFlippedIds] = useState<Set<string>>(new Set());

  const toggleFlip = (id: string) => {
    setFlippedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <section id="projects" className="bg-[#f6f4f3] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
              OUR WORK
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-zinc-900">
              Featured <span className="text-indigo-600">Projects</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-500">
              Explore our latest work and see how we help businesses grow.
            </p>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projects.map((project) => {
                const isFlipped = flippedIds.has(project.id);
                return (
                  <div
                    key={project.id}
                    className="group perspective-[1000px] sm:h-[400px]"
                  >
                    <div
                      className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] sm:group-hover:[transform:rotateY(180deg)] ${
                        isFlipped ? "[transform:rotateY(180deg)]" : ""
                      }`}
                    >
                      {/* Front */}
                      <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl border border-zinc-200 bg-white shadow-sm flex flex-col overflow-hidden">
                        {project.thumbnail ? (
                          <div className="aspect-[3/2] w-full overflow-hidden relative bg-zinc-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={project.thumbnail}
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="aspect-[3/2] w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100">
                            <Layers className="h-12 w-12 text-indigo-300" strokeWidth={1.5} />
                          </div>
                        )}
                        <div className="flex flex-col flex-1 p-5">
                          {project.category && (
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                              {project.category}
                            </p>
                          )}
                          <h3 className="text-base font-bold text-zinc-900">
                            {project.title}
                          </h3>
                          {project.description && (
                            <p className="mt-1 text-sm leading-relaxed text-zinc-500 line-clamp-2">
                              {project.description}
                            </p>
                          )}
                          <div className="mt-auto flex pt-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFlip(project.id);
                              }}
                              className="sm:hidden flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-400 transition-colors hover:border-indigo-300 hover:text-indigo-500"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                            <span className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-400">
                              <ChevronRight className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Back */}
                      <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center gap-4">
                        <h3 className="text-base font-bold text-zinc-900 text-center">
                          {project.title}
                        </h3>
                        <p className="text-sm text-zinc-500 text-center line-clamp-4 px-2">
                          {project.description || "No description available."}
                        </p>
                        <Link
                          href={`/our-projects/${project.id}`}
                          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                        >
                          View Project
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
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
    </>
  );
}
