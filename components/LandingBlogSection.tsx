"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { getPublicBlogs } from "@/app/actions/blogs";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { ShowcaseCard } from "@/components/ShowcaseCard";
import { SectionHeader, SectionCta } from "@/components/content/SectionHeader";
import { SECTION_REGISTRY, type SectionHeaderData } from "@/lib/content/schemas";
import { useModuleDisabled } from "@/components/content/PublicModuleVisibilityProvider";

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

export function LandingBlogSection({
  initialBlogs,
  headerData,
}: {
  initialBlogs?: BlogData[];
  headerData?: SectionHeaderData;
}) {
  const moduleHidden = useModuleDisabled("blog");
  const [blogs, setBlogs] = useState<BlogData[]>(initialBlogs ?? []);
  const header = headerData ?? SECTION_REGISTRY["home.blog"].defaultData;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  const checkOverflow = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScroll(el.scrollWidth > el.clientWidth);
  }, []);

  useEffect(() => {
    if (!initialBlogs) {
      getPublicBlogs().then((data) => setBlogs(JSON.parse(JSON.stringify(data))));
    }
  }, [initialBlogs]);

  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [checkOverflow, blogs]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  if (moduleHidden || blogs.length === 0) return null;

  return (
    <>
      <section id="insights" className="bg-[#f6f4f3] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader className="mb-6" data={header} />

          {canScroll && (
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
          )}

          <StaggerGrid
            ref={scrollRef}
            className={canScroll ? "flex gap-5 overflow-x-auto pb-4" : "flex flex-wrap gap-5 pb-4"}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            stagger={0.06}
          >
            {blogs.map((blog) => (
              <StaggerItem key={blog.id} className="min-w-[260px] max-w-[260px] flex-shrink-0">
                <ShowcaseCard
                  title={blog.title}
                  description={blog.excerpt || "No description available."}
                  imageUrl={blog.thumbnail}
                  actionLabel="Read More"
                  href={`/blogs/${blog.slug}`}
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                      <BookOpen className="h-12 w-12 text-white/40" strokeWidth={1.5} />
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
