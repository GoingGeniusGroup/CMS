"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Mail, Search, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Pagination } from "@/components/Pagination";
import { AddCustomerModal } from "@/components/AddcostumerModal";
import { EditCustomerModal, type CustomerRow } from "@/components/EditCustomerModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { deleteCustomer } from "@/app/actions/customers";

interface Customer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  services: string | null;
  companyName: string | null;
  status: string;
  image: string;
  invoices: { status: string }[];
}

interface CustomerTableProps {
  customers: Customer[];
  total: number;
  pageCount: number;
  currentPage: number;
  search: string;
}

export function CustomerTable({
  customers,
  total,
  pageCount,
  currentPage,
  search,
}: CustomerTableProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<CustomerRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(search);

  // Navigate helper
  const navigate = useCallback(
    (newPage: number, newSearch?: string) => {
      const q = new URLSearchParams();
      q.set("page", String(newPage));
      if (newSearch ?? searchValue) q.set("search", newSearch ?? searchValue);
      startTransition(() => router.push(`/customer?${q.toString()}`));
    },
    [router, searchValue]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(1, searchValue);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteCustomer(deleteId);
    setDeleteId(null);
    startTransition(() => router.refresh());
  };

  const invoiceLabel = (inv: { status: string }[]) => inv[0]?.status ?? "—";

  return (
    <>
      {/* Toolbar */}
      <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-black">Customer List</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative w-full sm:w-64 lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              type="search"
              placeholder="Search customers..."
              className="w-full rounded-full border border-black/10 bg-white py-2 sm:py-2.5 pl-9 sm:pl-10 pr-4 text-xs sm:text-sm text-zinc-700 shadow-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-200 transition-all"
            />
          </form>

          <Button onClick={() => setIsAddOpen(true)}>
            Add Customer
            <span className="text-base sm:text-lg">+</span>
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {customers.length === 0 && (
        <div className="py-16 text-center text-gray-400 text-sm">
          No customers found. {search && "Try a different search."}
        </div>
      )}

      {/* Desktop Table */}
      {customers.length > 0 && (
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Image", "Name", "Email", "Phone", "Services", "Status", "Invoice", "Actions"].map((h) => (
                  <th key={h} className="text-left p-4 text-sm font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.image} alt={c.fullName} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-gray-900">{c.fullName}</p>
                    {c.companyName && (
                      <p className="text-xs text-gray-400">{c.companyName}</p>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-sky-500 shrink-0" />
                      {c.email}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{c.phoneNumber ?? "—"}</td>
                  <td className="p-4 text-sm text-gray-600">{c.services ?? "—"}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                      }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{invoiceLabel(c.invoices)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View"
                        onClick={() => router.push(`/customer/${c.id}`)}
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                        onClick={() => setEditCustomer(c as CustomerRow)}
                      >
                        <Pencil className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                        onClick={() => setDeleteId(c.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile / Tablet Card View */}
      {customers.length > 0 && (
        <div className="lg:hidden divide-y divide-gray-100">
          {customers.map((c) => (
            <div key={c.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt={c.fullName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900">{c.fullName}</p>
                  {c.companyName && <p className="text-xs text-gray-400">{c.companyName}</p>}
                  <div className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
                    <Mail className="w-3 h-3 text-sky-500" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{c.phoneNumber ?? ""}</p>
                </div>
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium ${c.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                  {c.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <span className="text-gray-400 block">Services</span>
                  <span className="text-gray-700">{c.services ?? "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Invoice</span>
                  <span className="text-gray-700">{invoiceLabel(c.invoices)}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 pt-3 border-t border-gray-100">
                <button
                  onClick={() => router.push(`/customer/${c.id}`)}
                  className="flex-1 p-2 hover:bg-gray-100 rounded-lg flex items-center justify-center gap-1 text-xs text-gray-600"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button
                  onClick={() => setEditCustomer(c as CustomerRow)}
                  className="flex-1 p-2 hover:bg-gray-100 rounded-lg flex items-center justify-center gap-1 text-xs text-gray-600"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => setDeleteId(c.id)}
                  className="flex-1 p-2 hover:bg-red-50 rounded-lg flex items-center justify-center gap-1 text-xs text-red-500"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="px-4 pb-4">
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            rangeLabel={`Showing ${(currentPage - 1) * 10 + 1}–${Math.min(currentPage * 10, total)} of ${total} entries`}
            onPageChange={(p) => navigate(p)}
          />
        </div>
      )}

      {/* Modals */}
      <AddCustomerModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => {
          setIsAddOpen(false);
          startTransition(() => router.refresh());
        }}
      />

      <EditCustomerModal
        isOpen={!!editCustomer}
        customer={editCustomer}
        onClose={() => setEditCustomer(null)}
        onSuccess={() => {
          setEditCustomer(null);
          startTransition(() => router.refresh());
        }}
      />

      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        description="This will permanently delete the customer and cannot be undone."
      />
    </>
  );
}
