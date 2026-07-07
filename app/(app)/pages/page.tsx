"use client";

import { useState } from "react";
import { FileText, Filter, Plus, Search, Trash2, List, LayoutGrid } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { Pagination } from "@/components/Pagination";
import { RowActions } from "@/components/RowActions";
import { AddPageModal } from "@/components/AddPageModal";

type Page = {
  id: number;
  title: string;
  slug: string;
  createdAt: string;
  status: "Published" | "Draft";
};

const SAMPLE_PAGES: Page[] = [
  { id: 1, title: "About Us",           slug: "about-us",         createdAt: "01 Jan 2026 12:00 AM", status: "Published" },
  { id: 2, title: "Our Services",       slug: "our-services",     createdAt: "01 Jan 2026 10:00 AM", status: "Draft" },
  { id: 3, title: "Blog",               slug: "blog",             createdAt: "01 Jan 2026 01:00 PM", status: "Published" },
  { id: 4, title: "Portfolio",          slug: "portfolio",        createdAt: "01 Jan 2026 02:00 PM", status: "Published" },
  { id: 5, title: "Terms & Conditions", slug: "terms-conditions", createdAt: "01 Jan 2026 03:10 PM", status: "Draft" },
];

const PAGE_SIZE = 5;

export default function PagesPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddPage, setShowAddPage] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "card">("list");

  const filtered = search.trim()
    ? SAMPLE_PAGES.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.slug.toLowerCase().includes(search.toLowerCase())
      )
    : SAMPLE_PAGES;

  const total = filtered.length;
  const published = filtered.filter((p) => p.status === "Published").length;
  const drafts = filtered.filter((p) => p.status === "Draft").length;
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-5 sm:space-y-6 text-zinc-800">
      <Topbar showSearch={false} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader title="Pages" description="Manage all your website pages." />
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button onClick={() => setShowAddPage(true)}>
            Add New Page
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        <StatCard icon={FileText} label="Total Pages"  value={18} />
        <StatCard icon={FileText} label="Published"    value={15} />
        <StatCard icon={FileText} label="Drafts"       value={3} />
        <StatCard icon={Trash2}   label="Trash"        value={0} />
      </div>

      {/* Table section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-black">Added Pages List</h2>
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
                placeholder="Search Pages..."
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
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-zinc-500">
                    <th className="px-6 py-4 font-medium">#</th>
                    <th className="px-6 py-4 font-medium">Title</th>
                    <th className="px-6 py-4 font-medium">Slug</th>
                    <th className="px-6 py-4 font-medium">Created At</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-zinc-400">No pages found.</td>
                    </tr>
                  ) : (
                    paginated.map((p, i) => (
                      <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-zinc-500">
                          {String((currentPage - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}
                        </td>
                        <td className="px-6 py-4 font-medium text-zinc-800">{p.title}</td>
                        <td className="px-6 py-4 text-zinc-500">{p.slug}</td>
                        <td className="px-6 py-4 text-zinc-500">{p.createdAt}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block rounded-full px-4 py-1 text-xs font-semibold text-white ${
                            p.status === "Published" ? "bg-emerald-400" : "bg-amber-400"
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <RowActions variant="icons" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Mobile list fallback */}
            <div className="sm:hidden divide-y divide-gray-100">
              {paginated.map((p, i) => (
                <div key={p.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs text-zinc-400 mr-2">
                        {String((currentPage - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-semibold text-zinc-800">{p.title}</span>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold text-white ${
                      p.status === "Published" ? "bg-emerald-400" : "bg-amber-400"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mb-1">Slug: {p.slug}</p>
                  <p className="text-xs text-zinc-400 mb-3">{p.createdAt}</p>
                  <RowActions variant="buttons" />
                </div>
              ))}
            </div>
          </Card>
        ) : (
          /* Card view */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((p, i) => (
              <div
                key={p.id}
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                {/* Colour banner */}
                <div className="mb-4 h-28 w-full rounded-xl bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center">
                  <FileText className="h-10 w-10 text-white/80" />
                </div>
                {/* Title & status */}
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{p.title}</h3>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium text-white ${
                    p.status === "Published" ? "bg-emerald-400" : "bg-amber-400"
                  }`}>
                    {p.status}
                  </span>
                </div>
                {/* Meta */}
                <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span>Slug: <span className="text-gray-700">{p.slug}</span></span>
                  <span>Created: <span className="text-gray-700">{p.createdAt}</span></span>
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

      {/* Add New Page modal */}
      <AddPageModal open={showAddPage} onClose={() => setShowAddPage(false)} />
    </div>
  );
}
