"use client";

import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { Pagination } from "@/components/Pagination";
import { Filter, Plus, Search, Eye, Pencil, Trash2, ChevronDown, Newspaper } from "lucide-react";

import { useState } from "react";

const stats = [
  { label: "Total Blogs", value: 18, icon: Newspaper },
  { label: "Published", value: 15, icon: Newspaper },
  { label: "Draft", value: 3, icon: Newspaper },
];

const blogs = [
  { id: "1", title: "Top 10 Web Design Trends", slug: "top-10-web-design-trends", status: "Published", },
  { id: "2", title: "How to Improve SEO Ranking", slug: "how-to-improve-seo-ranking", status: "Published", },
  { id: "3", title: "Benefits of Digital Marketing", slug: "benefits-of-digital-marketing", status: "Published", },
  { id: "4", title: "Choosing the Right UI/UX", slug: "choosing-the-right-ui-ux", status: "Draft", },
  { id: "5", title: "Why Content Writing Matters", slug: "why-content-writing-matters", status: "Draft", },
]

export default function BlogPage() { 

const [showAddBlogModal, setShowAddBlogModal] = useState(false);

const [title, setTitle] = useState("");
const [content, setContent] = useState("");
const [slug, setSlug] = useState("");
const [status, setStatus] = useState("");
const [internalUse, setInternalUse] = useState(true);
const [dropdownOpen, setDropdownOpen] = useState(false);

const statusOptions = ["published", "draft", "pending"];

return (
  <>
    <div className="space-y-5 sm:space-y-6">
    <Topbar />

    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
      <PageHeader title="Blog" description="Manage all your blogs." />

      {/* Right: Filter + Add Blog buttons */}
      <div className="flex items-center gap-3">
        <Button variant="secondary">
          <Filter className="h-4 w-4" />
          Filter
        </Button>

        <Button onClick={() => setShowAddBlogModal(true)}>
          Add Blog
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
    {/* Stat Cards */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
    {/* Blogs Search */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-lg font-bold text-black">Blogs</h2>
      <div className="relative w-full sm:w-72">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="search"
          placeholder="Search Blogs...."
          className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-700 shadow-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-200"
        />
      </div>
    </div>
    {/* Blogs Table */}
    <Card noPadding className="overflow-hidden">
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
    </Card>

    {/* Pagination */}
    <Pagination page={1} pageCount={3} rangeLabel="Showing 1 to 5 of 10 entries" />
    </div>
    {/* Add Blog Modal */}

   {showAddBlogModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-2xl shadow-md p-6 w-[420px]">

      {/* Heading */}
      <h2 className="text-lg font-bold text-gray-900 mb-5">
        Add Blog
      </h2>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Title <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          placeholder="Enter Services title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Content */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Content <span className="text-red-500">*</span>
        </label>

        <textarea
          rows={4}
          placeholder="Enter short details"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Slug */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Slug
        </label>

        <textarea
          rows={4}
          placeholder="Write description here..."
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
    

      {/* Status */}
      <div className="mb-5 relative">
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Status
        </label>

        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex justify-between items-center px-4 py-2.5 border border-gray-300 rounded-xl"
        >
          <span className={status ? "capitalize" : "text-gray-400"}>
            {status || "Select Status"}
          </span>

          <ChevronDown size={18} />
        </button>

        {dropdownOpen && (
          <ul className="absolute z-10 mt-1 w-full bg-white border rounded-xl shadow-lg">
            {statusOptions.map((option) => (
              <li
                key={option}
                onClick={() => {
                  setStatus(option);
                  setDropdownOpen(false);
                }}
                className="px-4 py-2 hover:bg-indigo-50 cursor-pointer capitalize"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>

     {/* Toggle */}
<div className="mb-6">
  <div className="flex items-center justify-between">
    <span className="text-sm font-semibold text-gray-800">
      Internal use only
    </span>

    <button
      type="button"
      onClick={() => setInternalUse(!internalUse)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
        internalUse ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 -translate-y-1/2 ${
          internalUse ? "right-1" : "left-1"
        }`}
      />
    </button>
  </div>
  
</div>
        <p className="text-xs text-gray-400 mt-1">
          Enable this if this blog is for internal use only.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">

        <Button
          variant="secondary"
          onClick={() => setShowAddBlogModal(false)}
          className="px-5 py-2"
        >
          Cancel
        </Button>

        <Button
          onClick={() => {
            console.log({
              title,
              content,
              slug,
              status,
              internalUse,
            });

            setShowAddBlogModal(false);
          }}
          className="px-5 py-2"
        >
          Add Blog
        </Button>

      </div>

    </div>
  </div>
)}
</>
  
);
};
