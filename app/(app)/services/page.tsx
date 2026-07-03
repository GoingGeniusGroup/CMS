"use client";

import {
  Filter,
  Plus,
  Layers,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AddServiceModal } from "@/components/AddServiceModal";
import { EditServiceModal, type ServiceRow } from "@/components/EditServiceModal";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { RowActions } from "@/components/RowActions";
import { Pagination } from "@/components/Pagination";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { getServicesPaginated, deleteService } from "@/app/actions/services";

type Service = {
  id: string;
  serviceName: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
};

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-medium ${
        isActive
          ? "bg-emerald-100 text-emerald-600"
          : "bg-red-100 text-red-500"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

export default function ServicesPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ServiceRow | null>(null);
  const [page, setPage] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);
  const [inactive, setInactive] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const loadServices = useCallback(async () => {
    const data = await getServicesPaginated(page);
    setServices(data.services as Service[]);
    setTotal(data.total);
    setActive(data.active);
    setInactive(data.inactive);
    setPageCount(data.pageCount);
  }, [page]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteService(deleteTarget.id);
    await loadServices();
  };

  const stats = [
    { label: "Total Services", value: total, icon: Layers },
    { label: "Active Services", value: active, icon: CheckCircle2 },
    { label: "Inactive Services", value: inactive, icon: XCircle },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar showSearch={false} />
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader title="Services" description="Manage all your services." />
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button onClick={() => setIsAddOpen(true)}>
            Add Service
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Table */}
      <Card noPadding className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6">
          <h2 className="text-lg font-bold text-black">Services</h2>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-zinc-500">
                <th className="px-6 py-4 font-medium">#</th>
                <th className="px-6 py-4 font-medium">Thumbnail</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Short Details</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-zinc-400"
                  >
                    No services found. Add your first service!
                  </td>
                </tr>
              ) : (
                services.map((service, idx) => (
                  <tr
                    key={service.id}
                    className="border-b border-gray-50 text-sm text-zinc-600 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {(page - 1) * 10 + idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-10 w-14 rounded-md bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600" />
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-800">
                      {service.serviceName}
                    </td>
                    <td className="px-6 py-4">
                      {service.description ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge isActive={service.isActive} />
                    </td>
                    <td className="px-6 py-4">
                      <RowActions
                        onEdit={() => setEditTarget(service)}
                        onDelete={() => setDeleteTarget(service)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden divide-y divide-gray-100">
          {services.length === 0 ? (
            <p className="p-6 text-center text-sm text-zinc-400">
              No services found. Add your first service!
            </p>
          ) : (
            services.map((service, idx) => (
              <div
                key={service.id}
                className="p-3 sm:p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-xs sm:text-sm text-gray-500 font-medium w-6 pt-1">
                    {(page - 1) * 10 + idx + 1}
                  </div>
                  <div className="h-12 w-16 sm:h-14 sm:w-20 shrink-0 rounded-md bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">
                      {service.serviceName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      {service.description ?? "—"}
                    </p>
                    <StatusBadge isActive={service.isActive} />
                  </div>
                </div>
                <RowActions
                  variant="buttons"
                  onEdit={() => setEditTarget(service)}
                  onDelete={() => setDeleteTarget(service)}
                />
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Footer / pagination */}
      <Pagination
        page={page}
        pageCount={pageCount}
        rangeLabel={`Showing ${Math.min((page - 1) * 10 + 1, total)}–${Math.min(page * 10, total)} of ${total} entries`}
        onPageChange={setPage}
      />

      {/* Edit modal */}
      <EditServiceModal
        open={!!editTarget}
        service={editTarget}
        onClose={() => setEditTarget(null)}
        onSuccess={loadServices}
      />

      {/* Add modal */}
      <AddServiceModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={loadServices}
      />

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Service"
        description={`Are you sure you want to delete "${deleteTarget?.serviceName}"? This action cannot be undone.`}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
