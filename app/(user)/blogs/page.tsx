import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight, Mail, Calendar, Clock, BookOpen } from "lucide-react";

const featured = {
  title: "The Future of Web Development: Trends to Watch in 2024",
  desc: "Discover the latest web development trends, tools, and technologies that are shaping the future of digital experiences from Web3 to AI-powered interfaces.",
  date: "May 15, 2024",
  readTime: "8 min read",
  author: { name: "John Doe", role: "Web Development Expert" },
  image: "/blog1.png",
};

const popularArticles = [
  { title: "How AI is Transforming the IT Industry", date: "MAY 12, 2023", image: "/blog2.png" },
  { title: "Top 8 Programming Languages in 2024", date: "MAY 10, 2024", image: "/blog2.png" },
  { title: "Benefits of Cloud Computing for Business", date: "MAY 08, 2024", image: "/blog2.png" },
];

const tags = ["Title", "Title", "Title", "Title", "Title", "Title", "Title", "Title", "Title", "Title", "Title"];

const collections = [
  { label: "Frontend Development", count: 12, color: "bg-indigo-500" },
  { label: "Backend Development", count: 18, color: "bg-amber-500" },
  { label: "Design & UX", count: 15, color: "bg-emerald-500" },
  { label: "AI & Machine Learning", count: 22, color: "bg-rose-500" },
];

const articles = [
  { title: "10 Best Practices for Clean & Maintainable Code", desc: "Learn how to write code that scales and is easy for other developers to understand...", date: "May 14, 2024", readTime: "5 min read", tag: "TITLE", image: "/blog2.png" },
  { title: "10 Best Practices for Clean & Maintainable Code", desc: "Learn how to write code that scales and is easy for other developers to understand...", date: "May 13, 2024", readTime: "6 min read", tag: "TITLE", image: "/blog2.png" },
  { title: "10 Best Practices for Clean & Maintainable Code", desc: "Learn how to write code that scales and is easy for other developers to understand...", date: "May 14, 2024", readTime: "7 min read", tag: "TITLE", image: "/blog2.png" },
  { title: "10 Best Practices for Clean & Maintainable Code", desc: "Learn how to write code that scales and is easy for other developers to understand...", date: "May 14, 2024", readTime: "8 min read", tag: "TITLE", image: "/blog2.png" },
];

const featuredSmall = [
  { title: "Title", tag: "Title", readTime: "7 min read", image: "/blog2.png" },
  { title: "Title", tag: "Title", readTime: "7 min read", image: "/blog2.png" },
];

export default function BlogPage() {
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
                <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400">
                  <Mail className="h-4 w-4" /> Subscribe
                </button>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src="/blog1.png" alt="Web Development" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article + Sidebar */}
      <section id="articles" className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Featured heading */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-indigo-600" />
              <div>
                <h2 className="text-2xl font-extrabold text-zinc-900">Featured Article</h2>
                <p className="text-sm text-zinc-500">Handpicked insights, trends, and ideas to keep you ahead.</p>
              </div>
            </div>
            <Link href="#" className="hidden text-sm font-semibold text-indigo-600 hover:underline sm:inline-flex sm:items-center sm:gap-1">
              View All Articles <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Left content */}
            <div className="space-y-6">
              {/* Featured card */}
              <div className="relative overflow-hidden rounded-2xl">
                <div className="relative aspect-[16/7]">
                  <Image src={featured.image} alt={featured.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <span className="mb-2 inline-block rounded bg-indigo-600 px-2.5 py-0.5 text-[11px] font-bold uppercase">Featured</span>
                    <p className="mb-1 text-xs opacity-80">{featured.date} • {featured.readTime}</p>
                    <h3 className="text-lg font-bold leading-snug sm:text-xl">{featured.title}</h3>
                    <p className="mt-2 max-w-lg text-xs leading-relaxed opacity-80">{featured.desc}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">JD</span>
                        <div>
                          <p className="text-xs font-semibold">{featured.author.name}</p>
                          <p className="text-[10px] text-indigo-200">{featured.author.role}</p>
                        </div>
                      </div>
                      <Link href="#" className="text-xs font-semibold text-white hover:underline flex items-center gap-1">
                        Read More <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two small featured cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {featuredSmall.map((item, i) => (
                  <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded bg-indigo-100 px-2.5 py-0.5 text-[11px] font-bold text-indigo-600">{item.tag}</span>
                      <span className="text-xs text-zinc-400">{item.readTime}</span>
                    </div>
                    <h3 className="mb-3 text-base font-bold text-zinc-900">{item.title}</h3>
                    <div className="relative h-24 overflow-hidden rounded-lg">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Latest Articles */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-zinc-900">Latest Articles</h2>
                  <Link href="#" className="text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                    View All Articles <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {articles.map((a, i) => (
                    <div key={i} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                      <div className="relative aspect-[16/10]">
                        <Image src={a.image} alt={a.title} fill className="object-cover" />
                        <span className="absolute left-3 top-3 rounded bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">{a.tag}</span>
                      </div>
                      <div className="p-4">
                        <div className="mb-2 flex items-center gap-3 text-xs text-zinc-400">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{a.date}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{a.readTime}</span>
                        </div>
                        <h3 className="text-sm font-bold text-zinc-900">{a.title}</h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{a.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <aside className="space-y-6">
              {/* Search */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-zinc-900">Search Articles</h3>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="search"
                    placeholder="Search articles..."
                    className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400"
                  />
                </div>
              </div>

              {/* Popular */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-zinc-900">Popular Articles</h3>
                <div className="space-y-4">
                  {popularArticles.map((a, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                        <Image src={a.image} alt={a.title} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-800 leading-snug">{a.title}</p>
                        <p className="mt-0.5 text-[10px] text-zinc-400">{a.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="#" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline">
                  View All Popular <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Tags */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-zinc-900">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t, i) => (
                    <span key={i} className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                      {t}
                    </span>
                  ))}
                </div>
                <Link href="#" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline">
                  View All Tags <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Stay Updated */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm text-center">
                <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                  <Mail className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-bold text-zinc-900">Stay Updated</h3>
                <p className="mt-1 text-xs text-zinc-500">Get the latest articles, resources, and insights delivered weekly.</p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="mt-3 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400"
                />
                <button className="mt-2 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
                  Subscribe Now
                </button>
              </div>

              {/* Reading Collections */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-zinc-900">Reading Collections</h3>
                <div className="space-y-2.5">
                  {collections.map((c) => (
                    <div key={c.label} className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className={`flex h-6 w-6 items-center justify-center rounded ${c.color} text-white`}>
                          <BookOpen className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-xs font-medium text-zinc-700">{c.label}</span>
                      </div>
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-medium text-zinc-500">
                        {c.count} articles
                      </span>
                    </div>
                  ))}
                </div>
                <Link href="#" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline">
                  View All Collections <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
