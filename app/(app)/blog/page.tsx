import { PageHeader } from "@/components/PageHeader";
import { Filter, Plus, Search, Eye, Pencil, Trash2, } from "lucide-react";
import { FaMale, FaFemale } from "react-icons/fa";

const stats = [
  { label: "Total Blogs", value: 18, icon: Filter },
  { label: "Published", value: 15, icon: Filter },
  { label: "Draft ", value: 3, icon: Filter },

];

const blogs = [
  { id: "1", title: "Top 10 Web Design Trends", slug: "top-10-web-design-trends", status: "Published", },
  { id: "2", title: "How to Improve SEO Ranking", slug: "how-to-improve-seo-ranking", status: "Published", },
  { id: "3", title: "Benefits of Digital Marketing", slug: "benefits-of-digital-marketing", status: "Published", },
  { id: "4", title: "Choosing the Right UI/UX", slug: "choosing-the-right-ui-ux", status: "Draft", },
  { id: "5", title: "Why Content Writing Matters", slug: "why-content-writing-matters", status: "Draft", },
]

export default function BlogPage() {
  return (
    <>

      <div className="flex items-center justify-between px-9 py-15 ">
        {/* Left: Title + Subtitle */}
        <div>
          <h1 className="text-xl font-bold text-black-900 leading-tight">Blog</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage all your services</p>
        </div>

        {/* Right: Filter + Add Blog buttons */}
        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={16} strokeWidth={1.8} />
            Filter
          </button>

          {/* Add Blog Button */}
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
            Add Blog
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 py-6">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-8 shadow-[0_6px_24px_rgba(0,0,0,0.25)]">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
              <Icon className="h-7 w-7" strokeWidth={1.5} />
            </span>
            <div>
              <div className="text-2xl font-semibold tracking-tight">{value}</div>
              <div className="text-sm text-zinc-500">{label}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Blogs Search */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 py-6">
        <h2 className="text-xl font-semibold tracking-tight">Blogs</h2>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            placeholder="Search Blogs...."
            className="w-100 rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-700 shadow-sm outline-none placeholder:text-zinc-400"
          />
        </div>
      </div>
      {/* Blogs Table */}
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] ">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="text-zinc-500">
                <th className="px-6 py-4 font-medium">#</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((b, i) => (
                <tr key={i} className="border-t border-black/5">
                  <td className="px-6 py-4 text-zinc-600">{b.id}</td>
                  <td className="px-6 py-4 text-zinc-600">{b.title}</td>
                  <td className="px-6 py-4 text-zinc-600">{b.slug}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center justify-center min-w-[90px] px-3 py-1 rounded-full text-xs font-medium ${b.status?.trim().toLowerCase() === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-zinc-500">
                      <Eye className="h-4 w-4" />
                      <Pencil className="h-4 w-4" />
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between" py-3>
        <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
          Showing 1 to 5 of 10 entries
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-sm font-medium text-white"
          >
            1
          </button>
          {[2, 3].map((page) => (
            <button
              key={page}
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-zinc-600 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/5"
            >
              {page}
            </button>
          ))}
          <span className="px-1 text-zinc-400">...</span>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-zinc-600 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/5"
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      </div>
    

    </>
  );
}
