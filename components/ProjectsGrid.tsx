"use client";

import { Layers } from "lucide-react";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { ShowcaseCard } from "@/components/ShowcaseCard";

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
  return (
    <section id="projects" className="bg-[#f6f4f3] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
            OUR WORK
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-zinc-900">
            Featured <span className="text-indigo-600">Projects</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-500">
            Explore our latest work and see how we help businesses grow.
          </p>
        </RevealOnScroll>

        {projects.length > 0 ? (
          <StaggerGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
              <StaggerItem key={project.id}>
                <ShowcaseCard
                  title={project.title}
                  description={project.description || "No description available."}
                  imageUrl={project.thumbnail}
                  actionLabel="View Project"
                  href={`/our-projects/${project.id}`}
                  heightClassName="h-[400px]"
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                      <Layers className="h-12 w-12 text-white/40" strokeWidth={1.5} />
                    </div>
                  }
                />
              </StaggerItem>
            ))}
          </StaggerGrid>
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
