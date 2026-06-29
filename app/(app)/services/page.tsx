"use client";

import {
  Eye,
  Filter,
  Pencil,
  Plus,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { AddServiceModal } from "@/components/AddServiceModal";

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
  { label: "Total Services", value: 12, icon: Users, accent: true },
  { label: "Active Services", value: 10, icon: Users, accent: true },
  { label: "Inactive Services", value: 2, icon: User, accent: false },
];

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof Users;
  accent: boolean;
}) {
  return (
    <div className="flex items-center gap-5 rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full ${
          accent ? "bg-sky-50 text-zinc-700" : "bg-zinc-100 text-zinc-700"
        }`}
      >
        <Icon className="h-7 w-7" strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-3xl font-bold text-zinc-900 dark:text-white">
          {value}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      </div>
    </div>
  );
}

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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Services
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Manage all your services
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            Add Services
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Services panel header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/5">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Services
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-white/5">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr className="text-left text-sm font-bold text-zinc-900 dark:text-white">
              <th className="px-4 py-4">#</th>
              <th className="px-4 py-4">Thumbnail</th>
              <th className="px-4 py-4">Title</th>
              <th className="px-4 py-4">Short Details</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr
                key={service.id}
                className="text-sm text-zinc-600 dark:text-zinc-300"
              >
                <td className="px-4 py-3">{service.id}</td>
                <td className="px-4 py-3">
                  <div className="h-9 w-12 rounded-md bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600" />
                </td>
                <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-100">
                  {service.title}
                </td>
                <td className="px-4 py-3">{service.details}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={service.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-4 text-zinc-500">
                    <button type="button" className="hover:text-zinc-800" aria-label="View">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button type="button" className="hover:text-zinc-800" aria-label="Edit">
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button type="button" className="text-red-500 hover:text-red-600" aria-label="Delete">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / pagination */}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
          Showing 1 to 5 of 10 entries
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-sm font-medium text-white"
          >
            1
          </button>
          {[2, 3].map((page) => (
            <button
              key={page}
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-zinc-600 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/5"
            >
              {page}
            </button>
          ))}
          <span className="px-1 text-zinc-400">...</span>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-zinc-600 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/5"
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      </div>

      <AddServiceModal open={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}
