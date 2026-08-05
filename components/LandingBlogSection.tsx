"use client";

import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { getPublicBlogs } from "@/app/actions/blogs";
import { BlogDetailModal } from "@/components/BlogDetailModal";
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
  const [selectedBlog, setSelectedBlog] = useState<BlogData | null>(null);
  const header = headerData ?? SECTION_REGISTRY["home.blog"].defaultData;

  useEffect(() => {
    if (!initialBlogs) {
      getPublicBlogs().then((data) => setBlogs(JSON.parse(JSON.stringify(data))));
    }
  }, [initialBlogs]);

  if (moduleHidden || blogs.length === 0) return null;

  return (
    <>
      <section id="insights" className="bg-[#f6f4f3] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader className="mb-12" data={header} />

          <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {blogs.slice(0, 4).map((blog) => (
              <StaggerItem key={blog.id}>
                <ShowcaseCard
                  title={blog.title}
                  description={blog.excerpt || "No description available."}
                  imageUrl={blog.thumbnail}
                  actionLabel="Read More"
                  onClick={() => setSelectedBlog(blog)}
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

      <BlogDetailModal
        open={!!selectedBlog}
        blog={
          selectedBlog
            ? {
                slug: selectedBlog.slug,
                title: selectedBlog.title,
                excerpt: selectedBlog.excerpt,
                category: selectedBlog.category,
                thumbnail: selectedBlog.thumbnail,
                readTime: selectedBlog.readTime,
              }
            : null
        }
        onClose={() => setSelectedBlog(null)}
      />
    </>
  );
}
