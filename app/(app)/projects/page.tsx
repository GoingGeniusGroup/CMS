"use client";

import { PageHeader } from "@/components/PageHeader";
import { Folder, Eye, Pencil, Trash2, Filter } from "lucide-react";
import { useState } from "react";
import { Topbar } from "@/components/Topbar";

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
    bgColor: "bg-blue-50"
  },
  {
    icon: Folder,
    label: "Published",
    value: "28",
    bgColor: "bg-blue-50"
  },
  {
    icon: Folder,
    label: "Drafts",
    value: "4",
    bgColor: "bg-blue-50"
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
    <div className="space-y-4 sm:space-y-6">
      <Topbar />
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
       
        <PageHeader
          title="Projects / Portfolio"
          description="Manage your Portfolio Projects."
        />
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
            Add Projects
            <span className="text-lg">+</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500 mb-1 sm:mb-2">{stat.label}</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Projects Table/Cards */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                        <Pencil className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
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

              <div className="flex items-center gap-1 sm:gap-2 pt-3 border-t border-gray-100">
                <button className="flex-1 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">View</span>
                </button>
                <button className="flex-1 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                  <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button className="flex-1 p-1.5 sm:p-2 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-red-600">
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <p className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
          Showing 1 to 5 of {totalEntries} entries
        </p>
        <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
          <button
            onClick={() => setCurrentPage(1)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${currentPage === 1
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
          >
            1
          </button>
          <button
            onClick={() => setCurrentPage(2)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${currentPage === 2
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
          >
            2
          </button>
          <button
            onClick={() => setCurrentPage(3)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${currentPage === 3
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
          >
            3
          </button>
          <span className="px-2 text-gray-500">...</span>
          <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center text-sm font-medium transition-colors">
            →
          </button>
        </div>
      </div>
    </div>
  );
}
