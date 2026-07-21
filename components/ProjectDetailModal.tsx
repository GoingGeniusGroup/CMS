"use client";

import { X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProjectDetailModalProps {
  open: boolean;
  project: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    thumbnail: string | null;
  } | null;
  onClose: () => void;
}

export function ProjectDetailModal({ open, project, onClose }: ProjectDetailModalProps) {
  if (!open || !project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-0 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-zinc-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-zinc-900"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {project.thumbnail && (
          <div className="relative h-56 w-full overflow-hidden rounded-t-2xl">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover"
            />
          </div>
        )}

        <div className="p-6 sm:p-8">
          {project.category && (
            <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              {project.category}
            </span>
          )}

          <h2 className="mt-3 text-xl font-extrabold text-zinc-900 sm:text-2xl">
            {project.title}
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-zinc-600 whitespace-pre-line">
            {project.description || "No additional details available for this project."}
          </p>

          <div className="mt-6">
            <Link
              href={`/our-projects/${project.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              View Case Study
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
