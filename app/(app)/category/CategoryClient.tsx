"use client";

import { useState, useTransition } from "react";
import { Tag, CheckCircle2, XCircle, Plus, Search, List, LayoutGrid } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { Pagination } from "@/components/Pagination";
import { RowActions } from "@/components/RowActions";
import { AddCategoryModal } from "@/components/AddCategoryModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { ViewDetailModal } from "@/components/ViewDetailModal";
import { getCategories, deleteCategory } from "@/app/actions/categories";

type Category = {
  id: string;
  name: string;
  slug: string;
  parent: string | null;
  order: number;
  banner: string | null;
  icon: string | null;
  link: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type CategoriesData = {
  categories: Category[];
  total: number;
  active: number;
  inactive: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

const PAGE_SIZE = 10;

const statusStyle: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Draft: "bg-amber-100 text-amber-700",
  Inactive: "bg-red-100 text-red-600",
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function CategoryClient({ initialData }: { initialData: CategoriesData }) {
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(initialData.page);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<"list" | "card">("list");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<Category | null>(null);

  function refresh(page = currentPage) {
    startTransition(async () => {
      const freshData = await getCategories(page, PAGE_SIZE);
      setData(freshData as CategoriesData);
    });
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    refresh(page);
  }

  function handleAdd() {
    setEditingCategory(null);
    setModalOpen(true);
  }

  function handleEdit(category: Category) {
    setEditingCategory(category);
    setModalOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== deleteId),
      total: prev.total - 1,
    }));
    const result = await deleteCategory(deleteId);
    setDeleteId(null);
    if (!result.success) {
      refresh();
    }
  }

  const filtered = search.trim()
    ? data.categories.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.slug.toLowerCase().includes(search.toLowerCase()) ||
          (c.parent && c.parent.toLowerCase().includes(search.toLowerCase()))
      )
    : data.categories;

  return (
    <div className="space-y-5 sm:space-y-6 text-zinc-800">
      <Topbar showSearch={false} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader title="Category" description="Manage all your categories." />
        <div className="flex items-center gap-3">
          <Button onClick={handleAdd}>
            Add Category
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        <StatCard icon={Tag} label="Total Categories" value={data.total} />
        <StatCard icon={CheckCircle2} label="Active" value={data.active} />
        <StatCard icon={XCircle} label="Inactive" value={data.inactive} />
      </div>

      {/* Search + View Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-black">Categories List</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1">
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
            <Tag className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">
              {search ? "No categories match your search" : "No categories yet. Add your first category!"}
            </p>
          </div>
        </Card>
      ) : viewMode === "list" ? (
        <Card noPadding className="overflow-hidden">
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-700">
                  <th className="p-4 text-sm font-semibold w-16">#</th>
                  <th className="p-4 text-sm font-semibold">Icon</th>
                  <th className="p-4 text-sm font-semibold">Category Name</th>
                  <th className="p-4 text-sm font-semibold">Parent</th>
                  <th className="p-4 text-sm font-semibold">Slug</th>
                  <th className="p-4 text-sm font-semibold">Status</th>
                  <th className="p-4 text-sm font-semibold">Updated</th>
                  <th className="p-4 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-zinc-500">{String((currentPage - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}</td>
                    <td className="p-4">
                      {c.icon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.icon} alt={c.name} className="h-9 w-9 rounded-md object-cover" />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-sky-400 to-indigo-500">
                          <Tag className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium text-gray-900">{c.name}</td>
                    <td className="p-4 text-zinc-500">{c.parent || "—"}</td>
                    <td className="p-4 text-zinc-500">/{c.slug}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[c.status] || statusStyle.Active}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-500">{formatDate(c.updatedAt)}</td>
                    <td className="p-4">
                      <RowActions onView={() => setViewItem(c)} onEdit={() => handleEdit(c)} onDelete={() => setDeleteId(c.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile fallback */}
          <div className="sm:hidden divide-y divide-gray-100">
            {filtered.map((c, i) => (
              <div key={c.id} className="p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-xs text-gray-500 font-medium w-6">
                    {String((currentPage - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">{c.name}</h3>
                    <p className="text-xs text-gray-600 mb-1">Parent: {c.parent || "—"} · /{c.slug}</p>
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[c.status] || statusStyle.Active}`}>
                      {c.status}
                    </span>
                  </div>
                </div>
                <RowActions variant="buttons" onView={() => setViewItem(c)} onEdit={() => handleEdit(c)} onDelete={() => setDeleteId(c.id)} />
              </div>
            ))}
          </div>
        </Card>
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              {c.banner ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.banner} alt={c.name} className="mb-4 h-28 w-full rounded-xl object-cover" />
              ) : (
                <div className="mb-4 flex h-28 w-full items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600">
                  {c.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.icon} alt={c.name} className="h-12 w-12 rounded-md object-cover" />
                  ) : (
                    <Tag className="h-10 w-10 text-white/80" />
                  )}
                </div>
              )}
              <div className="mb-3 flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{c.name}</h3>
                <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${statusStyle[c.status] || statusStyle.Active}`}>
                  {c.status}
                </span>
              </div>
              <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                <span>Parent: <span className="text-gray-700">{c.parent || "—"}</span></span>
                <span>Slug: <span className="text-gray-700">/{c.slug}</span></span>
              </div>
              <RowActions variant="buttons" onView={() => setViewItem(c)} onEdit={() => handleEdit(c)} onDelete={() => setDeleteId(c.id)} />
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

      {/* Add/Edit Modal */}
      <AddCategoryModal
        key={editingCategory?.id ?? "new"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => { setModalOpen(false); refresh(); }}
        category={editingCategory}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* View Detail Modal */}
      <ViewDetailModal
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem?.name || ""}
        imageUrl={viewItem?.banner || viewItem?.icon || undefined}
        fields={[
          { label: "Name", value: viewItem?.name },
          { label: "Slug", value: viewItem?.slug },
          { label: "Parent", value: viewItem?.parent },
          { label: "Order", value: viewItem?.order },
        ]}
      />
    </div>
  );
}
