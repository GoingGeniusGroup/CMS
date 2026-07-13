"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublicProjects } from "@/app/actions/projects";

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

export function LandingFeaturedProjects() {
  const [projects, setProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    getPublicProjects().then((data) =>
      setProjects(JSON.parse(JSON.stringify(data)))
    );
  }, []);

  if (projects.length === 0) return null;

  const featured = projects.slice(0, 4);

  return (
    <section id="portfolio" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Featured Works
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-zinc-900">
              Recent Success Stories
            </h2>
          </div>
          <Link
            href="/our-projects"
            className="text-sm font-semibold text-indigo-600 hover:underline"
          >
            View All Projects
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {featured.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              {/* Thumbnail */}
              {project.thumbnail ? (
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-zinc-50">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-purple-100">
                  <span className="text-4xl font-extrabold text-indigo-200">
                    {project.title.charAt(0)}
                  </span>
                </div>
              )}

              {/* Content */}
              <h3 className="mt-5 text-base font-bold text-zinc-900">
                {project.title}
              </h3>
              {project.description && (
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 line-clamp-2">
                  {project.description}
                </p>
              )}

              <Link
                href="/our-projects"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:gap-2.5 transition-all"
              >
                View Project
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
