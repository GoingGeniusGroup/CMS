"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { FileText, Search, List, LayoutGrid, Folder, Filter } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { Pagination } from "@/components/Pagination";
import { RowActions } from "@/components/RowActions";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { ViewDetailModal } from "@/components/ViewDetailModal";
import { PageEditModal } from "@/components/PageEditModal";
import { getPages, deletePage } from "@/app/actions/pages";

type Page = {
  id: string;
  title: string;
  slug: string;
  content: unknown;
  thumbnail: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
  keywords?: string | null;
  metaImage?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type PagesData = {
  pages: Page[];
  total: number;
  published: number;
  drafts: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

const PAGE_SIZE = 10;

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function PagesClient({ initialData }: { initialData: PagesData }) {
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(initialData.page);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [viewItem, setViewItem] = useState<Page | null>(null);

  function refresh(page = currentPage) {
    startTransition(async () => {
      const freshData = await getPages(page, PAGE_SIZE);
      setData(freshData as PagesData);
    });
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    refresh(page);
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    setData((prev) => ({
      ...prev,
      pages: prev.pages.filter((p) => p.id !== deleteId),
      total: prev.total - 1,
    }));
    const result = await deletePage(deleteId);
    setDeleteId(null);
    if (!result.success) {
      refresh();
    }
  }

  const filtered = data.pages.filter((p) => {
    const matchesSearch = !search.trim() ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar showSearch={false} />

      {/* Header — no Add button, pages are added from Website Setup > Add New Page */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader
          title="Pages"
          description="View all website pages. Add new pages from Website Setup → Add New Page."
        />
        <div className="relative" ref={filterRef}>
          <Button variant="secondary" onClick={() => setFilterOpen((v) => !v)}>
            <Filter className="h-4 w-4" />
            Filter{statusFilter !== "all" ? " (1)" : ""}
          </Button>
          {filterOpen && (
            <div className="absolute max-md:left-0 max-md:right-auto md:right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
              <p className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</p>
              {["all", "Published", "Draft"].map((s) => (
                <button key={s} type="button" onClick={() => { setStatusFilter(s); setFilterOpen(false); }}
                  className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${statusFilter === s ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>
                  {s === "all" ? "All Statuses" : s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        <StatCard icon={FileText} label="Total Pages" value={data.total} />
        <StatCard icon={FileText} label="Published" value={data.published} />
        <StatCard icon={FileText} label="Drafts" value={data.drafts} />
      </div>

      {/* Search + View Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-black">Pages List</h2>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center justify-center rounded-md p-2 transition-colors ${
                viewMode === "list"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={`flex items-center justify-center rounded-md p-2 transition-colors ${
                viewMode === "card"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Card view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              placeholder="Search pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-700 shadow-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-200"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 && !isPending ? (
        <Card noPadding className="overflow-hidden">
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
            <Folder className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">
              {search
                ? "No pages match your search"
                : "No pages yet. Go to Website Setup → Add New Page to create one."}
            </p>
          </div>
        </Card>
      ) : viewMode === "list" ? (
        <Card noPadding className="overflow-hidden">
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 w-16">#</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Thumbnail</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Title</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Slug</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Created</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, index) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-600">
                      {String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                    </td>
                    <td className="p-4">
                      {p.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.thumbnail} alt={p.title} className="h-10 w-14 rounded-md object-cover" />
                      ) : (
                        <div className="h-10 w-14 rounded-md bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600" />
                      )}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-900">{p.title}</td>
                    <td className="p-4 text-sm text-gray-600">/{p.slug}</td>
                    <td className="p-4 text-sm text-gray-600">{formatDate(p.createdAt)}</td>
                    <td className="p-4">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                        p.status === "Published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <RowActions onView={() => setViewItem(p)} onEdit={() => setEditingPage(p)} onDelete={() => setDeleteId(p.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile fallback */}
          <div className="sm:hidden divide-y divide-gray-100">
            {filtered.map((p, index) => (
              <div key={p.id} className="p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-xs text-gray-500 font-medium w-6">
                    {String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">{p.title}</h3>
                    <p className="text-xs text-gray-600 mb-1 truncate">/{p.slug}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{formatDate(p.createdAt)}</span>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        p.status === "Published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                </div>
                <RowActions variant="buttons" onView={() => setViewItem(p)} onEdit={() => setEditingPage(p)} onDelete={() => setDeleteId(p.id)} />
              </div>
            ))}
          </div>
        </Card>
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              {p.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.thumbnail} alt={p.title} className="mb-4 h-36 w-full rounded-xl object-cover" />
              ) : (
                <div className="mb-4 h-28 w-full rounded-xl bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center">
                  <FileText className="h-10 w-10 text-white/80" />
                </div>
              )}

              <div className="mb-3 flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{p.title}</h3>
                <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium ${
                  p.status === "Published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {p.status}
                </span>
              </div>

              <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                <span>Slug: <span className="text-gray-700">/{p.slug}</span></span>
                <span>Created: <span className="text-gray-700">{formatDate(p.createdAt)}</span></span>
              </div>

              <RowActions variant="buttons" onView={() => setViewItem(p)} onEdit={() => setEditingPage(p)} onDelete={() => setDeleteId(p.id)} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data.pageCount > 1 && (
        <Pagination
          page={currentPage}
          pageCount={data.pageCount}
          rangeLabel={`Showing ${(currentPage - 1) * PAGE_SIZE + 1} to ${Math.min(currentPage * PAGE_SIZE, data.total)} of ${data.total} entries`}
          onPageChange={handlePageChange}
        />
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Delete Page"
        description="Are you sure you want to delete this page? This action cannot be undone."
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Edit Page Modal */}
      <PageEditModal
        key={editingPage?.id ?? "closed"}
        open={!!editingPage}
        onClose={() => setEditingPage(null)}
        onSuccess={() => { setEditingPage(null); refresh(); }}
        page={editingPage}
      />

      {/* View Detail Modal */}
      <ViewDetailModal
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem?.title || ""}
        imageUrl={viewItem?.thumbnail || undefined}
        fields={[
          { label: "Title", value: viewItem?.title },
          { label: "Slug", value: viewItem?.slug },
          { label: "Meta Title", value: viewItem?.metaTitle },
          { label: "Meta Description", value: viewItem?.metaDesc },
          { label: "Status", value: viewItem?.status },
        ]}
      />
    </div>
  );
}
