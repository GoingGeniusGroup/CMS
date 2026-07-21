"use client";

import { useState } from "react";
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

import {
  Briefcase,
  Plus,
  CheckCircle2,
  XCircle,
  Users,
  Search,
  List,
  LayoutGrid,
} from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const INITIAL_VACANCIES: JobVacancyRow[] = [
  {
    id: "vac-1",
    title: "Senior Frontend Developer",
    department: "Developer",
    type: "Full-time",
    mode: "Remote",
    location: "Kathmandu / Remote",
    salaryRange: "$65,000 - $85,000 / yr",
    experience: "3-5 years",
    vacanciesCount: 2,
    deadline: "2026-08-30",
    isActive: true,
    isFeatured: true,
    tags: ["React", "TypeScript", "Tailwind", "Next.js"],
    description: "Help us build high-performance, accessible, and beautiful web interfaces for our enterprise core platform using modern tech stacks.",
    responsibilities: [
      "Develop responsive and accessible web applications using React & Next.js",
      "Collaborate with backend engineers to integrate GraphQL & REST APIs",
      "Lead web performance optimizations and code quality standards",
    ],
    requirements: [
      "3+ years experience with React, Next.js, and TypeScript",
      "In-depth mastery of CSS/Tailwind and modern frontend architectures",
    ],
    applicantsCount: 28,
    createdAt: "2026-07-01",
    updatedAt: "2026-07-15",
  },
  {
    id: "vac-2",
    title: "Lead UI/UX Product Designer",
    department: "Design",
    type: "Full-time",
    mode: "Hybrid",
    location: "Kathmandu, Nepal",
    salaryRange: "$50,000 - $70,000 / yr",
    experience: "4+ years",
    vacanciesCount: 1,
    deadline: "2026-08-20",
    isActive: true,
    isFeatured: true,
    tags: ["Figma", "Design System", "User Research"],
    description: "Design intuitive digital product experiences, interactive wireframes, and design systems for enterprise software.",
    responsibilities: [
      "Create high-fidelity wireframes, interactive prototypes, and user flows",
      "Maintain and evolve our design system UI component libraries",
    ],
    requirements: [
      "4+ years experience in product design for web and mobile",
      "Expert knowledge of Figma, auto-layout, and prototyping",
    ],
    applicantsCount: 19,
    createdAt: "2026-07-05",
    updatedAt: "2026-07-16",
  },
  {
    id: "vac-3",
    title: "Backend Software Engineer (Node/Go)",
    department: "Developer",
    type: "Full-time",
    mode: "Remote",
    location: "Remote",
    salaryRange: "$70,000 - $95,000 / yr",
    experience: "3+ years",
    vacanciesCount: 3,
    deadline: "2026-09-10",
    isActive: true,
    isFeatured: false,
    tags: ["Node.js", "PostgreSQL", "Go", "Prisma"],
    description: "Architect and build resilient backend microservices, real-time sync systems, and secure cloud API infrastructure.",
    responsibilities: [
      "Design database models and optimize SQL query performance",
      "Implement RESTful and GraphQL APIs using Node.js & Go",
    ],
    requirements: [
      "3+ years building production backend APIs and relational databases",
    ],
    applicantsCount: 34,
    createdAt: "2026-07-10",
    updatedAt: "2026-07-18",
  },
  {
    id: "vac-4",
    title: "Digital Marketing & SEO Manager",
    department: "Marketing",
    type: "Full-time",
    mode: "On-site",
    location: "Kathmandu, Nepal",
    salaryRange: "$35,000 - $45,000 / yr",
    experience: "2-4 years",
    vacanciesCount: 1,
    deadline: "2026-08-15",
    isActive: true,
    isFeatured: false,
    tags: ["SEO", "Google Ads", "Content Strategy"],
    description: "Drive organic traffic growth, run targeted ad campaigns, and measure client acquisition metrics across digital channels.",
    responsibilities: [
      "Execute technical and content SEO strategies across web properties",
    ],
    requirements: [
      "2+ years experience in digital marketing and SEO growth",
    ],
    applicantsCount: 15,
    createdAt: "2026-07-12",
    updatedAt: "2026-07-12",
  },
  {
    id: "vac-5",
    title: "DevOps & Cloud Systems Engineer",
    department: "Operations",
    type: "Contract",
    mode: "Remote",
    location: "Remote",
    salaryRange: "$80,000 - $110,000 / yr",
    experience: "4+ years",
    vacanciesCount: 1,
    deadline: "2026-09-01",
    isActive: false,
    isFeatured: false,
    tags: ["AWS", "Kubernetes", "Terraform"],
    description: "Manage AWS cloud infrastructure, automate deployment pipelines, and maintain system monitoring.",
    responsibilities: [
      "Manage cloud infrastructure using Terraform and Infrastructure-as-Code",
    ],
    requirements: [
      "4+ years experience with AWS, Kubernetes, and Terraform",
    ],
    applicantsCount: 0,
    createdAt: "2026-07-14",
    updatedAt: "2026-07-14",
  },
];

const INITIAL_APPLICANTS: Applicant[] = [
  {
    id: "app-101",
    vacancyId: "vac-1",
    jobTitle: "Senior Frontend Developer",
    candidateName: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+977 9841234567",
    experienceYears: "4 years",
    currentCompany: "TechCraft Nepal",
    portfolioUrl: "https://github.com",
    resumeName: "Aarav_Sharma_Frontend_CV.pdf",
    status: "Shortlisted",
    appliedDate: "2026-07-10",
    coverNote: "Passionate about React & Next.js performance.",
  },
  {
    id: "app-102",
    vacancyId: "vac-1",
    jobTitle: "Senior Frontend Developer",
    candidateName: "Sneha Shrestha",
    email: "sneha.s@example.com",
    phone: "+977 9801122334",
    experienceYears: "3.5 years",
    currentCompany: "WebStudio Labs",
    portfolioUrl: "https://sneha-dev.me",
    resumeName: "Sneha_Shrestha_Resume.pdf",
    status: "Interviewed",
    appliedDate: "2026-07-12",
    coverNote: "Experienced in building scalable UI components.",
  },
];

const PAGE_SIZE = 10;

export function CareersClient() {
  const [vacancies, setVacancies] = useState<JobVacancyRow[]>(INITIAL_VACANCIES);
  const [applicants, setApplicants] = useState<Applicant[]>(INITIAL_APPLICANTS);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "card">("list");

  // Modal states
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<JobVacancyRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<JobVacancyRow | null>(null);
  const [applicantsTarget, setApplicantsTarget] = useState<JobVacancyRow | null>(null);

  // Stats calculation
  const total = vacancies.length;
  const active = vacancies.filter((v) => v.isActive).length;
  const inactive = vacancies.filter((v) => !v.isActive).length;

  const handleCreateVacancy = (formData: VacancyFormData) => {
    const newVacancy: JobVacancyRow = {
      id: `vac-${Date.now()}`,
      title: formData.title,
      department: formData.department,
      type: formData.type,
      mode: formData.mode,
      location: formData.location,
      salaryRange: formData.salaryRange,
      experience: formData.experience,
      vacanciesCount: formData.vacanciesCount,
      deadline: formData.deadline,
      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      description: formData.description,
      responsibilities: formData.responsibilities.split("\n").filter(Boolean),
      requirements: formData.requirements.split("\n").filter(Boolean),
      thumbnailUrl: formData.thumbnailUrl,
      applicantsCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setVacancies((prev) => [newVacancy, ...prev]);
  };

  const handleUpdateVacancy = (updated: JobVacancyRow) => {
    setVacancies((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setVacancies((prev) => prev.filter((v) => v.id !== deleteId));
    setDeleteId(null);
  };

  const handleUpdateApplicantStatus = (applicantId: string, newStatus: Applicant["status"]) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === applicantId ? { ...a, status: newStatus } : a))
    );
  };

  const filtered = search.trim()
    ? vacancies.filter(
        (v) =>
          v.title.toLowerCase().includes(search.toLowerCase()) ||
          v.department.toLowerCase().includes(search.toLowerCase()) ||
          v.description.toLowerCase().includes(search.toLowerCase())
      )
    : vacancies;

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
      {filtered.length === 0 ? (
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
                <p className="text-xs text-gray-500">{item.department} • {item.type} ({item.mode})</p>
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
              rangeLabel={`Showing ${paginated.length} of ${filtered.length} vacancies`}
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
                  <p className="text-xs text-gray-500">{item.type} • {item.mode} • {item.location}</p>
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
              rangeLabel={`Showing ${paginated.length} of ${filtered.length} vacancies`}
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
