"use client";

import { useState, useTransition } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Folder, Plus, FileText, FileEdit, Search } from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { RowActions } from "@/components/RowActions";
import { Pagination } from "@/components/Pagination";
import { ProjectModal } from "@/components/ProjectModal";
import { getProjects, deleteProject } from "@/app/actions/projects";

type SelectOption = { id: string; label: string };

type Project = {
  id: string;
  title: string;
  description: string | null;
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

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

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
    if (!confirm("Are you sure you want to delete this project?")) return;
    const result = await deleteProject(id);
    if (result.success) {
      refresh();
    }
  }

  // Client-side search filter
  const filtered = search.trim()
    ? data.projects.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          (p.customer?.fullName.toLowerCase().includes(search.toLowerCase())) ||
          (p.service?.serviceName.toLowerCase().includes(search.toLowerCase()))
      )
    : data.projects;

  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar />
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader
          title="Projects / Portfolio"
          description="Manage your Portfolio Projects."
        />
        <div className="flex items-center gap-3">
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

      {/* Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-black">Projects</h2>
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

      {/* Projects Table/Cards */}
      <Card noPadding className="overflow-hidden">
        {isPending ? (
          <div className="flex items-center justify-center p-12 text-sm text-zinc-500">
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
            <Folder className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">
              {search ? "No projects match your search" : "No projects yet. Add your first project!"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-4 text-sm font-semibold text-gray-700 w-16">#</th>
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
                          onEdit={() => handleEdit(project)}
                          onDelete={() => handleDelete(project.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden divide-y divide-gray-100">
              {filtered.map((project, index) => (
                <div key={project.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-xs sm:text-sm text-gray-500 font-medium w-8">
                      {String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">
                        {project.service?.serviceName || "No service"}
                      </p>
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

                  <RowActions
                    variant="buttons"
                    onEdit={() => handleEdit(project)}
                    onDelete={() => handleDelete(project.id)}
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

      {/* Project Modal */}
      <ProjectModal
        key={editingProject?.id ?? "new"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => refresh()}
        project={editingProject}
        customers={customers}
        teams={teams}
        services={services}
      />
    </div>
  );
}
