"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, BookOpen } from "lucide-react";
import { getPublicBlogs } from "@/app/actions/blogs";
import { BlogDetailModal } from "@/components/BlogDetailModal";

type BlogData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  thumbnail: string | null;
  readTime: string | null;
  publishedAt: Date | null;
  createdAt: Date;
};

export function LandingBlogSection({ initialBlogs }: { initialBlogs?: BlogData[] }) {
  const [blogs, setBlogs] = useState<BlogData[]>(initialBlogs ?? []);
  const [selectedBlog, setSelectedBlog] = useState<BlogData | null>(null);
  const [flippedIds, setFlippedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!initialBlogs) {
      getPublicBlogs().then((data) =>
        setBlogs(JSON.parse(JSON.stringify(data)))
      );
    }
  }, []);

  const toggleFlip = (id: string) => {
    setFlippedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (blogs.length === 0) return null;

  return (
    <>
      <section id="insights" className="bg-[#f6f4f3] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-600">
              Insights
            </p>
            <h2 className="text-2xl font-extrabold text-zinc-900 sm:text-3xl">
              Industry Perspectives
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-500">
              Stay ahead with the latest trends, tips, and insights.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {blogs.slice(0, 4).map((blog) => {
              const isFlipped = flippedIds.has(blog.id);
              return (
                <div
                  key={blog.id}
                  className="group perspective-[1000px] sm:h-[340px]"
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] sm:group-hover:[transform:rotateY(180deg)] ${
                      isFlipped ? "[transform:rotateY(180deg)]" : ""
                    }`}
                  >
                    {/* Front */}
                    <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col overflow-hidden">
                      {blog.thumbnail ? (
                        <div className="mb-4 aspect-square w-full overflow-hidden rounded-xl relative bg-zinc-50 border border-zinc-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={blog.thumbnail}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="mb-4 flex aspect-square w-full items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100">
                          <BookOpen className="h-10 w-10 text-indigo-300" strokeWidth={1.5} />
                        </div>
                      )}
                      <h3 className="text-base font-bold text-zinc-900 text-center">
                        {blog.title}
                      </h3>
                      <div className="mt-auto flex pt-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFlip(blog.id);
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

                    {/* Back */}
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center gap-4">
                      <h3 className="text-base font-bold text-zinc-900 text-center">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-zinc-500 text-center line-clamp-3">
                        {blog.excerpt || "No description available."}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBlog(blog);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/blogs"
              className="inline-flex items-center rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-indigo-400 hover:text-indigo-600"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      <BlogDetailModal
        open={!!selectedBlog}
        blog={selectedBlog ? {
          slug: selectedBlog.slug,
          title: selectedBlog.title,
          excerpt: selectedBlog.excerpt,
          category: selectedBlog.category,
          thumbnail: selectedBlog.thumbnail,
          readTime: selectedBlog.readTime,
        } : null}
        onClose={() => setSelectedBlog(null)}
      />
    </>
  );
}
