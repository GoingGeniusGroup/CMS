"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Folder, Plus, FileText, FileEdit, Search, List, LayoutGrid, Filter } from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { RowActions } from "@/components/RowActions";
import { Pagination } from "@/components/Pagination";
import { ProjectModal } from "@/components/ProjectModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { ViewDetailModal } from "@/components/ViewDetailModal";
import { getProjects, deleteProject } from "@/app/actions/projects";

type SelectOption = { id: string; label: string };

type Project = {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  overview: string | null;
  category: string | null;
  liveUrl: string | null;
  customerId: string | null;
  teamId: string | null;
  serviceId: string | null;
  customer: { id: string; fullName: string } | null;
  team: { id: string; fullName: string } | null;
  service: { id: string; serviceName: string } | null;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  budget: number | null;
  thumbnail: string | null;
  gallery: string[];
  highlights: string[];
  challenges: string[];
  solutions: string[];
  technologies: string[];
  features: unknown;
  results: unknown;
  createdAt: Date;
  updatedAt: Date;
};

type ProjectsData = {
  projects: Project[];
  total: number;
  published: number;
  drafts: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

const PAGE_SIZE = 10;

export function ProjectsClient({
  initialData,
  customers = [],
  teams = [],
  services = [],
}: {
  initialData: ProjectsData;
  customers?: SelectOption[];
  teams?: SelectOption[];
  services?: SelectOption[];
}) {
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(initialData.page);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [servicePFilter, setServicePFilter] = useState("all");
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

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<Project | null>(null);

  function refresh(page = currentPage) {
    startTransition(async () => {
      const freshData = await getProjects(page, PAGE_SIZE);
      setData(freshData as ProjectsData);
    });
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    refresh(page);
  }

  function handleAdd() {
    setEditingProject(null);
    setModalOpen(true);
  }

  function handleEdit(project: Project) {
    setEditingProject(project);
    setModalOpen(true);
  }

  async function handleDelete(id: string) {
    setDeleteId(id);
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== deleteId),
      total: prev.total - 1,
    }));
    const result = await deleteProject(deleteId);
    setDeleteId(null);
    if (!result.success) {
      refresh();
    }
  }

  const projectCategories = [...new Set(data.projects.map((p) => p.category).filter(Boolean))] as string[];
  const projectCustomers = [...new Set(data.projects.map((p) => p.customer?.fullName).filter(Boolean))] as string[];
  const projectServices = [...new Set(data.projects.map((p) => p.service?.serviceName).filter(Boolean))] as string[];

  const filtered = data.projects.filter((p) => {
    const matchesSearch = !search.trim() ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.customer?.fullName.toLowerCase().includes(search.toLowerCase())) ||
      (p.service?.serviceName.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchesCustomer = customerFilter === "all" || p.customer?.fullName === customerFilter;
    const matchesService = servicePFilter === "all" || p.service?.serviceName === servicePFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesCustomer && matchesService;
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar showSearch={false} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader
          title="Projects / Portfolio"
          description="Manage your Portfolio Projects."
        />
        <div className="flex items-center gap-3">
          <div className="relative" ref={filterRef}>
            <Button variant="secondary" onClick={() => setFilterOpen((v) => !v)}>
              <Filter className="h-4 w-4" />
              Filter{(statusFilter !== "all" || categoryFilter !== "all" || customerFilter !== "all" || servicePFilter !== "all") ? " (1)" : ""}
            </Button>
            {filterOpen && (
              <div className="absolute max-md:left-0 max-md:right-auto md:right-0 top-full z-20 mt-2 max-h-80 w-56 overflow-y-auto rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                <p className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</p>
                {["all", "Published", "Draft"].map((s) => (
                  <button key={s} type="button" onClick={() => { setStatusFilter(s); setFilterOpen(false); }}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${statusFilter === s ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>
                    {s === "all" ? "All Statuses" : s}
                  </button>
                ))}
                <div className="my-2 border-t border-gray-100" />
                <p className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</p>
                <button type="button" onClick={() => { setCategoryFilter("all"); setFilterOpen(false); }}
                  className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${categoryFilter === "all" ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>All Categories</button>
                {projectCategories.map((c) => (
                  <button key={c} type="button" onClick={() => { setCategoryFilter(c); setFilterOpen(false); }}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${categoryFilter === c ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>{c}</button>
                ))}
                <div className="my-2 border-t border-gray-100" />
                <p className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</p>
                <button type="button" onClick={() => { setCustomerFilter("all"); setFilterOpen(false); }}
                  className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${customerFilter === "all" ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>All Customers</button>
                {projectCustomers.map((c) => (
                  <button key={c} type="button" onClick={() => { setCustomerFilter(c); setFilterOpen(false); }}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${customerFilter === c ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>{c}</button>
                ))}
                <div className="my-2 border-t border-gray-100" />
                <p className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</p>
                <button type="button" onClick={() => { setServicePFilter("all"); setFilterOpen(false); }}
                  className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${servicePFilter === "all" ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>All Services</button>
                {projectServices.map((s) => (
                  <button key={s} type="button" onClick={() => { setServicePFilter(s); setFilterOpen(false); }}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${servicePFilter === s ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>{s}</button>
                ))}
              </div>
            )}
          </div>
          <Button onClick={handleAdd}>
            Add Project
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        <StatCard icon={Folder} label="Total Projects" value={data.total} />
        <StatCard icon={FileText} label="Published" value={data.published} />
        <StatCard icon={FileEdit} label="Drafts" value={data.drafts} />
      </div>

      {/* Search + View Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-black">Projects</h2>
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
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-700 shadow-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-200"
            />
          </div>
        </div>
      </div>

      {/* Projects Content */}
      {filtered.length === 0 && !isPending ? (
        <Card noPadding className="overflow-hidden">
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
            <Folder className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">
              {search ? "No projects match your search" : "No projects yet. Add your first project!"}
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
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 w-20">Thumbnail</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Title</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Customer</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Service</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project, index) => (
                  <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-600">
                      {String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                    </td>
                    <td className="p-4">
                      <div className="h-10 w-10 overflow-hidden rounded-lg bg-zinc-100 border border-zinc-200">
                        {project.thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={project.thumbnail} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-900">{project.title}</td>
                    <td className="p-4 text-sm text-gray-600">{project.customer?.fullName || "—"}</td>
                    <td className="p-4 text-sm text-gray-600">{project.service?.serviceName || "—"}</td>
                    <td className="p-4">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                          project.status === "Published"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <RowActions
                        onView={() => setViewItem(project)}
                        onEdit={() => handleEdit(project)}
                        onDelete={() => handleDelete(project.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile fallback for list view */}
          <div className="sm:hidden divide-y divide-gray-100">
            {filtered.map((project, index) => (
              <div key={project.id} className="p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-xs text-gray-500 font-medium w-6">
                    {String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                  </div>
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-zinc-100 border border-zinc-200">
                    {project.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={project.thumbnail} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">{project.title}</h3>
                    <p className="text-xs text-gray-600 mb-2">{project.service?.serviceName || "No service"}</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === "Published"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
                <RowActions variant="buttons" onView={() => setViewItem(project)} onEdit={() => handleEdit(project)} onDelete={() => handleDelete(project.id)} />
              </div>
            ))}
          </div>
        </Card>
      ) : (
        /* ─── Card View (Grid) ─── */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Thumbnail */}
              <div className="mb-4 aspect-square w-full relative bg-zinc-50 border border-zinc-100 rounded-xl overflow-hidden flex items-center justify-center">
                {project.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600" />
                )}
              </div>

              {/* Title & Status */}
              <div className="mb-3 flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2">
                  {project.title}
                </h3>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium ${
                    project.status === "Published"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              {/* Description */}
              {project.description && (
                <p className="mb-3 text-xs text-gray-500 line-clamp-2">
                  {project.description}
                </p>
              )}

              {/* Meta */}
              <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                {project.customer && (
                  <span>Client: <span className="text-gray-700">{project.customer.fullName}</span></span>
                )}
                {project.service && (
                  <span>Service: <span className="text-gray-700">{project.service.serviceName}</span></span>
                )}
                {project.budget != null && (
                  <span>Budget: <span className="text-gray-700">Rs. {project.budget.toLocaleString()}</span></span>
                )}
              </div>

              {/* Actions */}
              <RowActions
                variant="buttons"
                onView={() => setViewItem(project)}
                onEdit={() => handleEdit(project)}
                onDelete={() => handleDelete(project.id)}
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

      {/* Project Modal */}
      <ProjectModal
        key={editingProject?.id ?? "new"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => { setModalOpen(false); refresh(); }}
        project={editingProject}
        customers={customers}
        services={services}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* View Detail Modal */}
      <ViewDetailModal
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem?.title || ""}
        imageUrl={viewItem?.thumbnail || undefined}
        fields={[
          { label: "Title", value: viewItem?.title },
          { label: "Category", value: viewItem?.category },
          { label: "Status", value: viewItem?.status },
          { label: "Customer", value: viewItem?.customer?.fullName },
          { label: "Service", value: viewItem?.service?.serviceName },
          { label: "Budget", value: viewItem?.budget },
          { label: "Start Date", value: viewItem?.startDate ? new Date(viewItem.startDate).toLocaleDateString() : null },
          { label: "End Date", value: viewItem?.endDate ? new Date(viewItem.endDate).toLocaleDateString() : null },
          { label: "Description", value: viewItem?.description },
        ]}
      />
    </div>
  );
}
