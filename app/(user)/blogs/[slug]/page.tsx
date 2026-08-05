import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock, Mail, Search } from "lucide-react";
import { getPublicBlogBySlug, getPublicBlogs } from "@/app/actions/blogs";
import { TiptapRenderer } from "@/components/TiptapRenderer";
import type { JSONContent } from "@tiptap/react";
import { isModuleDisabled } from "@/lib/module-visibility";
import { ModuleDisabledPage } from "@/components/content/ModuleDisabledPage";

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (await isModuleDisabled("blog")) return <ModuleDisabledPage moduleLabel="Blog" />;
  const { slug } = await params;
  const blog = await getPublicBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Get other published blogs for "Popular Articles" sidebar
  const allBlogs = await getPublicBlogs();
  const otherBlogs = allBlogs.filter((b) => b.slug !== slug).slice(0, 3);

  const publishDate = blog.publishedAt || blog.createdAt;

  return (
    <div className="bg-[#f7f6f4]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/blogs"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Full-width hero image */}
        {blog.thumbnail && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-200">
            <Image src={blog.thumbnail} alt={blog.title} fill sizes="100vw" className="object-cover" priority />
          </div>
        )}

        {/* Meta row */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
            {blog.category && (
              <span className="font-semibold uppercase text-indigo-600">{blog.category}</span>
            )}
            {blog.readTime && (
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {blog.readTime}</span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {publishDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          {blog.author && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-700">{blog.author.fullName}</span>
              {blog.author.image ? (
                <Image src={blog.author.image} alt={blog.author.fullName} width={28} height={28} className="h-7 w-7 rounded-full object-cover" />
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600">
                  {blog.author.fullName.charAt(0)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="mt-6 text-2xl font-extrabold text-zinc-900 sm:text-3xl">
          {blog.title}
        </h1>

        {/* Content + Sidebar */}
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main content */}
          <article>
            {blog.content ? (
              <TiptapRenderer content={blog.content as JSONContent} />
            ) : (
              <p className="text-sm text-zinc-500 italic">No content available.</p>
            )}

            {/* Tags at bottom of article */}
            {blog.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-zinc-800">Tags:</span>
                {blog.tags.map((t) => (
                  <span key={t} className="text-xs text-zinc-500"># {t}</span>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Search */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-zinc-900">Search Articles</h3>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input type="search" placeholder="Search articles..." className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400" />
              </div>
            </div>

            {/* Popular Articles */}
            {otherBlogs.length > 0 && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-zinc-900">Popular Articles</h3>
                <div className="space-y-4">
                  {otherBlogs.map((a) => (
                    <Link key={a.id} href={`/blogs/${a.slug}`} className="flex items-start gap-3 group">
                      {a.thumbnail && (
                        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                          <Image src={a.thumbnail} alt={a.title} fill sizes="80px" className="object-cover object-center" />
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-zinc-800 leading-snug group-hover:text-indigo-600 transition-colors">{a.title}</p>
                        <p className="mt-0.5 text-[10px] text-zinc-400">
                          {(a.publishedAt || a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="/blogs" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline">
                  View All Articles <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}

            {/* Tags — only this blog's tags */}
            {blog.tags.length > 0 && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-zinc-900">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((t) => (
                    <span key={t} className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stay Updated */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm text-center">
              <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                <Mail className="h-5 w-5" />
              </span>
              <h3 className="text-sm font-bold text-zinc-900">Stay Updated</h3>
              <p className="mt-1 text-xs text-zinc-500">Get the latest articles and insights delivered weekly.</p>
              <input type="email" placeholder="Enter your email" className="mt-3 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400" />
              <button className="mt-2 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Subscribe</button>
            </div>
          </aside>
        </div>

        {/* Related Blog Cards */}
        {otherBlogs.length > 0 && (
          <div className="mt-16">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-zinc-900">Related Articles</h2>
              <p className="text-sm text-zinc-500">More insights and articles you might enjoy.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherBlogs.map((card) => (
                <div key={card.id} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                  {card.thumbnail && (
                    <div className="relative aspect-[16/10]">
                      <Image src={card.thumbnail} alt={card.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover object-center" />
                      {card.category && (
                        <span className="absolute left-3 top-3 rounded bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">{card.category}</span>
                      )}
                    </div>
                  )}
                  <div className="p-5">
                    <div className="mb-2 flex items-center gap-3 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {(card.publishedAt || card.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      {card.readTime && (
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{card.readTime}</span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-zinc-900">{card.title}</h3>
                    {card.excerpt && (
                      <p className="mt-2 text-xs leading-relaxed text-zinc-500 line-clamp-2">{card.excerpt}</p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      {card.author && (
                        <span className="text-xs text-zinc-500">By <span className="font-semibold text-zinc-700">{card.author.fullName}</span></span>
                      )}
                      <Link href={`/blogs/${card.slug}`} className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-0.5">
                        Read More <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
