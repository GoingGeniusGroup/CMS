"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { UserSquare2, CheckCircle2, Clock, Plus, Search, Filter } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { Pagination } from "@/components/Pagination";
import { RowActions } from "@/components/RowActions";
import { AddLeadModal, type LeadRow } from "@/components/AddLeadModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { ViewDetailModal } from "@/components/ViewDetailModal";
import { StatusBadge } from "@/components/StatusBadge";
import { useEntityLabel, useStatusOptions } from "@/components/ConfigProvider";
import { getLeads, deleteLead } from "@/app/actions/leads";

type LeadsData = {
  leads: LeadRow[];
  total: number;
  newLeads: number;
  thisMonth: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

const PAGE_SIZE = 10;

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function LeadsClient({
  initialData,
  services,
}: {
  initialData: LeadsData;
  services: string[];
}) {
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(initialData.page);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const filterRef = useRef<HTMLDivElement>(null);

  const leadLabel = useEntityLabel("lead");
  const leadLabelPlural = useEntityLabel("lead", { plural: true });
  const statusOptions = useStatusOptions("lead");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<LeadRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<LeadRow | null>(null);

  function refresh(page = currentPage) {
    startTransition(async () => {
      const freshData = await getLeads(page, PAGE_SIZE);
      if (freshData.success) {
        setData(freshData as unknown as LeadsData);
      }
    });
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    refresh(page);
  }

  function handleAdd() {
    setEditingLead(null);
    setModalOpen(true);
  }

  function handleEdit(lead: LeadRow) {
    setEditingLead(lead);
    setModalOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    setData((prev) => ({
      ...prev,
      leads: prev.leads.filter((l) => l.id !== deleteId),
      total: prev.total - 1,
    }));
    const result = await deleteLead(deleteId);
    setDeleteId(null);
    if (!result.success) {
      refresh();
    }
  }

  const filtered = data.leads.filter((l) => {
    const matchesSearch =
      !search.trim() ||
      l.fullName.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5 sm:space-y-6 text-zinc-800">
      <Topbar showSearch={false} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader title={leadLabelPlural} description={`Manage all ${leadLabelPlural.toLowerCase()} submitted from the contact form.`} />
        <div className="flex items-center gap-3">
          <div className="relative" ref={filterRef}>
            <Button variant="secondary" onClick={() => setFilterOpen((v) => !v)}>
              <Filter className="h-4 w-4" />
              Filter{statusFilter !== "all" ? " (1)" : ""}
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
              </div>
            )}
          </div>
          <Button onClick={handleAdd}>
            Add {leadLabel}
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        <StatCard icon={UserSquare2} label={`Total ${leadLabelPlural}`} value={data.total} />
        <StatCard icon={CheckCircle2} label="New" value={data.newLeads} />
        <StatCard icon={Clock} label="This Month" value={data.thisMonth} />
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-black">{leadLabelPlural} List</h2>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            placeholder={`Search ${leadLabelPlural.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-700 shadow-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-200"
          />
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 && !isPending ? (
        <Card noPadding className="overflow-hidden">
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
            <UserSquare2 className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">
              {search ? `No ${leadLabelPlural.toLowerCase()} match your search` : `No ${leadLabelPlural.toLowerCase()} yet. Click "Add ${leadLabel}" to create one.`}
            </p>
          </div>
        </Card>
      ) : (
        <Card noPadding className="overflow-hidden">
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-700">
                  <th className="p-4 text-sm font-semibold w-16">#</th>
                  <th className="p-4 text-sm font-semibold">{leadLabel}</th>
                  <th className="p-4 text-sm font-semibold">Phone</th>
                  <th className="p-4 text-sm font-semibold">Company</th>
                  <th className="p-4 text-sm font-semibold">Service</th>
                  <th className="p-4 text-sm font-semibold">Budget</th>
                  <th className="p-4 text-sm font-semibold">Status</th>
                  <th className="p-4 text-sm font-semibold">Date</th>
                  <th className="p-4 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l, i) => (
                  <tr key={l.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-zinc-500">{String((currentPage - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}</td>
                    <td className="p-4">
                      <p className="font-medium text-gray-900">{l.fullName}</p>
                      <p className="text-xs text-zinc-500">{l.email}</p>
                    </td>
                    <td className="p-4 text-zinc-500">{l.phone || "—"}</td>
                    <td className="p-4 text-zinc-500">{l.company || "—"}</td>
                    <td className="p-4 text-zinc-500">{l.serviceInterest || "—"}</td>
                    <td className="p-4 text-zinc-500">{l.budget || "—"}</td>
                    <td className="p-4">
                      <StatusBadge moduleKey="lead" value={l.status} />
                    </td>
                    <td className="p-4 text-zinc-500">{formatDate(l.createdAt)}</td>
                    <td className="p-4">
                      <RowActions onView={() => setViewItem(l)} onEdit={() => handleEdit(l)} onDelete={() => setDeleteId(l.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile fallback */}
          <div className="sm:hidden divide-y divide-gray-100">
            {filtered.map((l, i) => (
              <div key={l.id} className="p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-xs text-gray-500 font-medium w-6">
                    {String((currentPage - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 mb-0.5">{l.fullName}</h3>
                    <p className="text-xs text-gray-600 mb-1">{l.email}</p>
                    <p className="text-xs text-gray-600 mb-1">
                      {[l.phone, l.company].filter(Boolean).join(" · ") || "—"}
                    </p>
                    <StatusBadge moduleKey="lead" value={l.status} />
                  </div>
                </div>
                <RowActions variant="buttons" onView={() => setViewItem(l)} onEdit={() => handleEdit(l)} onDelete={() => setDeleteId(l.id)} />
              </div>
            ))}
          </div>
        </Card>
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
      <AddLeadModal
        key={editingLead?.id ?? "new"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => { setModalOpen(false); refresh(); }}
        lead={editingLead}
        services={services}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        title={`Delete ${leadLabel}`}
        description={`Are you sure you want to delete this ${leadLabel.toLowerCase()}? This action cannot be undone.`}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* View Detail Modal */}
      <ViewDetailModal
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem?.fullName || ""}
        fields={[
          { label: "Phone", value: viewItem?.phone },
          { label: "Company", value: viewItem?.company },
          { label: "Subject", value: viewItem?.subject },
          { label: "Service of Interest", value: viewItem?.serviceInterest },
          { label: "Budget", value: viewItem?.budget },
          { label: "Message", value: viewItem?.message },
          { label: "Date", value: viewItem ? formatDate(viewItem.createdAt) : undefined },
        ]}
      />
    </div>
  );
}