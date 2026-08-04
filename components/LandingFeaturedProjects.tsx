"use client";

import { useState, useEffect } from "react";
import { Layers } from "lucide-react";
import { getPublicProjects } from "@/app/actions/projects";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { ShowcaseCard } from "@/components/ShowcaseCard";
import { SectionHeader, SectionCta } from "@/components/content/SectionHeader";
import { SECTION_REGISTRY, type SectionHeaderData } from "@/lib/content/schemas";

type ProjectData = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  thumbnail: string | null;
  budget: number | null;
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
  const [projects, setProjects] = useState<ProjectData[]>(initialProjects ?? []);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const header = headerData ?? SECTION_REGISTRY["home.projects"].defaultData;

  useEffect(() => {
    if (!initialProjects) {
      getPublicProjects().then((data) =>
        setProjects(JSON.parse(JSON.stringify(data)))
      );
    }
  }, [initialProjects]);

  if (projects.length === 0) return null;

  return (
    <>
      <section id="portfolio" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader className="mb-12" data={header} />

          <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {projects.slice(0, 4).map((project) => (
              <StaggerItem key={project.id}>
                <ShowcaseCard
                  title={project.title}
                  description={project.description || "No description available."}
                  imageUrl={project.thumbnail}
                  actionLabel="View Case Study"
                  onClick={() => setSelectedProject(project)}
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

      <ProjectDetailModal
        open={!!selectedProject}
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
