import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Mail } from "lucide-react";
import { getPublicBlogs } from "@/app/actions/blogs";

export default async function BlogListingPage() {
  const blogs = await getPublicBlogs();

  const featured = blogs[0] ?? null;
  const rest = blogs.slice(1);

  return (
    <div className="bg-[#f7f6f4]">
      {/* Hero */}
      <section className="px-4 pt-14 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-zinc-200 bg-white p-8 sm:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h1 className="text-3xl font-extrabold leading-tight text-zinc-900 sm:text-4xl">
                Stay Ahead with
                <br />
                Insights That
                <br />
                Drive Innovation
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-500">
                Explore in-depth articles, tutorials, case studies, and industry
                trends to help you build better products and grow your business.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#articles"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                >
                  Browse Articles <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src="/blog1.png" alt="Blog" fill sizes="100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <section className="px-4 pb-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-indigo-600" />
              <div>
                <h2 className="text-2xl font-extrabold text-zinc-900">Featured Article</h2>
                <p className="text-sm text-zinc-500">Handpicked insights to keep you ahead.</p>
              </div>
            </div>

            <Link href={`/blogs/${featured.slug}`} className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md">
              <div className="grid lg:grid-cols-2">
                {featured.thumbnail && (
                  <div className="relative aspect-[16/10] lg:aspect-auto">
                    <Image src={featured.thumbnail} alt={featured.title} fill sizes="100vw" className="object-cover" />
                  </div>
                )}
                <div className="flex flex-col justify-center p-6 sm:p-8">
                  <div className="flex items-center gap-3 text-xs text-zinc-500 mb-3">
                    {featured.category && (
                      <span className="font-semibold uppercase text-indigo-600">{featured.category}</span>
                    )}
                    {featured.readTime && (
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{featured.readTime}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-extrabold text-zinc-900 group-hover:text-indigo-600 transition-colors sm:text-2xl">
                    {featured.title}
                  </h3>
                  {featured.excerpt && (
                    <p className="mt-3 text-sm leading-relaxed text-zinc-500 line-clamp-3">{featured.excerpt}</p>
                  )}
                  <div className="mt-4 flex items-center gap-3">
                    {featured.author && (
                      <span className="text-xs text-zinc-500">By <span className="font-semibold text-zinc-700">{featured.author.fullName}</span></span>
                    )}
                    <span className="text-xs text-zinc-400">
                      {(featured.publishedAt || featured.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* All Articles */}
      <section id="articles" className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-zinc-900">All Articles</h2>
          </div>

          {rest.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((blog) => (
                <div key={blog.id} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                  {blog.thumbnail && (
                    <div className="relative aspect-[16/10]">
                      <Image src={blog.thumbnail} alt={blog.title} fill sizes="100vw" className="object-cover" />
                      {blog.category && (
                        <span className="absolute left-3 top-3 rounded bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">
                          {blog.category}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-5">
                    <div className="mb-2 flex items-center gap-3 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      {blog.readTime && (
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{blog.readTime}</span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-zinc-900">{blog.title}</h3>
                    {blog.excerpt && (
                      <p className="mt-2 text-xs leading-relaxed text-zinc-500 line-clamp-2">{blog.excerpt}</p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      {blog.author && (
                        <span className="text-xs text-zinc-500">By <span className="font-semibold text-zinc-700">{blog.author.fullName}</span></span>
                      )}
                      <Link href={`/blogs/${blog.slug}`} className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-0.5">
                        Read More <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
              <p className="text-sm text-zinc-500">No articles published yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
