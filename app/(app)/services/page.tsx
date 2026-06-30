"use client";

import {
  Filter,
  Plus,
  Layers,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { AddServiceModal } from "@/components/AddServiceModal";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { RowActions } from "@/components/RowActions";
import { Pagination } from "@/components/Pagination";

type Service = {
  id: string;
  title: string;
  details: string;
  status: "Active" | "Pending";
};

const services: Service[] = [
  {
    id: "01",
    title: "Web Development",
    details: "Building responsive and modern websites.",
    status: "Active",
  },
  {
    id: "02",
    title: "UI/UX Design",
    details: "Designing beautiful and user-friendly interfaces.",
    status: "Active",
  },
  {
    id: "03",
    title: "Digital Marketing",
    details: "Grow your brand with our digital strategies.",
    status: "Active",
  },
  {
    id: "04",
    title: "SEO Optimization",
    details: "Improve your ranking and reach more customers.",
    status: "Pending",
  },
  {
    id: "05",
    title: "Content Writing",
    details: "High quality content that engages audience.",
    status: "Active",
  },
];

const stats = [
  { label: "Total Services", value: 12, icon: Layers },
  { label: "Active Services", value: 10, icon: CheckCircle2 },
  { label: "Inactive Services", value: 2, icon: XCircle },
];

function StatusBadge({ status }: { status: Service["status"] }) {
  const active = status === "Active";
  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-medium ${
        active
          ? "bg-emerald-100 text-emerald-600"
          : "bg-red-100 text-red-500"
      }`}
    >
      {status}
    </span>
  );
}

export default function ServicesPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);

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
            Add Services
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
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="border-b border-gray-50 text-sm text-zinc-600 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">{service.id}</td>
                  <td className="px-6 py-4">
                    <div className="h-10 w-14 rounded-md bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600" />
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-800">
                    {service.title}
                  </td>
                  <td className="px-6 py-4">{service.details}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={service.status} />
                  </td>
                  <td className="px-6 py-4">
                    <RowActions />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden divide-y divide-gray-100">
          {services.map((service) => (
            <div key={service.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                <div className="text-xs sm:text-sm text-gray-500 font-medium w-6 pt-1">
                  {service.id}
                </div>
                <div className="h-12 w-16 sm:h-14 sm:w-20 shrink-0 rounded-md bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">{service.details}</p>
                  <StatusBadge status={service.status} />
                </div>
              </div>

              <RowActions variant="buttons" />
            </div>
          ))}
        </div>
      </Card>

      {/* Footer / pagination */}
      <Pagination page={1} pageCount={3} rangeLabel="Showing 1 to 5 of 10 entries" />

      <AddServiceModal open={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}
