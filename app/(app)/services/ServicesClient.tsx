"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Layers, Plus, CheckCircle2, XCircle, Search, List, LayoutGrid, Filter } from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { RowActions } from "@/components/RowActions";
import { Pagination } from "@/components/Pagination";
import { AddServiceModal } from "@/components/AddServiceModal";
import { EditServiceModal, type ServiceRow } from "@/components/EditServiceModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { ViewDetailModal } from "@/components/ViewDetailModal";
import { StatusBadge } from "@/components/StatusBadge";
import { useEntityLabel, useStatusOptions } from "@/components/ConfigProvider";
import { getServicesPaginated, deleteService } from "@/app/actions/services";

type Service = {
  id: string;
  serviceName: string;
  description: string | null;
  category: string | null;
  basePrice: number | null;
  isActive: boolean;
  isFeatured: boolean;
  thumbnailUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type ServicesData = {
  services: Service[];
  total: number;
  active: number;
  inactive: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

const PAGE_SIZE = 10;

function isRichContent(text: string | null): boolean {
  if (!text) return false;
  return text.startsWith('{"type":"doc"');
}

function extractPreview(text: string | null, maxLen = 120): string | null {
  if (!text) return null;
  if (!isRichContent(text)) return text;
  try {
    const json = JSON.parse(text);
    const parts: string[] = [];
    function walk(nodes: unknown[] | undefined) {
      if (!nodes) return;
      for (const node of nodes as { type?: string; text?: string; content?: unknown[] }[]) {
        if (node.text) parts.push(node.text);
        if (node.content) walk(node.content);
      }
    }
    walk(json.content);
    const plain = parts.join(" ").replace(/\s+/g, " ").trim();
    return plain.length > maxLen ? plain.slice(0, maxLen) + "..." : plain;
  } catch {
    return text;
  }
}

export function ServicesClient({ initialData }: { initialData: ServicesData }) {
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(initialData.page);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const filterRef = useRef<HTMLDivElement>(null);

  const serviceLabel = useEntityLabel("service");
  const serviceLabelPlural = useEntityLabel("service", { plural: true });
  const statusOptions = useStatusOptions("service");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ServiceRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<Service | null>(null);

  function refresh(page = currentPage) {
    startTransition(async () => {
      const freshData = await getServicesPaginated(page, PAGE_SIZE);
      setData(freshData as ServicesData);
    });
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    refresh(page);
  }

  function handleDelete(id: string) {
    setDeleteId(id);
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    setData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== deleteId),
      total: prev.total - 1,
    }));
    const result = await deleteService(deleteId);
    setDeleteId(null);
    if (!result.success) {
      refresh();
    }
  }

  const serviceCategories = [...new Set(data.services.map((s) => s.category).filter(Boolean))] as string[];

  const filtered = data.services.filter((s) => {
    const matchesSearch = !search.trim() ||
      s.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      (s.description && extractPreview(s.description)?.toLowerCase().includes(search.toLowerCase())) ||
      (s.category && s.category.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || (statusFilter === "Active" ? s.isActive : !s.isActive);
    const matchesFeatured = featuredFilter === "all" || (featuredFilter === "Featured" ? s.isFeatured : !s.isFeatured);
    const matchesCategory = categoryFilter === "all" || s.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesFeatured && matchesCategory;
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar showSearch={false} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader
          title={serviceLabelPlural}
          description={`Manage all your ${serviceLabelPlural.toLowerCase()}.`}
        />
        <div className="flex items-center gap-3">
          <div className="relative" ref={filterRef}>
            <Button variant="secondary" onClick={() => setFilterOpen((v) => !v)}>
              <Filter className="h-4 w-4" />
              Filter{(statusFilter !== "all" || featuredFilter !== "all" || categoryFilter !== "all") ? " (1)" : ""}
            </Button>
            {filterOpen && (
              <div className="absolute max-md:left-0 max-md:right-auto md:right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                <p className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</p>
                {[{ value: "all", label: "All Statuses" }, ...statusOptions.map((s) => ({ value: s.statusValue, label: s.label }))].map((s) => (
                  <button key={s.value} type="button" onClick={() => { setStatusFilter(s.value); setFilterOpen(false); }}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${statusFilter === s.value ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>
                    {s.label}
                  </button>
                ))}
                <div className="my-2 border-t border-gray-100" />
                <p className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Featured</p>
                {["all", "Featured", "Not Featured"].map((f) => (
                  <button key={f} type="button" onClick={() => { setFeaturedFilter(f); setFilterOpen(false); }}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${featuredFilter === f ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>
                    {f === "all" ? "All" : f}
                  </button>
                ))}
                <div className="my-2 border-t border-gray-100" />
                <p className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</p>
                <button type="button" onClick={() => { setCategoryFilter("all"); setFilterOpen(false); }}
                  className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${categoryFilter === "all" ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>All Categories</button>
                {serviceCategories.map((c) => (
                  <button key={c} type="button" onClick={() => { setCategoryFilter(c); setFilterOpen(false); }}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${categoryFilter === c ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>{c}</button>
                ))}
              </div>
            )}
          </div>
          <Button onClick={() => setAddOpen(true)}>
            Add {serviceLabel}
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        <StatCard icon={Layers} label={`Total ${serviceLabelPlural}`} value={data.total} />
        <StatCard icon={CheckCircle2} label="Active" value={data.active} />
        <StatCard icon={XCircle} label="Inactive" value={data.inactive} />
      </div>

      {/* Search + View Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-black">{serviceLabelPlural}</h2>
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
              placeholder="Search services..."
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
            <Layers className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">
              {search ? `No ${serviceLabelPlural.toLowerCase()} match your search` : `No ${serviceLabelPlural.toLowerCase()} yet. Add your first ${serviceLabel.toLowerCase()}!`}
            </p>
          </div>
        </Card>
      ) : viewMode === "list" ? (
        /* ─── List View (Table) ─── */
        <Card noPadding className="overflow-hidden">
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 w-16">#</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Thumbnail</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Service Name</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Description</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((service, index) => (
                  <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-600">
                      {String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                    </td>
                    <td className="p-4">
                      {service.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={service.thumbnailUrl} alt={service.serviceName} className="h-10 w-14 rounded-md object-cover" />
                      ) : (
                        <div className="h-10 w-14 rounded-md bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600" />
                      )}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-900">{service.serviceName}</td>
                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate">{extractPreview(service.description) || "—"}</td>
                    <td className="p-4">
                      <StatusBadge moduleKey="service" value={service.isActive ? "Active" : "Inactive"} />
                    </td>
                    <td className="p-4">
                      <RowActions
                        onView={() => setViewItem(service)}
                        onEdit={() => setEditTarget(service as ServiceRow)}
                        onDelete={() => handleDelete(service.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile fallback */}
          <div className="sm:hidden divide-y divide-gray-100">
            {filtered.map((service, index) => (
              <div key={service.id} className="p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-xs text-gray-500 font-medium w-6">
                    {String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                  </div>
                  {service.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={service.thumbnailUrl} alt={service.serviceName} className="h-12 w-16 shrink-0 rounded-md object-cover" />
                  ) : (
                    <div className="h-12 w-16 shrink-0 rounded-md bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">{service.serviceName}</h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{extractPreview(service.description) || "—"}</p>
                    <StatusBadge moduleKey="service" value={service.isActive ? "Active" : "Inactive"} />
                  </div>
                </div>
                <RowActions variant="buttons" onView={() => setViewItem(service)} onEdit={() => setEditTarget(service as unknown as ServiceRow)} onDelete={() => handleDelete(service.id)} />
              </div>
            ))}
          </div>
        </Card>
      ) : (
        /* ─── Card View (Grid) ─── */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service) => (
            <div
              key={service.id}
              className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Thumbnail */}
              <div className="mb-4 aspect-square w-full relative bg-zinc-50 border border-zinc-100 rounded-xl overflow-hidden flex items-center justify-center">
                {service.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={service.thumbnailUrl} alt={service.serviceName} className="h-full w-full object-contain" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600" />
                )}
              </div>

              {/* Title & Status */}
              <div className="mb-3 flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{service.serviceName}</h3>
                <div className="shrink-0">
                  <StatusBadge moduleKey="service" value={service.isActive ? "Active" : "Inactive"} />
                </div>
              </div>

              {/* Description */}
              {service.description && (
                <p className="mb-3 text-xs text-gray-500 line-clamp-2">{extractPreview(service.description)}</p>
              )}

              {/* Meta */}
              <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                {service.category && (
                  <span>Category: <span className="text-gray-700">{service.category}</span></span>
                )}
                {service.basePrice != null && (
                  <span>Price: <span className="text-gray-700">Rs. {service.basePrice.toLocaleString()}</span></span>
                )}
              </div>

              {/* Actions */}
              <RowActions
                variant="buttons"
                onView={() => setViewItem(service)}
                onEdit={() => setEditTarget(service as unknown as ServiceRow)}
                onDelete={() => handleDelete(service.id)}
              />
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

      {/* Add Service Modal */}
      <AddServiceModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={() => { setAddOpen(false); refresh(); }}
      />

      {/* Edit Service Modal */}
      <EditServiceModal
        key={editTarget?.id ?? "none"}
        open={!!editTarget}
        service={editTarget}
        onClose={() => setEditTarget(null)}
        onSuccess={() => { setEditTarget(null); refresh(); }}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        title={`Delete ${serviceLabel}`}
        description={`Are you sure you want to delete this ${serviceLabel.toLowerCase()}? This action cannot be undone.`}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* View Detail Modal */}
      <ViewDetailModal
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem?.serviceName || ""}
        imageUrl={viewItem?.thumbnailUrl || undefined}
        fields={[
          { label: "Name", value: viewItem?.serviceName },
          { label: "Category", value: viewItem?.category },
          { label: "Base Price", value: viewItem?.basePrice },
          { label: "Status", value: viewItem ? (viewItem.isActive ? "Active" : "Inactive") : undefined },
          { label: "Featured", value: viewItem?.isFeatured ? "Yes" : "No" },
          { label: "Description", value: extractPreview(viewItem?.description ?? null) },
        ]}
      />
    </div>
  );
}
