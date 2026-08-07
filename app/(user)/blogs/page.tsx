import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Mail, Search, BookOpen } from "lucide-react";
import { getPublicBlogs } from "@/app/actions/blogs";
import { getSection } from "@/app/actions/site-content";
import { isModuleDisabled } from "@/lib/module-visibility";
import { ModuleDisabledPage } from "@/components/content/ModuleDisabledPage";
import { resolveTokensOnServer } from "@/lib/content/resolve-tokens-server";
import { PageHero } from "@/components/content/PageHero";

function dateOf(value?: string | Date | null, fallback?: string | Date | null): Date {
  const candidate = value ?? fallback;
  if (candidate instanceof Date && !isNaN(candidate.getTime())) return candidate;
  const parsed = new Date(candidate ?? Date.now());
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export async function generateMetadata(): Promise<Metadata> {
  // Title is intentionally NOT set here — the browser tab title should stay
  // the site name configured in Settings > General (applied as the default
  // title in app/(user)/layout.tsx). Only the description is derived from the
  // hero content, for SEO/share-preview purposes.
  const heroSection = await getSection("blogs", "blogs.hero");
  const description = heroSection.data.Subheading
    ? await resolveTokensOnServer(heroSection.data.Subheading)
    : undefined;
  return { description };
}

export default async function BlogListingPage() {
  if (await isModuleDisabled("blog")) return <ModuleDisabledPage moduleLabel="Blog" />;
  const [blogs, heroSection] = await Promise.all([
    getPublicBlogs(),
    getSection("blogs", "blogs.hero"),
  ]);

  const featured = blogs[0] ?? null;
  const trending = blogs.slice(1, 3);
  const latest = blogs.slice(0, 4);
  const popular = blogs.slice(0, 3);

  const fallbackImages = ["/blog1.png", "/blog2.png", "/picture1.png", "/webdev.png"];
  const tags = ["React", "TypeScript", "Next.js", "Tailwind", "Node.js", "Design", "AI", "CSS"];
  const collections = [
    { label: "Frontend Development", count: 12, color: "bg-indigo-500" },
    { label: "Backend Development", count: 18, color: "bg-amber-500" },
    { label: "Design & UX", count: 15, color: "bg-emerald-500" },
    { label: "AI & Machine Learning", count: 22, color: "bg-rose-500" },
  ];

  return (
    <div className="bg-white">
      <PageHero data={heroSection.data} />

      {/* ── Main Content: Featured + Trending + Latest WITH Sidebar ── */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-6 flex items-end justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-1.5 rounded-full bg-indigo-600" />
              <div>
                <h2 className="text-2xl font-extrabold text-zinc-900 sm:text-3xl">Featured Article</h2>
                <p className="mt-1 text-sm text-zinc-500">Handpicked insights, trends, and ideas to keep you ahead.</p>
              </div>
            </div>
            <Link href="/blogs/article" className="shrink-0 text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View All Articles <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Two Column Layout: Content + Sidebar */}
          <div className="grid gap-8 lg:grid-cols-[1.9fr_1fr]">
            {/* ── Left Column: All content ───────────────── */}
            <div className="space-y-10">
              {/* Featured Article — full width overlay card */}
              {featured && (
                <Link href={`/blogs/${featured.slug}`} className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <div className="relative aspect-[16/9]">
                    <Image src={featured.thumbnail || fallbackImages[0]} alt={featured.title} fill sizes="100vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="inline-block rounded bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white mb-2">
                        {featured.category || "Featured"}
                      </span>
                      <h3 className="text-xl font-extrabold text-white sm:text-2xl">
                        {featured.title}
                      </h3>
                      {featured.excerpt && (
                        <p className="mt-1.5 text-xs text-white/80 line-clamp-2 max-w-lg">{featured.excerpt}</p>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white/20 flex items-center justify-center">
                            {featured.author?.image ? (
                              <Image src={featured.author.image} alt={featured.author.fullName} fill sizes="32px" className="object-cover" />
                            ) : (
                              <span className="text-xs font-bold text-white">
                                {featured.author?.fullName?.charAt(0) || "A"}
                              </span>
                            )}
                          </div>
                          <div>
                            {featured.author && (
                              <p className="text-[11px] font-semibold text-white leading-tight">{featured.author.fullName}</p>
                            )}
                            <p className="text-[10px] text-white/60 leading-tight">
                              {dateOf(featured.publishedAt, featured.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-white">
                          Read More <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Trending Articles — two white cards side by side */}
              {trending.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  {trending.map((blog, index) => (
                    <Link
                      key={blog.id}
                      href={`/blogs/${blog.slug}`}
                      className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                        <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase text-indigo-600">Trending</span>
                        {blog.readTime && (
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{blog.readTime}</span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                        {blog.title}
                      </h3>
                      <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-lg">
                        <Image src={blog.thumbnail || fallbackImages[(index + 1) % fallbackImages.length]} alt={blog.title} fill sizes="50vw" className="object-cover" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Latest Articles */}
              <div id="articles">
                <div className="mb-5 flex items-end justify-between">
                  <h2 className="text-2xl font-extrabold text-zinc-900 sm:text-3xl">Latest Articles</h2>
                  <Link href="/blogs/article" className="shrink-0 text-sm font-semibold text-indigo-600 flex items-center gap-1">
                    View All Articles <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {latest.length > 0 ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    {latest.map((blog, index) => (
                      <Link
                        key={blog.id}
                        href={`/blogs/${blog.slug}`}
                        className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="relative aspect-[16/10]">
                          <Image src={blog.thumbnail || fallbackImages[index % fallbackImages.length]} alt={blog.title} fill sizes="50vw" className="object-cover" />
                          {blog.category && (
                            <span className="absolute left-3 top-3 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                              {blog.category}
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="mb-1.5 flex items-center gap-3 text-[10px] text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
{(blog.publishedAt || blog.createdAt) && dateOf(blog.publishedAt, blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                            {blog.readTime && (
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{blog.readTime}</span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                            {blog.title}
                          </h3>
                          {blog.excerpt && (
                            <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-500 line-clamp-2">{blog.excerpt}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
                    <p className="text-sm text-zinc-500">No articles published yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right Sidebar (spans full height) ──────── */}
            <aside className="space-y-6">
              {/* Search */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                <h3 className="text-base font-bold text-zinc-900 mb-4">Search Articles</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-9 pr-4 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Popular Articles */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                <h3 className="text-base font-bold text-zinc-900 mb-4">Popular Articles</h3>
                <div className="space-y-4">
                  {popular.map((blog, index) => (
                    <Link key={blog.id} href={`/blogs/${blog.slug}`} className="flex gap-3 group">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                        <Image src={blog.thumbnail || fallbackImages[index % fallbackImages.length]} alt={blog.title} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-zinc-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {blog.title}
                        </p>
                        <p className="mt-1 text-[11px] text-zinc-400">
                          {(blog.publishedAt || blog.createdAt) && dateOf(blog.publishedAt, blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="#" className="mt-4 block text-xs font-semibold text-indigo-600">
                  View All Popular →
                </Link>
              </div>

              {/* Tags */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                <h3 className="text-base font-bold text-zinc-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-md bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href="#" className="mt-4 block text-xs font-semibold text-indigo-600">
                  View All Tags →
                </Link>
              </div>

              {/* Stay Updated */}
              <div id="subscribe" className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100">
                  <Mail className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="text-base font-bold text-zinc-900">Stay Updated</h3>
                <p className="mt-1 text-xs text-zinc-500">Get the latest articles, resources, and insights delivered weekly.</p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="mt-4 w-full rounded-lg border border-zinc-200 bg-white py-2.5 px-3 text-sm placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none"
                />
                <button className="mt-2.5 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition">
                  Subscribe
                </button>
              </div>

              {/* Reading Collections */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                <h3 className="text-base font-bold text-zinc-900 mb-4">Reading Collections</h3>
                <div className="space-y-3">
                  {collections.map((col) => (
                    <div key={col.label} className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className={`flex h-7 w-7 items-center justify-center rounded-md ${col.color} text-white`}>
                          <BookOpen className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-xs font-semibold text-zinc-700">{col.label}</span>
                      </div>
                      <span className="text-[11px] text-zinc-400">{col.count} articles</span>
                    </div>
                  ))}
                </div>
                <Link href="#" className="mt-4 block text-xs font-semibold text-indigo-600">
                  View All Collections →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
