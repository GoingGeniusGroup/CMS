"use client";

import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { RowActions } from "@/components/RowActions";
import { Pagination } from "@/components/Pagination";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { ViewDetailModal } from "@/components/ViewDetailModal";
import { AddVacancyModal, type VacancyFormData } from "@/components/AddVacancyModal";
import { EditVacancyModal, type JobVacancyRow } from "@/components/EditVacancyModal";
import { ViewApplicantsModal, type Applicant } from "@/components/ViewApplicantsModal";
import { getJobs, createJob, updateJob, deleteJob } from "@/app/actions/jobs";

import {
  Briefcase,
  Plus,
  CheckCircle2,
  XCircle,
  Users,
  Search,
  List,
  LayoutGrid,
  Loader2,
  Filter,
} from "lucide-react";

const PAGE_SIZE = 10;

export function CareersClient() {
  const [vacancies, setVacancies] = useState<JobVacancyRow[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);
  const [inactive, setInactive] = useState(0);

  // Modal states
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<JobVacancyRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<JobVacancyRow | null>(null);
  const [applicantsTarget, setApplicantsTarget] = useState<JobVacancyRow | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    const result = await getJobs(currentPage, PAGE_SIZE);
    setVacancies(result.jobs.map((j) => ({ ...j, deadline: j.deadline || "" })));
    setTotal(result.total);
    setActive(result.active);
    setInactive(result.inactive);
    setLoading(false);
  };

  // Guard against React StrictMode's double effect invocation in dev: only
  // fetch when the page actually changes, so getJobs fires once per page.
  const lastFetchedPage = useRef<number | null>(null);
  useEffect(() => {
    if (lastFetchedPage.current === currentPage) return;
    lastFetchedPage.current = currentPage;
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleCreateVacancy = async (formData: VacancyFormData) => {
    const result = await createJob({
      title: formData.title,
      department: formData.department,
      type: formData.type,
      mode: formData.mode,
      location: formData.location,
      salaryRange: formData.salaryRange,
      experience: formData.experience,
      vacanciesCount: formData.vacanciesCount,
      deadline: formData.deadline || null,
      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      description: formData.description,
      responsibilities: formData.responsibilities.split("\n").filter(Boolean),
      requirements: formData.requirements.split("\n").filter(Boolean),
      thumbnailUrl: formData.thumbnailUrl || "",
    });
    if (result.success) {
      setAddOpen(false);
      fetchJobs();
    }
  };

  const handleUpdateVacancy = async (updated: JobVacancyRow) => {
    const result = await updateJob(updated.id, {
      title: updated.title,
      department: updated.department,
      type: updated.type,
      mode: updated.mode,
      location: updated.location,
      salaryRange: updated.salaryRange,
      experience: updated.experience,
      vacanciesCount: updated.vacanciesCount,
      deadline: updated.deadline || null,
      isActive: updated.isActive,
      isFeatured: updated.isFeatured,
      tags: updated.tags,
      description: updated.description,
      responsibilities: updated.responsibilities,
      requirements: updated.requirements,
      thumbnailUrl: updated.thumbnailUrl || "",
    });
    if (result.success) {
      setEditTarget(null);
      fetchJobs();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    const result = await deleteJob(deleteId);
    if (result.success) {
      setDeleteId(null);
      fetchJobs();
    }
  };

  const handleUpdateApplicantStatus = (applicantId: string, newStatus: Applicant["status"]) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === applicantId ? { ...a, status: newStatus } : a))
    );
  };

  const departments = [...new Set(vacancies.map((v) => v.department).filter(Boolean))] as string[];
  const types = [...new Set(vacancies.map((v) => v.type).filter(Boolean))] as string[];
  const modes = [...new Set(vacancies.map((v) => v.mode).filter(Boolean))] as string[];

  const filtered = vacancies.filter((v) => {
    const matchesSearch = !search.trim() ||
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.department.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || (statusFilter === "Active" ? v.isActive : !v.isActive);
    const matchesDept = deptFilter === "all" || v.department === deptFilter;
    const matchesType = typeFilter === "all" || v.type === typeFilter;
    const matchesMode = modeFilter === "all" || v.mode === modeFilter;
    return matchesSearch && matchesStatus && matchesDept && matchesType && matchesMode;
  });

  const pageCount = Math.ceil(total / PAGE_SIZE) || 1;
  const paginated = filtered;

  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar showSearch={false} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader
          title="Careers"
          description="Manage all your career vacancies."
        />
        <div className="flex items-center gap-3">
          <div className="relative" ref={filterRef}>
            <Button variant="secondary" onClick={() => setFilterOpen((v) => !v)}>
              <Filter className="h-4 w-4" />
              Filter{(statusFilter !== "all" || deptFilter !== "all" || typeFilter !== "all" || modeFilter !== "all") ? " (1)" : ""}
            </Button>
            {filterOpen && (
              <div className="absolute max-md:left-0 max-md:right-auto md:right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                <p className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</p>
                {["all", "Active", "Inactive"].map((s) => (
                  <button key={s} type="button" onClick={() => { setStatusFilter(s); setFilterOpen(false); }}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${statusFilter === s ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>
                    {s === "all" ? "All Statuses" : s}
                  </button>
                ))}
                <div className="my-2 border-t border-gray-100" />
                <p className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</p>
                <button type="button" onClick={() => { setDeptFilter("all"); setFilterOpen(false); }}
                  className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${deptFilter === "all" ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>All Departments</button>
                {departments.map((d) => (
                  <button key={d} type="button" onClick={() => { setDeptFilter(d); setFilterOpen(false); }}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${deptFilter === d ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>{d}</button>
                ))}
                <div className="my-2 border-t border-gray-100" />
                <p className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</p>
                <button type="button" onClick={() => { setTypeFilter("all"); setFilterOpen(false); }}
                  className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${typeFilter === "all" ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>All Types</button>
                {types.map((t) => (
                  <button key={t} type="button" onClick={() => { setTypeFilter(t); setFilterOpen(false); }}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${typeFilter === t ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>{t}</button>
                ))}
                <div className="my-2 border-t border-gray-100" />
                <p className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mode</p>
                <button type="button" onClick={() => { setModeFilter("all"); setFilterOpen(false); }}
                  className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${modeFilter === "all" ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>All Modes</button>
                {modes.map((m) => (
                  <button key={m} type="button" onClick={() => { setModeFilter(m); setFilterOpen(false); }}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${modeFilter === m ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>{m}</button>
                ))}
              </div>
            )}
          </div>
          <Button onClick={() => setAddOpen(true)}>
            Add Vacancy
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        <StatCard icon={Briefcase} label="Total Vacancies" value={total} />
        <StatCard icon={CheckCircle2} label="Active" value={active} />
        <StatCard icon={XCircle} label="Inactive" value={inactive} />
      </div>

      {/* Search + View Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-black">Vacancies</h2>
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
              placeholder="Search vacancies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-700 shadow-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-200"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Card>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card noPadding className="overflow-hidden">
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
            <Briefcase className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">
              {search ? "No vacancies match your search" : "No vacancies yet. Add your first vacancy!"}
            </p>
          </div>
        </Card>
      ) : viewMode === "list" ? (
        /* List View (Table) */
        <Card noPadding className="overflow-hidden">
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 w-16">#</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Job Title</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Department</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Type / Mode</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Salary</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Applicants</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-600">
                      {String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-900">{item.title}</td>
                    <td className="p-4 text-sm text-gray-600">{item.department}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {item.type} ({item.mode})
                    </td>
                    <td className="p-4 text-sm text-gray-600">{item.salaryRange}</td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => setApplicantsTarget(item)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                      >
                        <Users className="h-3.5 w-3.5" />
                        {item.applicantsCount} Candidates
                      </button>
                    </td>
                    <td className="p-4">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                        item.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <RowActions
                        onView={() => setViewItem(item)}
                        onEdit={() => setEditTarget(item)}
                        onDelete={() => setDeleteId(item.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Fallback */}
          <div className="sm:hidden divide-y divide-gray-100">
            {paginated.map((item, index) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-xs text-gray-500 font-medium">
                    #{String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-gray-900">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.department} &bull; {item.type} ({item.mode})</p>
                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setApplicantsTarget(item)}
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    {item.applicantsCount} Applicants
                  </button>
                  <RowActions
                    onView={() => setViewItem(item)}
                    onEdit={() => setEditTarget(item)}
                    onDelete={() => setDeleteId(item.id)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100">
            <Pagination
              page={currentPage}
              pageCount={pageCount}
              rangeLabel={`Showing ${paginated.length} of ${total} vacancies`}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </div>
        </Card>
      ) : (
        /* Card View */
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((item) => (
              <Card key={item.id} className="flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-indigo-600">{item.department}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500">{item.type} &bull; {item.mode} &bull; {item.location}</p>
                  <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.salaryRange}</span>
                    <button
                      type="button"
                      onClick={() => setApplicantsTarget(item)}
                      className="font-bold text-indigo-600 hover:underline"
                    >
                      {item.applicantsCount} Candidates
                    </button>
                  </div>
                  <RowActions
                    variant="buttons"
                    onView={() => setViewItem(item)}
                    onEdit={() => setEditTarget(item)}
                    onDelete={() => setDeleteId(item.id)}
                  />
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <Pagination
              page={currentPage}
              pageCount={pageCount}
              rangeLabel={`Showing ${paginated.length} of ${total} vacancies`}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </Card>
        </div>
      )}

      {/* Modals */}
      <AddVacancyModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={handleCreateVacancy}
      />

      <EditVacancyModal
        open={!!editTarget}
        vacancy={editTarget}
        onClose={() => setEditTarget(null)}
        onSuccess={handleUpdateVacancy}
      />

      <ViewDetailModal
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem?.title ?? "Vacancy Details"}
        imageUrl={viewItem?.thumbnailUrl}
        fields={[
          { label: "Job Title", value: viewItem?.title },
          { label: "Department", value: viewItem?.department },
          { label: "Employment Type", value: viewItem?.type },
          { label: "Work Mode", value: viewItem?.mode },
          { label: "Location", value: viewItem?.location },
          { label: "Salary Range", value: viewItem?.salaryRange },
          { label: "Experience", value: viewItem?.experience },
          { label: "Open Vacancies", value: viewItem?.vacanciesCount },
          { label: "Application Deadline", value: viewItem?.deadline },
          { label: "Status", value: viewItem?.isActive ? "Active" : "Inactive" },
          { label: "Featured", value: viewItem?.isFeatured ? "Yes" : "No" },
          { label: "Skills / Tags", value: viewItem?.tags?.join(", ") },
          { label: "Description", value: viewItem?.description },
          { label: "Responsibilities", value: viewItem?.responsibilities?.join("\n") },
          { label: "Requirements", value: viewItem?.requirements?.join("\n") },
        ]}
      />

      <ViewApplicantsModal
        vacancy={applicantsTarget}
        applicants={applicants}
        isOpen={!!applicantsTarget}
        onClose={() => setApplicantsTarget(null)}
        onUpdateStatus={handleUpdateApplicantStatus}
      />

      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Delete Job Vacancy"
        description="Are you sure you want to delete this vacancy post? Candidates won't be able to apply anymore."
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
