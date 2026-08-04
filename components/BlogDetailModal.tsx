"use client";

import { X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogDetailModalProps {
  open: boolean;
  blog: {
    slug: string;
    title: string;
    excerpt: string | null;
    category: string | null;
    thumbnail: string | null;
    readTime: string | null;
  } | null;
  onClose: () => void;
}

export function BlogDetailModal({ open, blog, onClose }: BlogDetailModalProps) {
  if (!open || !blog) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-zinc-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-zinc-900"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto rounded-t-2xl">
          {blog.thumbnail && (
            <div className="relative h-56 w-full overflow-hidden rounded-t-2xl">
              <Image
                src={blog.thumbnail}
                alt={blog.title}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              {blog.category && (
                <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                  {blog.category}
                </span>
              )}
              {blog.readTime && (
                <span className="text-xs text-zinc-400">{blog.readTime}</span>
              )}
            </div>

            <h2 className="mt-3 text-xl font-extrabold text-zinc-900 sm:text-2xl">
              {blog.title}
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-zinc-600 whitespace-pre-line">
              {blog.excerpt || "No additional details available."}
            </p>
          </div>
        </div>

        {/* Sticky CTA footer */}
        <div className="flex-shrink-0 rounded-b-2xl border-t border-zinc-100 bg-white px-6 py-4">
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/blogs/${blog.slug}`}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Read Article
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/blogs"
              className="flex-1 inline-flex items-center justify-center rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-indigo-400 hover:text-indigo-600"
            >
              All Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
