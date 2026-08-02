"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Filter, LayoutGrid, List, Plus, Search, Wallet, FileText } from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { RowActions } from "@/components/RowActions";
import { Pagination } from "@/components/Pagination";
import { PageHeader } from "@/components/PageHeader";
import { InvoiceModal } from "@/components/InvoiceModal";
import { InvoicePrintModal } from "@/components/InvoicePrintModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { ViewDetailModal } from "@/components/ViewDetailModal";
import { StatusBadge } from "@/components/StatusBadge";
import { useEntityLabel, useStatusOptions } from "@/components/ConfigProvider";
import { getInvoices, deleteInvoice } from "@/app/actions/invoices";

type SelectOption = { id: string; label: string };

type Invoice = {
  id: string;
  invoiceNumber: string;
  customerId: string | null;
  category: string | null;
  customer: { id: string; fullName: string } | null;
  projects: { project: { id: string; title: string } }[];
  amount: number;
  tax: number;
  total: number;
  status: string;
  issuedDate: Date | null;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type InvoicesData = {
  invoices: Invoice[];
  total: number;
  paid: number;
  pending: number;
  overdue: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

const PAGE_SIZE = 10;

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function InvoicesClient({
  initialData,
  customers = [],
  projects = [],
  printSettings,
}: {
  initialData: InvoicesData;
  customers?: SelectOption[];
  projects?: SelectOption[];
  printSettings?: { siteName: string; address: string; email: string; phone: string };
}) {
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(initialData.page);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewItem, setViewItem] = useState<Invoice | null>(null);
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);

  function refresh(page = currentPage) {
    startTransition(async () => {
      const freshData = await getInvoices(page, PAGE_SIZE);
      setData(freshData as InvoicesData);
    });
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    refresh(page);
  }

  function handleAdd() {
    setEditingInvoice(null);
    setModalOpen(true);
  }

  function handleEdit(invoice: Invoice) {
    setEditingInvoice(invoice);
    setModalOpen(true);
  }

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const filterRef = useRef<HTMLDivElement>(null);

  const invoiceLabel = useEntityLabel("invoice");
  const invoiceLabelPlural = useEntityLabel("invoice", { plural: true });
  const customerLabel = useEntityLabel("customer");
  const invoiceStatusOptions = useStatusOptions("invoice");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleDelete(id: string) {
    setDeleteId(id);
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    setData((prev) => ({
      ...prev,
      invoices: prev.invoices.filter((inv) => inv.id !== deleteId),
      total: prev.total - 1,
    }));
    const result = await deleteInvoice(deleteId);
    setDeleteId(null);
    if (!result.success) {
      refresh();
    }
  }

  const filtered = data.invoices.filter((inv) => {
    const projectTitles = inv.projects?.map((p) => p.project.title).join(" ") || "";
    const matchesSearch = !search.trim() ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      (inv.customer?.fullName.toLowerCase().includes(search.toLowerCase())) ||
      projectTitles.toLowerCase().includes(search.toLowerCase()) ||
      inv.status.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar showSearch={false} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader title={invoiceLabelPlural} description={`Manage and track all your ${invoiceLabelPlural.toLowerCase()}.`} />
        <div className="flex items-center gap-3">
          <div className="relative" ref={filterRef}>
            <Button variant="secondary" onClick={() => setFilterOpen((v) => !v)}>
              <Filter className="h-4 w-4" />
              Filter{statusFilter !== "all" ? " (1)" : ""}
            </Button>
            {filterOpen && (
              <div className="absolute max-md:left-0 max-md:right-auto md:right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                <p className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</p>
                {["all", ...invoiceStatusOptions.map((o) => o.statusValue)].map((s) => (
                  <button key={s} type="button" onClick={() => { setStatusFilter(s); setFilterOpen(false); }}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${statusFilter === s ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>
                    {s === "all" ? "All Statuses" : (invoiceStatusOptions.find((o) => o.statusValue === s)?.label ?? s)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button onClick={handleAdd}>
            Add {invoiceLabel}
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        <StatCard icon={Wallet} label={`Total ${invoiceLabelPlural}`} value={data.total} />
        <StatCard icon={Wallet} label="Paid" value={data.paid} />
        <StatCard icon={Wallet} label="Pending" value={data.pending} />
        <StatCard icon={Wallet} label="Overdue" value={data.overdue} />
      </div>

      {/* Search + View Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-black">{invoiceLabel} List</h2>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              title="List view"
              className={`flex items-center justify-center rounded-md p-2 transition-colors ${
                viewMode === "list" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("card")}
              title="Card view"
              className={`flex items-center justify-center rounded-md p-2 transition-colors ${
                viewMode === "card" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              placeholder={`Search ${invoiceLabelPlural.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-700 shadow-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-200"
            />
          </div>
        </div>
      </div>

      {/* Table / Card */}
      {viewMode === "list" ? (
        <Card noPadding className="overflow-hidden">
          {filtered.length === 0 && !isPending ? (
            <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
              <FileText className="h-10 w-10 text-zinc-300" />
              <p className="text-sm text-zinc-500">
                {search ? `No ${invoiceLabelPlural.toLowerCase()} match your search` : `No ${invoiceLabelPlural.toLowerCase()} yet. Create your first ${invoiceLabel.toLowerCase()}!`}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-zinc-500">
                      <th className="px-6 py-4 font-medium">Invoice #</th>
                      <th className="px-6 py-4 font-medium">{customerLabel}</th>
                      <th className="px-6 py-4 font-medium">Category</th>
                      <th className="px-6 py-4 font-medium">Projects</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((inv) => (
                      <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{inv.invoiceNumber}</td>
                        <td className="px-6 py-4 text-zinc-600">{inv.customer?.fullName || "—"}</td>
                        <td className="px-6 py-4 text-zinc-600">{inv.category || "—"}</td>
                        <td className="px-6 py-4 text-zinc-600">
                          {inv.projects?.length ? inv.projects.map((p) => p.project.title).join(", ") : "—"}
                        </td>
                        <td className="px-6 py-4 text-zinc-700 font-medium">Rs. {inv.total.toLocaleString()}</td>
                        <td className="px-6 py-4"><StatusBadge moduleKey="invoice" value={inv.status} /></td>
                        <td className="px-6 py-4">
                          <RowActions onView={() => setViewItem(inv)} onEdit={() => handleEdit(inv)} onPrint={() => setPrintInvoice(inv)} onDelete={() => handleDelete(inv.id)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile */}
              <div className="lg:hidden divide-y divide-gray-100">
                {filtered.map((inv) => (
                  <div key={inv.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900">{inv.invoiceNumber}</h3>
                        <p className="text-xs text-gray-600">{inv.customer?.fullName || "No customer"}</p>
                        {inv.category && <p className="text-xs text-gray-400 mt-0.5">{inv.category}</p>}
                      </div>
                      <StatusBadge moduleKey="invoice" value={inv.status} />
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {inv.projects?.length ? inv.projects.map((p) => p.project.title).join(", ") : "No projects"}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs sm:text-sm">
                      <div>
                        <span className="text-gray-500 block">Amount</span>
                        <span className="font-medium text-gray-900">Rs. {inv.total.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Due</span>
                        <span className="text-gray-900">{formatDate(inv.dueDate)}</span>
                      </div>
                    </div>
                    <RowActions variant="buttons" onView={() => setViewItem(inv)} onEdit={() => handleEdit(inv)} onPrint={() => setPrintInvoice(inv)} onDelete={() => handleDelete(inv.id)} />
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      ) : (
        /* Card grid view */
        <div>
          {filtered.length === 0 && !isPending ? (
            <Card noPadding className="overflow-hidden">
              <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
                <FileText className="h-10 w-10 text-zinc-300" />
                <p className="text-sm text-zinc-500">
                  {search ? `No ${invoiceLabelPlural.toLowerCase()} match your search` : `No ${invoiceLabelPlural.toLowerCase()} yet. Create your first ${invoiceLabel.toLowerCase()}!`}
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((inv) => (
                <div key={inv.id} className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="font-semibold text-base text-gray-900">{inv.invoiceNumber}</p>
                      <p className="text-sm text-gray-500">{inv.customer?.fullName || "No customer"}</p>
                    </div>
                    <StatusBadge moduleKey="invoice" value={inv.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="col-span-2">
                      <span className="text-gray-400 text-xs block">Projects</span>
                      <span className="text-gray-700 font-medium">
                        {inv.projects?.length ? inv.projects.map((p) => p.project.title).join(", ") : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">Category</span>
                      <span className="text-gray-700">{inv.category || "—"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">Amount</span>
                      <span className="text-gray-900 font-semibold">Rs. {inv.total.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">Issued</span>
                      <span className="text-gray-700">{formatDate(inv.issuedDate)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">Due</span>
                      <span className="text-gray-700">{formatDate(inv.dueDate)}</span>
                    </div>
                  </div>
                  <RowActions variant="buttons" onView={() => setViewItem(inv)} onEdit={() => handleEdit(inv)} onPrint={() => setPrintInvoice(inv)} onDelete={() => handleDelete(inv.id)} />
                </div>
              ))}
            </div>
          )}
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

      {/* Modal */}
      <InvoiceModal
        key={editingInvoice?.id ?? "new"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => { setModalOpen(false); refresh(); }}
        invoice={editingInvoice}
        customers={customers}
        projects={projects}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        title={`Delete ${invoiceLabel}`}
        description={`Are you sure you want to delete this ${invoiceLabel.toLowerCase()}? This action cannot be undone.`}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Print Modal */}
      <InvoicePrintModal
        open={!!printInvoice}
        onClose={() => setPrintInvoice(null)}
        invoice={printInvoice}
        companyName={printSettings?.siteName || "Your Company"}
        companyAddress={printSettings?.address || ""}
        companyEmail={printSettings?.email || ""}
        companyPhone={printSettings?.phone || ""}
      />

      {/* View Detail Modal */}
      <ViewDetailModal
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem?.invoiceNumber || ""}
        fields={[
          { label: "Invoice #", value: viewItem?.invoiceNumber },
          { label: customerLabel, value: viewItem?.customer?.fullName },
          { label: "Category", value: viewItem?.category },
          { label: "Projects", value: viewItem?.projects?.length ? viewItem.projects.map((p) => p.project.title).join(", ") : "—" },
          { label: "Amount", value: viewItem?.amount },
          { label: "Tax", value: viewItem?.tax },
          { label: "Total", value: viewItem?.total },
          { label: "Status", value: viewItem?.status },
          { label: "Issued", value: viewItem?.issuedDate ? new Date(viewItem.issuedDate).toLocaleDateString() : null },
          { label: "Due", value: viewItem?.dueDate ? new Date(viewItem.dueDate).toLocaleDateString() : null },
        ]}
      />
    </div>
  );
}
