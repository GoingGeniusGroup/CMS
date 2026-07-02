"use client";

import { useState, useMemo, useCallback } from "react";
import { Users, User, Filter, Plus, Search, Phone, Mail, X } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { RowActions } from "@/components/RowActions";
import { Pagination } from "@/components/Pagination";
import { AddMemberModal, type MemberFormData, type MemberRecord } from "@/components/AddMemberModal";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(): string {
  return `member_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const SEED_MEMBERS: MemberRecord[] = [
  {
    id: generateId(),
    name: "Jhon Deo",
    designation: "UI/UX Designer",
    department: "Design",
    phone: "9863527410",
    email: "johndoe@gmail.com",
    status: "Active",
    gender: "male",
    image: null,
    description: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    domain: "",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: generateId(),
    name: "Jane Smith",
    designation: "Web Developer",
    department: "Development",
    phone: "9863527411",
    email: "janesmith@gmail.com",
    status: "Active",
    gender: "female",
    image: null,
    description: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    domain: "",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: generateId(),
    name: "Mark Lee",
    designation: "Content Writer",
    department: "Content",
    phone: "9863527412",
    email: "marklee@gmail.com",
    status: "Active",
    gender: "male",
    image: null,
    description: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    domain: "",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: generateId(),
    name: "Sarah Connor",
    designation: "Project Manager",
    department: "Management",
    phone: "9863527413",
    email: "sarahconnor@gmail.com",
    status: "On Leave",
    gender: "female",
    image: null,
    description: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    domain: "",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: generateId(),
    name: "Tom Brown",
    designation: "Marketing Manager",
    department: "Marketing",
    phone: "9863527414",
    email: "tombrown@gmail.com",
    status: "Active",
    gender: "male",
    image: null,
    description: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    domain: "",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PAGE_SIZE = 5;

const DEPARTMENTS = ["Design", "Development", "Marketing", "Content", "Management"] as const;
const STATUSES = ["Active", "On Leave"] as const;

// ---------------------------------------------------------------------------
// Filter panel component (inline, no new file)
// ---------------------------------------------------------------------------

interface ActiveFilters {
  status: string;
  department: string;
}

function FilterPanel({
  filters,
  onChange,
  onClear,
  onClose,
}: {
  filters: ActiveFilters;
  onChange: (filters: ActiveFilters) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-700">Filters</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-indigo-600 hover:underline"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm text-zinc-600 outline-none focus:border-sky-400"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600">Department</label>
          <select
            value={filters.department}
            onChange={(e) => onChange({ ...filters, department: e.target.value })}
            className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm text-zinc-600 outline-none focus:border-sky-400"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Confirmation dialog component (inline, no new file)
// ---------------------------------------------------------------------------

function ConfirmDialog({
  open,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
        <p className="mb-5 text-sm text-zinc-700">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-black/15 px-4 py-2 text-sm font-medium text-zinc-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TeamPage() {
  // ── Core state ────────────────────────────────────────────────────────────
  const [members, setMembers] = useState<MemberRecord[]>(SEED_MEMBERS);
  const [selectedMember, setSelectedMember] = useState<MemberRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  // Incrementing key forces a clean remount of the modal on each open so its
  // internal useState is always fresh — avoids useEffect for state reset.
  const [modalKey, setModalKey] = useState(0);

  // ── Search / filter / pagination ─────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ActiveFilters>({ status: "", department: "" });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // ── Delete confirm ────────────────────────────────────────────────────────
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // ── Derived: filtered + searched members ──────────────────────────────────
  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return members.filter((m) => {
      // Search
      if (q) {
        const haystack = [m.name, m.designation, m.department, m.phone, m.email]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      // Filter by status
      if (filters.status && m.status !== filters.status) return false;
      // Filter by department
      if (filters.department && m.department !== filters.department) return false;
      return true;
    });
  }, [members, searchQuery, filters]);

  // ── Derived: pagination ───────────────────────────────────────────────────
  const pageCount = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE));

  // Clamp current page when filter/search changes reduce total pages
  const safePage = Math.min(currentPage, pageCount);

  const pagedMembers = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredMembers.slice(start, start + PAGE_SIZE);
  }, [filteredMembers, safePage]);

  const rangeLabel = useMemo(() => {
    const total = filteredMembers.length;
    if (total === 0) return "No entries";
    const start = (safePage - 1) * PAGE_SIZE + 1;
    const end = Math.min(safePage * PAGE_SIZE, total);
    return `Showing ${start} to ${end} of ${total} entries`;
  }, [filteredMembers.length, safePage]);

  // ── Derived: stat values ──────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = members.length;
    const active = members.filter((m) => m.status === "Active").length;
    const onLeave = members.filter((m) => m.status === "On Leave").length;
    const departments = new Set(members.map((m) => m.department)).size;
    return [
      { label: "Total Members", value: total, icon: Users },
      { label: "Active Members", value: active, icon: Users },
      { label: "Leave Members", value: onLeave, icon: User },
      { label: "Departments", value: departments, icon: User },
    ];
  }, [members]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleOpenCreate = useCallback(() => {
    setSelectedMember(null);
    setIsEditMode(false);
    setModalKey((k) => k + 1);
    setModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((member: MemberRecord) => {
    setSelectedMember(member);
    setIsEditMode(true);
    setModalKey((k) => k + 1);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedMember(null);
    setIsEditMode(false);
  }, []);

  const handleSubmit = useCallback(
    (data: MemberFormData) => {
      if (isEditMode && selectedMember) {
        // UPDATE
        setMembers((prev) =>
          prev.map((m) =>
            m.id === selectedMember.id
              ? { ...m, ...data, updatedAt: nowIso() }
              : m
          )
        );
        alert("Member updated successfully.");
      } else {
        // CREATE
        const newMember: MemberRecord = {
          ...data,
          id: generateId(),
          createdAt: nowIso(),
          updatedAt: nowIso(),
        };
        setMembers((prev) => [newMember, ...prev]);
        setCurrentPage(1);
        alert("Member added successfully.");
      }
      handleCloseModal();
    },
    [isEditMode, selectedMember, handleCloseModal]
  );

  const handleDeleteRequest = useCallback((id: string) => {
    setDeleteTargetId(id);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTargetId) return;
    const exists = members.some((m) => m.id === deleteTargetId);
    if (!exists) {
      alert("Member not found.");
      setDeleteTargetId(null);
      return;
    }
    setMembers((prev) => prev.filter((m) => m.id !== deleteTargetId));
    setDeleteTargetId(null);
    // If deleting the last item on the last page, go back one page
    setCurrentPage((p) => Math.max(1, p));
    alert("Member deleted successfully.");
  }, [deleteTargetId, members]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteTargetId(null);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((updated: ActiveFilters) => {
    setFilters(updated);
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ status: "", department: "" });
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const activeFilterCount =
    (filters.status ? 1 : 0) + (filters.department ? 1 : 0);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 sm:space-y-6 text-zinc-800">
      <Topbar showSearch={false} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader title="Team" description="Manage Your team members and their information." />
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => setShowFilterPanel((v) => !v)}>
            <Filter className="h-4 w-4" />
            Filter
            {activeFilterCount > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
          <Button onClick={handleOpenCreate}>
            Add Member
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilterPanel && (
        <FilterPanel
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
          onClose={() => setShowFilterPanel(false)}
        />
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Team Members heading + search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-black">Team Members</h2>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Member...."
            className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-700 shadow-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-200"
          />
        </div>
      </div>

      {/* Table */}
      <Card noPadding className="overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-zinc-500">
                <th className="px-6 py-4 font-medium">Image</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Designation</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm text-zinc-400">
                    No members found.
                  </td>
                </tr>
              ) : (
                pagedMembers.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {m.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.image}
                          alt={m.name}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sky-500">
                          <User className="h-5 w-5" />
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-700">{m.name}</td>
                    <td className="px-6 py-4 text-zinc-600">{m.designation}</td>
                    <td className="px-6 py-4 text-zinc-600">{m.department}</td>
                    <td className="px-6 py-4 text-zinc-600">{m.phone}</td>
                    <td className="px-6 py-4 text-zinc-600">{m.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${
                          m.status === "Active" ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <RowActions
                        onEdit={() => handleOpenEdit(m)}
                        onDelete={() => handleDeleteRequest(m.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden divide-y divide-gray-100">
          {pagedMembers.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-zinc-400">
              No members found.
            </div>
          ) : (
            pagedMembers.map((m) => (
              <div
                key={m.id}
                className="p-3 sm:p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  {m.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.image}
                      alt={m.name}
                      className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-500">
                      <User className="h-6 w-6" />
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">
                      {m.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">{m.designation}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-500 block mb-1">Department</span>
                    <span className="text-gray-900">{m.department}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Status</span>
                    <span
                      className={`font-medium ${
                        m.status === "Active" ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Phone className="w-3 h-3 text-sky-500 flex-shrink-0" />
                    <span className="truncate">{m.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Mail className="w-3 h-3 text-sky-500 flex-shrink-0" />
                    <span className="truncate">{m.email}</span>
                  </div>
                </div>

                <RowActions
                  variant="buttons"
                  onEdit={() => handleOpenEdit(m)}
                  onDelete={() => handleDeleteRequest(m.id)}
                />
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Pagination */}
      <Pagination
        page={safePage}
        pageCount={pageCount}
        rangeLabel={rangeLabel}
        onPageChange={handlePageChange}
      />

      {/* Add / Edit Member modal */}
      <AddMemberModal
        key={modalKey}
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editMember={isEditMode ? selectedMember : null}
      />

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={deleteTargetId !== null}
        message="Are you sure you want to delete this member?"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
