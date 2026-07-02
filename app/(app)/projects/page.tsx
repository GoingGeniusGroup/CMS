"use client";

import { PageHeader } from "@/components/PageHeader";
import { Folder, Filter, Plus, FileText, FileEdit } from "lucide-react";
import { useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { RowActions } from "@/components/RowActions";
import { Pagination } from "@/components/Pagination";

type Project = {
  id: number;
  thumbnail: string;
  title: string;
  category: string;
  status: "Published" | "Draft";
};

const stats = [
  {
    icon: Folder,
    label: "Total Projects",
    value: "16",
  },
  {
    icon: FileText,
    label: "Published",
    value: "28",
  },
  {
    icon: FileEdit,
    label: "Drafts",
    value: "4",
  }
];

const initialProjects: Project[] = [
  {
    id: 1,
    thumbnail: "🛒",
    title: "E-Commerce Websites",
    category: "Web Development",
    status: "Published"
  },
  {
    id: 2,
    thumbnail: "💼",
    title: "Business Landing Page",
    category: "Web Design",
    status: "Published"
  },
  {
    id: 3,
    thumbnail: "📱",
    title: "Finance Mobile App",
    category: "Mobile App",
    status: "Draft"
  },
  {
    id: 4,
    thumbnail: "🎨",
    title: "Brand Design",
    category: "Branding",
    status: "Published"
  },
  {
    id: 5,
    thumbnail: "🔍",
    title: "SEO Campaign Project",
    category: "SEO",
    status: "Published"
  }
];

export default function ProjectsPage() {
  const [projects] = useState(initialProjects);
  const [currentPage, setCurrentPage] = useState(1);
  const totalEntries = 32;

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
          <Button variant="secondary">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button>
            Add Projects
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Projects Table/Cards */}
      <Card noPadding className="overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 text-sm font-semibold text-gray-700 w-16">#</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Thumbnail</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Title</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Category</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm text-gray-600">
                    {String(index + 1).padStart(2, '0')}
                  </td>
                  <td className="p-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                      {project.thumbnail}
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900">{project.title}</td>
                  <td className="p-4 text-sm text-gray-600">{project.category}</td>
                  <td className="p-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${project.status === "Published"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <RowActions />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden divide-y divide-gray-100">
          {projects.map((project, index) => (
            <div key={project.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                <div className="text-xs sm:text-sm text-gray-500 font-medium w-8">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  {project.thumbnail}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">{project.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">{project.category}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${project.status === "Published"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}>
                    {project.status}
                  </span>
                </div>
              </div>

              <RowActions variant="buttons" />
            </div>
          ))}
        </div>
      </Card>

      {/* Pagination */}
      <Pagination
        page={currentPage}
        pageCount={3}
        rangeLabel={`Showing 1 to 5 of ${totalEntries} entries`}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
