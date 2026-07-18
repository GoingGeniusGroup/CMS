"use client";

import { useState, useTransition } from "react";
import { Users, User, Filter, Plus, Search, Phone, Mail, List, LayoutGrid } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { RowActions } from "@/components/RowActions";
import { Pagination } from "@/components/Pagination";
import { AddMemberModal, type MemberFormData } from "@/components/AddMemberModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { ViewDetailModal } from "@/components/ViewDetailModal";
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  type TeamMemberInput,
} from "@/app/actions/team";

type TeamMember = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  image: string | null;
  role: string | null;
  department: string | null;
  status: string;
  bio: string | null;
  location: string | null;
  experience: string | null;
  skills: string[];
  joinedAt: Date;
  updatedAt: Date;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  website?: string | null;
};

type TeamData = {
  members: TeamMember[];
  total: number;
  active: number;
  inactive: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

const PAGE_SIZE = 10;

export function TeamClient({ initialData }: { initialData: TeamData }) {
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(initialData.page);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<"list" | "card">("list");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [modalKey, setModalKey] = useState(0);
  const [viewItem, setViewItem] = useState<TeamMember | null>(null);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function refresh(page = currentPage) {
    startTransition(async () => {
      const freshData = await getTeamMembers(page, PAGE_SIZE);
      setData(freshData as TeamData);
    });
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    refresh(page);
  }

  function handleAdd() {
    setEditingMember(null);
    setModalKey((k) => k + 1);
    setModalOpen(true);
  }

  function handleEdit(member: TeamMember) {
    setEditingMember(member);
    setModalKey((k) => k + 1);
    setModalOpen(true);
  }

  function handleDeleteRequest(id: string) {
    setDeleteId(id);
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    // Optimistic: remove from UI immediately
    setData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== deleteId),
      total: prev.total - 1,
      active: prev.members.find((m) => m.id === deleteId)?.status === "Active" ? prev.active - 1 : prev.active,
      inactive: prev.members.find((m) => m.id === deleteId)?.status === "Inactive" ? prev.inactive - 1 : prev.inactive,
    }));
    setDeleteId(null);
    const result = await deleteTeamMember(deleteId);
    if (!result.success) {
      // Revert on failure by re-fetching
      refresh();
    }
  }

  async function handleSubmit(formData: MemberFormData) {
    const input: TeamMemberInput = {
      fullName: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      image: formData.image || undefined,
      role: formData.designation || undefined,
      department: formData.department || undefined,
      status: formData.status as "Active" | "Inactive",
      bio: formData.description || undefined,
      location: formData.location || undefined,
      experience: formData.experience || undefined,
      skills: formData.skills?.filter(Boolean) || undefined,
      facebook: formData.facebook || undefined,
      twitter: formData.twitter || undefined,
      instagram: formData.instagram || undefined,
      linkedin: formData.linkedin || undefined,
      website: formData.website || undefined,
    };

    // Close modal immediately for snappy feel
    setModalOpen(false);
    setEditingMember(null);

    const result = editingMember
      ? await updateTeamMember(editingMember.id, input)
      : await createTeamMember(input);

    if (result.success) {
      refresh();
    } else {
      alert(result.error || "Something went wrong");
    }
  }

  // Client-side search filter
  const filtered = search.trim()
    ? data.members.filter(
        (m) =>
          m.fullName.toLowerCase().includes(search.toLowerCase()) ||
          m.email.toLowerCase().includes(search.toLowerCase()) ||
          (m.role && m.role.toLowerCase().includes(search.toLowerCase())) ||
          (m.department && m.department.toLowerCase().includes(search.toLowerCase()))
      )
    : data.members;

  // Convert DB member to modal's edit format
  const editMemberRecord = editingMember
    ? {
        id: editingMember.id,
        name: editingMember.fullName,
        designation: editingMember.role || "",
        department: editingMember.department || "",
        phone: editingMember.phone || "",
        email: editingMember.email,
        status: (editingMember.status as "Active" | "Inactive") || "Active",
        gender: "male" as const,
        image: editingMember.image,
        description: editingMember.bio || "",
        location: editingMember.location || "",
        experience: editingMember.experience || "",
        skills: editingMember.skills || [],
        facebook: editingMember.facebook || "",
        twitter: editingMember.twitter || "",
        instagram: editingMember.instagram || "",
        linkedin: editingMember.linkedin || "",
        website: editingMember.website || "",
        createdAt: editingMember.joinedAt.toString(),
        updatedAt: editingMember.updatedAt.toString(),
      }
    : null;

  return (
    <div className="space-y-5 sm:space-y-6 text-zinc-800">
      <Topbar showSearch={false} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader title="Team" description="Manage Your team members and their information." />
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button onClick={handleAdd}>
            Add Member
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        <StatCard icon={Users} label="Total Members" value={data.total} />
        <StatCard icon={Users} label="Active Members" value={data.active} />
        <StatCard icon={User} label="Inactive" value={data.inactive} />
        <StatCard icon={User} label="Departments" value={new Set(data.members.map((m) => m.department).filter(Boolean)).size} />
      </div>

      {/* Search + View Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-black">Team Members</h2>
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

          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              placeholder="Search Member...."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-700 shadow-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-200"
            />
          </div>
        </div>
      </div>

      {/* List / Card View */}
      {filtered.length === 0 && !isPending ? (
        <Card>
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
            <Users className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">
              {search ? "No members match your search" : "No team members yet. Add your first member!"}
            </p>
          </div>
        </Card>
      ) : viewMode === "list" ? (
        /* ─── List View (Table) ─── */
        <Card noPadding className="overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-zinc-500">
                  <th className="px-6 py-4 font-medium">Image</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Department</th>
                  <th className="px-6 py-4 font-medium">Phone</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {m.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.image} alt={m.fullName} className="h-9 w-9 rounded-full object-cover" />
                      ) : (
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sky-500">
                          <User className="h-5 w-5" />
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-700">{m.fullName}</td>
                    <td className="px-6 py-4 text-zinc-600">{m.role || "—"}</td>
                    <td className="px-6 py-4 text-zinc-600">{m.department || "—"}</td>
                    <td className="px-6 py-4 text-zinc-600">{m.phone || "—"}</td>
                    <td className="px-6 py-4 text-zinc-600">{m.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${m.status === "Active" ? "text-gray-900" : "text-gray-500"}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <RowActions onView={() => setViewItem(m)} onEdit={() => handleEdit(m)} onDelete={() => handleDeleteRequest(m.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile list fallback */}
          <div className="lg:hidden divide-y divide-gray-100">
            {filtered.map((m) => (
              <div key={m.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  {m.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.image} alt={m.fullName} className="h-12 w-12 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-500">
                      <User className="h-6 w-6" />
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">{m.fullName}</h3>
                    <p className="text-xs text-gray-600">{m.role || "No role"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div>
                    <span className="text-gray-500 block mb-1">Department</span>
                    <span className="text-gray-900">{m.department || "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Status</span>
                    <span className={`font-medium ${m.status === "Active" ? "text-gray-900" : "text-gray-500"}`}>{m.status}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Phone className="w-3 h-3 text-sky-500 shrink-0" />
                    <span className="truncate">{m.phone || "—"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Mail className="w-3 h-3 text-sky-500 shrink-0" />
                    <span className="truncate">{m.email}</span>
                  </div>
                </div>
                <RowActions variant="buttons" onView={() => setViewItem(m)} onEdit={() => handleEdit(m)} onDelete={() => handleDeleteRequest(m.id)} />
              </div>
            ))}
          </div>
        </Card>
      ) : (
        /* ─── Card View (Grid) ─── */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <Card key={m.id} className="flex flex-col gap-4 p-5">
              <div className="flex items-center gap-4">
                {m.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.image} alt={m.fullName} className="h-14 w-14 shrink-0 rounded-full object-cover" />
                ) : (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-500">
                    <User className="h-7 w-7" />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-zinc-800 truncate">{m.fullName}</p>
                  <p className="text-sm text-zinc-500 truncate">{m.role || "—"}</p>
                  <span className={`mt-1 inline-block text-xs font-medium ${m.status === "Active" ? "text-emerald-600" : "text-zinc-400"}`}>
                    {m.status}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-zinc-600">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                  <span className="truncate">{m.phone || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                  <span className="truncate">{m.email}</span>
                </div>
              </div>
              <div className="mt-auto pt-2 border-t border-gray-100">
                <RowActions variant="buttons" onView={() => setViewItem(m)} onEdit={() => handleEdit(m)} onDelete={() => handleDeleteRequest(m.id)} />
              </div>
            </Card>
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

      {/* Add/Edit Member Modal */}
      <AddMemberModal
        key={modalKey}
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingMember(null); }}
        onSubmit={handleSubmit}
        editMember={editMemberRecord}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Delete Member"
        description="Are you sure you want to delete this team member? This action cannot be undone."
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* View Detail Modal */}
      <ViewDetailModal
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem?.fullName || ""}
        imageUrl={viewItem?.image || undefined}
        fields={[
          { label: "Name", value: viewItem?.fullName },
          { label: "Role", value: viewItem?.role },
          { label: "Department", value: viewItem?.department },
          { label: "Email", value: viewItem?.email },
          { label: "Phone", value: viewItem?.phone },
          { label: "Status", value: viewItem?.status },
          { label: "Bio", value: viewItem?.bio },
          { label: "Location", value: viewItem?.location },
          { label: "Experience", value: viewItem?.experience },
          { label: "Skills", value: viewItem?.skills?.join(", ") },
        ]}
      />
    </div>
  );
}
