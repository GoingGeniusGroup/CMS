import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight, Mail, Calendar, Clock, BookOpen, Monitor, BarChart3, Users, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const popularArticles = [
  { title: "How AI is Transforming the IT Industry", date: "MAY 12, 2024", image: "/blog2.png" },
  { title: "Top 8 Programming Languages in 2024", date: "MAY 15, 2024", image: "/blog2.png" },
  { title: "Benefits of Cloud Computing for Business", date: "MAY 08, 2024", image: "/blog2.png" },
];

const tags = ["Title", "Title", "Title", "Title", "Title", "Title", "Title", "Title", "Title"];

const collections = [
  { label: "Frontend Development", count: 12, color: "bg-indigo-500" },
  { label: "Backend Development", count: 18, color: "bg-amber-500" },
  { label: "Design & UX", count: 15, color: "bg-emerald-500" },
  { label: "AI & Machine Learning", count: 22, color: "bg-rose-500" },
];

const blogCards = [
  { title: "The Future of Web Development", desc: "Discover the emerging frameworks and tools that are redefining the digital landscape in 2024 and beyond.", date: "July 12, 2024", readTime: "8 min read", tag: "PRODUCT", author: "John Doe", image: "/blog2.png" },
  { title: "The Future of Web Development", desc: "Discover the emerging frameworks and tools that are redefining the digital landscape in 2024 and beyond.", date: "July 12, 2024", readTime: "8 min read", tag: "PRODUCT", author: "John Doe", image: "/blog2.png" },
  { title: "The Future of Web Development", desc: "Discover the emerging frameworks and tools that are redefining the digital landscape in 2024 and beyond.", date: "July 12, 2024", readTime: "8 min read", tag: "PRODUCT", author: "John Doe", image: "/blog2.png" },
  { title: "The Future of Web Development", desc: "Discover the emerging frameworks and tools that are redefining the digital landscape in 2024 and beyond.", date: "July 12, 2024", readTime: "8 min read", tag: "PRODUCT", author: "John Doe", image: "/blog2.png" },
  { title: "The Future of Web Development", desc: "Discover the emerging frameworks and tools that are redefining the digital landscape in 2024 and beyond.", date: "July 12, 2024", readTime: "8 min read", tag: "PRODUCT", author: "John Doe", image: "/blog2.png" },
  { title: "The Future of Web Development", desc: "Discover the emerging frameworks and tools that are redefining the digital landscape in 2024 and beyond.", date: "July 12, 2024", readTime: "8 min read", tag: "PRODUCT", author: "John Doe", image: "/blog2.png" },
];

const benefits = [
  { icon: Monitor, title: "Increased Efficiency", desc: "Automate repetitive tasks and streamline workflows." },
  { icon: BarChart3, title: "Data-Driven Insights", desc: "Make smarter decisions with real-time analytics." },
  { icon: Users, title: "Better Customer Experience", desc: "Personalize interactions and provide 24/7 support." },
  { icon: Shield, title: "Cost Reduction", desc: "Optimize operations and reduce operational costs." },
];

export default function BlogArticlePage() {
  return (
    <div className="bg-[#f7f6f4]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Full-width hero image */}
        <div className="relative aspect-[16/7] overflow-hidden rounded-2xl border border-zinc-200">
          <Image src="/picture1.png" alt="AI Innovation" fill sizes="100vw" className="object-cover" />
        </div>

        {/* Meta row — full width */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
            <span className="font-semibold uppercase text-indigo-600">AI &amp; Innovation</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 10 min read</span>
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> June 22, 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-700">John Doe</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600">JD</span>
            <span className="text-[10px] text-zinc-400">Lead AI Strategist at Going Genius</span>
          </div>
        </div>

        {/* Title — full width */}
        <h1 className="mt-6 text-2xl font-extrabold text-zinc-900 sm:text-3xl">
          How Artificial Intelligence is Transforming Modern Businesses
        </h1>

        {/* Content + Sidebar grid starts here */}
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main content */}
          <article>

            {/* Intro */}
            <p className="mt-4 text-sm leading-relaxed text-zinc-600">
              Artificial Intelligence is no longer a futuristic concept — it is the present reality reshaping industries,
              improving efficiency, and creating new opportunities for businesses of all sizes.
            </p>

            {/* Section 1 */}
            <h2 className="mt-8 text-lg font-bold text-zinc-900">1. The Rise of AI in Business</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              AI technologies are rapidly evolving and becoming more accessible. From machine learning algorithms to natural
              language processing, businesses are leveraging AI to automate tasks, gain insights, and enhance customer
              experiences.
            </p>

            {/* Quote */}
            <blockquote className="mt-6 rounded-lg border-l-4 border-indigo-500 bg-white px-5 py-4 text-sm italic text-zinc-700">
              &ldquo;AI is not just about technology; it&apos;s about solving real problems and creating meaningful impact.&rdquo;
            </blockquote>

            {/* Section 2 */}
            <h2 className="mt-8 text-lg font-bold text-zinc-900">2. Key Benefits of AI</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              Businesses adopting AI are experiencing significant advantages across multiple areas.
            </p>

            {/* Benefits grid */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="rounded-xl border border-zinc-200 bg-white p-5">
                    <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-sm font-bold text-zinc-900">{b.title}</h3>
                    <p className="mt-1 text-xs text-zinc-500">{b.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Section 3 */}
            <h2 className="mt-8 text-lg font-bold text-zinc-900">3. Real-World Applications</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              AI is being used in various industries to solve complex challenges and drive growth.
            </p>

            <div className="mt-5 relative aspect-[16/9] overflow-hidden rounded-xl border border-zinc-200">
              <Image src="/picture1.png" alt="Real world AI applications" fill sizes="100vw" className="object-cover" />
            </div>

            {/* Industry pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              {["Healthcare", "Finance", "Retail", "Manufacturing"].map((ind) => (
                <span key={ind} className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700">
                  {ind}
                </span>
              ))}
            </div>

            {/* Section 4 */}
            <h2 className="mt-8 text-lg font-bold text-zinc-900">4. The Future of AI</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              The future of AI is promising. As technology continues to advance, we can expect even more intelligent systems that
              can understand, learn, and adapt to our needs. Businesses that embrace AI today will be the leaders of tomorrow.
            </p>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-zinc-800">Tags:</span>
              {["Artificial Intelligence", "Machine Learning", "Business", "Automation"].map((t) => (
                <span key={t} className="text-xs text-zinc-500"># {t}</span>
              ))}
            </div>

            {/* Share */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-600">Share this post:</span>
              <a href="#" className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200">
                <FaFacebookF className="h-3 w-3" />
              </a>
              <a href="#" className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-500 hover:bg-sky-200">
                <FaTwitter className="h-3 w-3" />
              </a>
              <a href="#" className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                <FaLinkedinIn className="h-3 w-3" />
              </a>
            </div>
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

            {/* Popular */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-zinc-900">Popular Articles</h3>
              <div className="space-y-4">
                {popularArticles.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      <Image src={a.image} alt={a.title} fill sizes="100vw" className="object-cover" />
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
                  <span key={i} className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">{t}</span>
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
              <input type="email" placeholder="Enter your email" className="mt-3 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400" />
              <button className="mt-2 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Button</button>
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
                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-medium text-zinc-500">{c.count} articles</span>
                  </div>
                ))}
              </div>
              <Link href="#" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline">
                View All Collections <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </aside>
        </div>

        {/* Our Blog section */}
        <div className="mt-16">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-zinc-900">Our Blog</h2>
              <p className="text-sm text-zinc-500">Insights, tips, and updates about technology and business.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input type="search" placeholder="Search articles..." className="rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400" />
              </div>
              <button className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
                All Categories
              </button>
            </div>
          </div>

          {/* Blog grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogCards.map((card, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="relative aspect-[16/10]">
                  <Image src={card.image} alt={card.title} fill sizes="100vw" className="object-cover" />
                  <span className="absolute left-3 top-3 rounded bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">{card.tag}</span>
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{card.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{card.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-900">{card.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500">{card.desc}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">By <span className="font-semibold text-zinc-700">{card.author}</span></span>
                    <Link href="#" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-0.5">
                      Read More <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex items-center justify-center gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-medium text-white">1</button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-sm text-zinc-600 hover:bg-zinc-50">2</button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-sm text-zinc-600 hover:bg-zinc-50">3</button>
            <span className="px-1 text-zinc-400">...</span>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-sm text-zinc-600 hover:bg-zinc-50">6</button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
