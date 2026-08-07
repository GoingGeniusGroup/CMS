"use client";

import { useState, useEffect, useRef } from "react";
import { Layers, ChevronLeft, ChevronRight } from "lucide-react";
import { getPublicProjects } from "@/app/actions/projects";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { ShowcaseCard } from "@/components/ShowcaseCard";
import { SectionHeader, SectionCta } from "@/components/content/SectionHeader";
import { SECTION_REGISTRY, type SectionHeaderData } from "@/lib/content/schemas";
import { useModuleDisabled } from "@/components/content/PublicModuleVisibilityProvider";

type ProjectData = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  thumbnail: string | null;
  budget: number | null;
  liveUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
};

export function LandingFeaturedProjects({
  initialProjects,
  headerData,
}: {
  initialProjects?: ProjectData[];
  headerData?: SectionHeaderData;
}) {
  const moduleHidden = useModuleDisabled("project");
  const [projects, setProjects] = useState<ProjectData[]>(initialProjects ?? []);
  const header = headerData ?? SECTION_REGISTRY["home.projects"].defaultData;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialProjects) {
      getPublicProjects().then((data) =>
        setProjects(JSON.parse(JSON.stringify(data)))
      );
    }
  }, [initialProjects]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  if (moduleHidden || projects.length === 0) return null;

  return (
    <>
      <section id="portfolio" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader className="mb-6" data={header} />

          <div className="mb-4 flex items-center justify-end gap-2">
            <button
              onClick={() => scroll("left")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition hover:border-indigo-600 hover:text-indigo-600"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition hover:border-indigo-600 hover:text-indigo-600"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <StaggerGrid
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            stagger={0.06}
          >
            {projects.map((project) => (
              <StaggerItem key={project.id} className="min-w-[260px] max-w-[260px] flex-shrink-0">
                <ShowcaseCard
                  title={project.title}
                  description={project.description || "No description available."}
                  imageUrl={project.thumbnail}
                  actionLabel="View Case Study"
                  href={`/our-projects/${project.id}`}
                  secondaryActionLabel={project.liveUrl ? "View Live Demo" : undefined}
                  secondaryHref={project.liveUrl || undefined}
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                      <Layers className="h-12 w-12 text-white/40" strokeWidth={1.5} />
                    </div>
                  }
                />
              </StaggerItem>
            ))}
          </StaggerGrid>

          <SectionCta data={header} />
        </div>
      </section>
    </>
  );
}
