"use client";

import { useState } from "react";
import { Tag, CheckCircle2, XCircle, Filter, Plus, Search, List, LayoutGrid } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { Pagination } from "@/components/Pagination";
import { RowActions } from "@/components/RowActions";
import { AddCategoryModal } from "@/components/AddCategoryModal";

type Category = {
  id: number;
  name: string;
  parent: string;
  slug: string;
  pages: number;
  status: "Active" | "Draft" | "Inactive";
  updated: string;
};

const SAMPLE: Category[] = [
  { id: 1, name: "Web Design",      parent: "Services",  slug: "web-design",      pages: 8,  status: "Active",   updated: "1 June, 2026" },
  { id: 2, name: "Development",     parent: "Services",  slug: "development",     pages: 12, status: "Active",   updated: "2 Jul, 2025" },
  { id: 3, name: "UI/UX",           parent: "Services",  slug: "ui-ux",           pages: 5,  status: "Active",   updated: "2 Apr, 2024" },
  { id: 4, name: "SEO",             parent: "Marketing", slug: "seo",             pages: 6,  status: "Draft",    updated: "2 Jul, 2024" },
  { id: 5, name: "Graphics",        parent: "Services",  slug: "graphics",        pages: 9,  status: "Active",   updated: "1 Jul, 2024" },
  { id: 6, name: "Content Writing", parent: "Marketing", slug: "content-writing", pages: 4,  status: "Inactive", updated: "30 Jun, 2024" },
];

const PAGE_SIZE = 6;

const statusStyle: Record<string, string> = {
  Active:   "bg-emerald-100 text-emerald-700",
  Draft:    "bg-amber-100 text-amber-700",
  Inactive: "bg-red-100 text-red-600",
};

export default function CategoryPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [showAddCategory, setShowAddCategory] = useState(false);

  const filtered = search.trim()
    ? SAMPLE.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.slug.toLowerCase().includes(search.toLowerCase()) ||
          c.parent.toLowerCase().includes(search.toLowerCase())
      )
    : SAMPLE;

  const total     = filtered.length;
  const published = filtered.filter((c) => c.status === "Active" || c.status === "Draft").length;
  const active    = filtered.filter((c) => c.status === "Active").length;
  const inactive  = filtered.filter((c) => c.status === "Inactive").length;
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-5 sm:space-y-6 text-zinc-800">
      <Topbar showSearch={false} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader title="Category" description="Manage all your categories." />
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button onClick={() => setShowAddCategory(true)}>
            Add Category
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        <StatCard icon={Tag}          label="Total Categories" value={18} />
        <StatCard icon={Tag}          label="Published"        value={15} />
        <StatCard icon={CheckCircle2} label="Active"           value={16} />
        <StatCard icon={XCircle}      label="Inactive"         value={2}  />
      </div>

      {/* List section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-black">Categories List</h2>
          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="hidden sm:flex items-center rounded-lg border border-gray-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center justify-center rounded-md p-2 transition-colors ${
                  viewMode === "list" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("card")}
                className={`flex items-center justify-center rounded-md p-2 transition-colors ${
                  viewMode === "card" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
                title="Card view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="search"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-700 shadow-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-200"
              />
            </div>
          </div>
        </div>

        {/* List view */}
        {viewMode === "list" ? (
          <Card noPadding className="overflow-hidden">
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-zinc-500 text-xs uppercase tracking-wide">
                    <th className="px-5 py-4 font-medium">#</th>
                    <th className="px-5 py-4 font-medium">Category Name</th>
                    <th className="px-5 py-4 font-medium">Parent Category</th>
                    <th className="px-5 py-4 font-medium">Slug</th>
                    <th className="px-5 py-4 font-medium">Pages</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium">Updated</th>
                    <th className="px-5 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-10 text-center text-zinc-400">No categories found.</td>
                    </tr>
                  ) : paginated.map((c, i) => (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-zinc-500">{String((currentPage - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}</td>
                      <td className="px-5 py-4 font-bold text-zinc-800">{c.name}</td>
                      <td className="px-5 py-4 text-zinc-500">{c.parent}</td>
                      <td className="px-5 py-4 text-zinc-500">{c.slug}</td>
                      <td className="px-5 py-4 text-zinc-600">{c.pages}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[c.status]}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-zinc-500">{c.updated}</td>
                      <td className="px-5 py-4">
                        <RowActions variant="icons" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile list */}
            <div className="sm:hidden divide-y divide-gray-100">
              {paginated.map((c, i) => (
                <div key={c.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs text-zinc-400 mr-2">{String((currentPage - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}</span>
                      <span className="font-bold text-zinc-800">{c.name}</span>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[c.status]}`}>{c.status}</span>
                  </div>
                  <p className="text-xs text-zinc-500 mb-0.5">Parent: {c.parent} · Slug: {c.slug}</p>
                  <p className="text-xs text-zinc-400 mb-3">Pages: {c.pages} · {c.updated}</p>
                  <RowActions variant="buttons" />
                </div>
              ))}
            </div>
          </Card>
        ) : (
          /* Card view */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((c) => (
              <div
                key={c.id}
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="mb-4 flex h-28 w-full items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600">
                  <Tag className="h-10 w-10 text-white/80" />
                </div>
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{c.name}</h3>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${statusStyle[c.status]}`}>{c.status}</span>
                </div>
                <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span>Parent: <span className="text-gray-700">{c.parent}</span></span>
                  <span>Slug: <span className="text-gray-700">{c.slug}</span></span>
                  <span>Pages: <span className="text-gray-700">{c.pages}</span></span>
                  <span>Updated: <span className="text-gray-700">{c.updated}</span></span>
                </div>
                <RowActions variant="buttons" />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pageCount > 1 && (
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            rangeLabel={`Showing ${(currentPage - 1) * PAGE_SIZE + 1} to ${Math.min(currentPage * PAGE_SIZE, total)} of ${total} entries`}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <AddCategoryModal open={showAddCategory} onClose={() => setShowAddCategory(false)} />
    </div>
  );
}
