"use client";

import { useState, useTransition } from "react";
import { Filter, Plus, Search, Wallet, FileText } from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { RowActions } from "@/components/RowActions";
import { Pagination } from "@/components/Pagination";
import { PageHeader } from "@/components/PageHeader";
import { InvoiceModal } from "@/components/InvoiceModal";
import { getInvoices, deleteInvoice } from "@/app/actions/invoices";

type SelectOption = { id: string; label: string };

type Invoice = {
  id: string;
  invoiceNumber: string;
  customerId: string | null;
  projectId: string | null;
  customer: { id: string; fullName: string } | null;
  project: { id: string; title: string } | null;
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Overdue: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function InvoicesClient({
  initialData,
  customers = [],
  projects = [],
}: {
  initialData: InvoicesData;
  customers?: SelectOption[];
  projects?: SelectOption[];
}) {
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(initialData.page);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

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

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    setData((prev) => ({
      ...prev,
      invoices: prev.invoices.filter((inv) => inv.id !== id),
      total: prev.total - 1,
    }));
    const result = await deleteInvoice(id);
    if (!result.success) {
      refresh();
    }
  }

  const filtered = search.trim()
    ? data.invoices.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
          (inv.customer?.fullName.toLowerCase().includes(search.toLowerCase())) ||
          (inv.project?.title.toLowerCase().includes(search.toLowerCase())) ||
          inv.status.toLowerCase().includes(search.toLowerCase())
      )
    : data.invoices;

  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar showSearch={false} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader title="Invoices" description="Manage and track all your invoices." />
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button onClick={handleAdd}>
            Add Invoice
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        <StatCard icon={Wallet} label="Total Invoices" value={data.total} />
        <StatCard icon={Wallet} label="Paid" value={data.paid} />
        <StatCard icon={Wallet} label="Pending" value={data.pending} />
        <StatCard icon={Wallet} label="Overdue" value={data.overdue} />
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-black">Invoice List</h2>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-700 shadow-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-200"
          />
        </div>
      </div>

      {/* Table */}
      <Card noPadding className="overflow-hidden">
        {filtered.length === 0 && !isPending ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
            <FileText className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">
              {search ? "No invoices match your search" : "No invoices yet. Create your first invoice!"}
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
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Project</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Issued</th>
                    <th className="px-6 py-4 font-medium">Due</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inv) => (
                    <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{inv.invoiceNumber}</td>
                      <td className="px-6 py-4 text-zinc-600">{inv.customer?.fullName || "—"}</td>
                      <td className="px-6 py-4 text-zinc-600">{inv.project?.title || "—"}</td>
                      <td className="px-6 py-4 text-zinc-700 font-medium">Rs. {inv.total.toLocaleString()}</td>
                      <td className="px-6 py-4 text-zinc-600">{formatDate(inv.issuedDate)}</td>
                      <td className="px-6 py-4 text-zinc-600">{formatDate(inv.dueDate)}</td>
                      <td className="px-6 py-4"><StatusBadge status={inv.status} /></td>
                      <td className="px-6 py-4">
                        <RowActions
                          onEdit={() => handleEdit(inv)}
                          onDelete={() => handleDelete(inv.id)}
                        />
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
                    </div>
                    <StatusBadge status={inv.status} />
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
                  <RowActions
                    variant="buttons"
                    onEdit={() => handleEdit(inv)}
                    onDelete={() => handleDelete(inv.id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

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
    </div>
  );
}
