"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import {
  updateApplicationStatus,
  deleteJobApplication,
  type JobApplicationRow,
} from "@/app/actions/job-applications";

const STATUS_OPTIONS = ["New", "Reviewed", "Shortlisted", "Rejected"];
const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-50 text-blue-700",
  Reviewed: "bg-amber-50 text-amber-700",
  Shortlisted: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-700",
};

function timeAgo(date: Date | string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

type Job = { id: string; title: string; department: string };

export function ApplicantsClient({
  initialApplications,
  stats,
  jobs,
}: {
  initialApplications: JobApplicationRow[];
  stats: { total: number; new: number; reviewed: number; shortlisted: number; rejected: number };
  jobs: Job[];
}) {
  const [applications, setApplications] = useState<JobApplicationRow[]>(initialApplications);
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<JobApplicationRow | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = applications.filter((app) => {
    const matchesSearch = !search.trim() ||
      app.fullName.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(search.toLowerCase());
    const matchesJob = jobFilter === "all" || app.jobId === jobFilter;
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesJob && matchesStatus;
  });

  async function handleStatusChange(id: string, newStatus: string) {
    setIsUpdating(true);
    const result = await updateApplicationStatus(id, newStatus);
    if (result.success) {
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
      if (selectedApp?.id === id) setSelectedApp((prev) => prev ? { ...prev, status: newStatus } : null);
    }
    setIsUpdating(false);
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    const result = await deleteJobApplication(deleteId);
    if (result.success) {
      setApplications((prev) => prev.filter((a) => a.id !== deleteId));
      if (selectedApp?.id === deleteId) setSelectedApp(null);
    }
    setDeleteId(null);
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar showSearch={false} />

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader title="Applicants" description="View and manage all job applications." />
        <Link
          href="/careers"
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          ← Back to Vacancies
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={Users} label="Total" value={stats.total} />
        <StatCard icon={Users} label="New" value={stats.new} />
        <StatCard icon={Users} label="Reviewed" value={stats.reviewed} />
        <StatCard icon={Users} label="Shortlisted" value={stats.shortlisted} />
        <StatCard icon={Users} label="Rejected" value={stats.rejected} />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            placeholder="Search by name, email, or job..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-700 placeholder:text-zinc-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700"
        >
          <option value="all">All Jobs</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>{j.title}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700"
        >
          <option value="all">All Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Applications List */}
      <Card noPadding className="overflow-hidden">
        <div className="border-b border-zinc-100 px-6 py-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-900">
            Applications ({filtered.length})
          </h3>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Users className="h-10 w-10 text-zinc-200" />
            <p className="text-sm text-zinc-500">No applications found.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {filtered.map((app) => (
              <div
                key={app.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 transition-colors"
              >
                {/* Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                  {app.fullName.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-900 truncate">{app.fullName}</p>
                  <p className="text-xs text-zinc-500 truncate">
                    Applied for <span className="font-medium text-zinc-700">{app.jobTitle}</span>
                    {app.jobDepartment && ` · ${app.jobDepartment}`}
                  </p>
                </div>

                {/* Status badge */}
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${STATUS_COLORS[app.status] || "bg-zinc-100 text-zinc-600"}`}>
                  {app.status}
                </span>

                {/* Time */}
                <span className="shrink-0 text-xs text-zinc-400 hidden sm:block">
                  {timeAgo(app.createdAt)}
                </span>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedApp(app)}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(app.id)}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-500"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setSelectedApp(null)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-700"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-lg font-bold text-zinc-900">{selectedApp.fullName}</h2>
            <p className="mt-1 text-sm text-zinc-500">Applied for <span className="font-medium">{selectedApp.jobTitle}</span></p>

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Mail className="h-4 w-4 text-zinc-400" /> {selectedApp.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Phone className="h-4 w-4 text-zinc-400" /> {selectedApp.phone}
              </div>
              {selectedApp.location && (
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <MapPin className="h-4 w-4 text-zinc-400" /> {selectedApp.location}
                </div>
              )}
              {selectedApp.currentPosition && (
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Briefcase className="h-4 w-4 text-zinc-400" /> {selectedApp.currentPosition}
                </div>
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {selectedApp.experienceLevel && (
                <div className="rounded-lg bg-zinc-50 p-3">
                  <p className="text-[10px] font-bold uppercase text-zinc-400">Experience Level</p>
                  <p className="mt-0.5 text-sm font-semibold text-zinc-800">{selectedApp.experienceLevel}</p>
                </div>
              )}
              {selectedApp.totalExperience && (
                <div className="rounded-lg bg-zinc-50 p-3">
                  <p className="text-[10px] font-bold uppercase text-zinc-400">Total Experience</p>
                  <p className="mt-0.5 text-sm font-semibold text-zinc-800">{selectedApp.totalExperience}</p>
                </div>
              )}
              {selectedApp.expectedSalary && (
                <div className="rounded-lg bg-zinc-50 p-3">
                  <p className="text-[10px] font-bold uppercase text-zinc-400">Expected Salary</p>
                  <p className="mt-0.5 text-sm font-semibold text-zinc-800">{selectedApp.expectedSalary}</p>
                </div>
              )}
            </div>

            {selectedApp.skills && (
              <div className="mt-4">
                <p className="text-xs font-bold text-zinc-500 mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApp.skills.split(",").map((s) => (
                    <span key={s.trim()} className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedApp.coverLetter && (
              <div className="mt-4">
                <p className="text-xs font-bold text-zinc-500 mb-1">Cover Letter / Why Join</p>
                <p className="text-sm text-zinc-600 whitespace-pre-wrap">{selectedApp.coverLetter}</p>
              </div>
            )}

            {/* Status Change */}
            <div className="mt-6 border-t border-zinc-100 pt-4">
              <p className="text-xs font-bold text-zinc-500 mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleStatusChange(selectedApp.id, s)}
                    disabled={isUpdating || selectedApp.status === s}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 ${
                      selectedApp.status === s
                        ? "bg-indigo-600 text-white"
                        : "border border-zinc-200 text-zinc-600 hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Delete Application"
        description="Are you sure you want to delete this application? This action cannot be undone."
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
