"use client";

import { useState, useTransition } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Users, UserCheck, UserX, Plus, Search, List, LayoutGrid, Mail } from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { RowActions } from "@/components/RowActions";
import { Pagination } from "@/components/Pagination";
import { AddCustomerModal } from "@/components/AddcostumerModal";
import { EditCustomerModal, type CustomerRow } from "@/components/EditCustomerModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { getCustomers, deleteCustomer } from "@/app/actions/customers";

type SelectOption = { id: string; label: string };

type Customer = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  companyName: string | null;
  address: string | null;
  image: string;
  status: string;
  serviceId: string | null;
  service: { id: string; serviceName: string } | null;
  createdAt: Date;
  updatedAt: Date;
};

type CustomersData = {
  customers: Customer[];
  total: number;
  active: number;
  inactive: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

const PAGE_SIZE = 10;

export function CustomersClient({
  initialData,
  services = [],
}: {
  initialData: CustomersData;
  services?: SelectOption[];
}) {
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(initialData.page);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<"list" | "card">("list");

  // Modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<CustomerRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function refresh(page = currentPage) {
    startTransition(async () => {
      const freshData = await getCustomers(page, PAGE_SIZE);
      setData({
        customers: freshData.customers as Customer[],
        total: freshData.total,
        active: (freshData.customers as Customer[]).filter((c) => c.status === "Active").length,
        inactive: (freshData.customers as Customer[]).filter((c) => c.status === "Inactive").length,
        page,
        pageSize: PAGE_SIZE,
        pageCount: freshData.pageCount,
      });
    });
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    refresh(page);
  }

  async function handleDelete(id: string) {
    setDeleteId(id);
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    setData((prev) => ({
      ...prev,
      customers: prev.customers.filter((c) => c.id !== deleteId),
      total: prev.total - 1,
    }));
    const result = await deleteCustomer(deleteId);
    setDeleteId(null);
    if (!result.success) {
      refresh();
    }
  }

  const filtered = search.trim()
    ? data.customers.filter(
        (c) =>
          c.fullName.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          (c.companyName && c.companyName.toLowerCase().includes(search.toLowerCase())) ||
          (c.service?.serviceName.toLowerCase().includes(search.toLowerCase()))
      )
    : data.customers;

  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar showSearch={false} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader
          title="Customers"
          description="Manage your customers."
        />
        <div className="flex items-center gap-3">
          <Button onClick={() => setAddOpen(true)}>
            Add Customer
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        <StatCard icon={Users} label="Total Customers" value={data.total} />
        <StatCard icon={UserCheck} label="Active" value={data.active} />
        <StatCard icon={UserX} label="Inactive" value={data.inactive} />
      </div>

      {/* Search + View Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-black">Customers</h2>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="hidden sm:flex items-center rounded-lg border border-gray-200 bg-white p-1">
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
              placeholder="Search customers..."
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
            <Users className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">
              {search ? "No customers match your search" : "No customers yet. Add your first customer!"}
            </p>
          </div>
        </Card>
      ) : viewMode === "list" ? (
        /* ─── List View (Table) ─── */
        <Card noPadding className="overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 w-16">#</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Customer</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Phone</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Service</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer, index) => (
                  <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-600">
                      {String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={customer.image} alt={customer.fullName} className="h-9 w-9 rounded-full object-cover" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{customer.fullName}</p>
                          {customer.companyName && <p className="text-xs text-gray-400">{customer.companyName}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{customer.email}</td>
                    <td className="p-4 text-sm text-gray-600">{customer.phoneNumber || "—"}</td>
                    <td className="p-4 text-sm text-gray-600">{customer.service?.serviceName || "—"}</td>
                    <td className="p-4">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                        customer.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <RowActions
                        onEdit={() => setEditCustomer({
                          id: customer.id,
                          fullName: customer.fullName,
                          email: customer.email,
                          phoneNumber: customer.phoneNumber,
                          address: customer.address,
                          servicesId: customer.serviceId,
                          companyName: customer.companyName,
                          status: customer.status,
                          image: customer.image,
                        })}
                        onDelete={() => handleDelete(customer.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile fallback */}
          <div className="sm:hidden divide-y divide-gray-100">
            {filtered.map((customer, index) => (
              <div key={customer.id} className="p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-xs text-gray-500 font-medium w-6">
                    {String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={customer.image} alt={customer.fullName} className="h-8 w-8 rounded-full object-cover" />
                      <h3 className="font-semibold text-sm text-gray-900">{customer.fullName}</h3>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{customer.email}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      customer.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {customer.status}
                    </span>
                  </div>
                </div>
                <RowActions
                  variant="buttons"
                  onEdit={() => setEditCustomer({
                    id: customer.id,
                    fullName: customer.fullName,
                    email: customer.email,
                    phoneNumber: customer.phoneNumber,
                    address: customer.address,
                    servicesId: customer.serviceId,
                    companyName: customer.companyName,
                    status: customer.status,
                    image: customer.image,
                  })}
                  onDelete={() => handleDelete(customer.id)}
                />
              </div>
            ))}
          </div>
        </Card>
      ) : (
        /* ─── Card View (Grid) ─── */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((customer) => (
            <div
              key={customer.id}
              className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={customer.image} alt={customer.fullName} className="h-14 w-14 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 truncate">{customer.fullName}</h3>
                  {customer.companyName && <p className="text-xs text-gray-400 truncate">{customer.companyName}</p>}
                  <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-[11px] font-medium ${
                    customer.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {customer.status}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-xs text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </div>
                {customer.phoneNumber && (
                  <p>Phone: <span className="text-gray-800">{customer.phoneNumber}</span></p>
                )}
                {customer.service && (
                  <p>Service: <span className="text-gray-800">{customer.service.serviceName}</span></p>
                )}
              </div>

              {/* Actions */}
              <RowActions
                variant="buttons"
                onEdit={() => setEditCustomer({
                  id: customer.id,
                  fullName: customer.fullName,
                  email: customer.email,
                  phoneNumber: customer.phoneNumber,
                  address: customer.address,
                  servicesId: customer.serviceId,
                  companyName: customer.companyName,
                  status: customer.status,
                  image: customer.image,
                })}
                onDelete={() => handleDelete(customer.id)}
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

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={() => { setAddOpen(false); refresh(); }}
        services={services.map((s) => ({ id: s.id, serviceName: s.label }))}
      />

      {/* Edit Customer Modal */}
      <EditCustomerModal
        isOpen={!!editCustomer}
        customer={editCustomer}
        services={services.map((s) => ({ id: s.id, serviceName: s.label }))}
        onClose={() => setEditCustomer(null)}
        onSuccess={() => { setEditCustomer(null); refresh(); }}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? This action cannot be undone."
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
