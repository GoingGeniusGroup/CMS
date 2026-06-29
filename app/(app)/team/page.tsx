"use client";

import { useState } from "react";
import { Users, User, Filter, Plus, Eye, Pencil, Trash2, Search, Camera } from "lucide-react";
import { FaMale, FaFemale } from "react-icons/fa";
import { PageHeader } from "@/components/PageHeader";

const stats = [
  { label: "Total Members", value: 28, icon: Users, iconClass: "text-zinc-900" },
  { label: "Active Members", value: 24, icon: Users, iconClass: "text-zinc-900" },
  { label: "Leave Members", value: 2, icon: User, iconClass: "text-zinc-900" },
  { label: "Departments", value: 5, icon: User, iconClass: "text-zinc-900" },
];

const members = [
  { name: "Jhon Deo", designation: "UI/UX Designer", department: "Design", phone: "9863527410", email: "johndoe@gmail.com", status: "Active", gender: "male" },
  { name: "Jhon Deo", designation: "Web Developer", department: "Development", phone: "9863527410", email: "johndoe@gmail.com", status: "Active", gender: "female" },
  { name: "Jhon Deo", designation: "Content Writer", department: "Content", phone: "9863527410", email: "johndoe@gmail.com", status: "Active", gender: "male" },
  { name: "Jhon Deo", designation: "Project Manager", department: "Management", phone: "9863527410", email: "johndoe@gmail.com", status: "On Leave", gender: "male" },
  { name: "Jhon Deo", designation: "Marketing Manager", department: "Marketing", phone: "9863527410", email: "johndoe@gmail.com", status: "Active", gender: "female" },
];

export default function TeamPage() {
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddDesignation, setShowAddDesignation] = useState(false);
  const [description, setDescription] = useState("");

  return (
    <div className="text-zinc-800">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <PageHeader title="Team" description="Manage Your team members and their information." />
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm font-bold text-zinc-700 shadow-sm">
            <Filter className="h-4 w-4" strokeWidth={3} />
            Filter
          </button>
          <button
            onClick={() => setShowAddMember(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm"
          >
            Add Member
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, iconClass }) => (
          <div key={label} className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-8 shadow-[0_6px_24px_rgba(0,0,0,0.25)]">
            <span className={`flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 ${iconClass}`}>
              <Icon className="h-7 w-7" strokeWidth={1.5} />
            </span>
            <div>
              <div className="text-2xl font-semibold tracking-tight">{value}</div>
              <div className="text-sm text-zinc-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Team Members */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Team Members</h2>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            placeholder="Search Member...."
            className="w-72 rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-700 shadow-sm outline-none placeholder:text-zinc-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="text-zinc-500">
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
              {members.map((m, i) => (
                <tr key={i} className="border-t border-black/5">
                  <td className="px-6 py-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
                      {m.gender === "female" ? <FaFemale className="h-5 w-5" /> : <FaMale className="h-5 w-5" />}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-700">{m.name}</td>
                  <td className="px-6 py-4 text-zinc-600">{m.designation}</td>
                  <td className="px-6 py-4 text-zinc-600">{m.department}</td>
                  <td className="px-6 py-4 text-zinc-600">{m.phone}</td>
                  <td className="px-6 py-4 text-zinc-600">{m.email}</td>
                  <td className="px-6 py-4 text-zinc-600">{m.status}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-zinc-500">
                      <Eye className="h-4 w-4" />
                      <Pencil className="h-4 w-4" />
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member modal */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-auto w-full max-w-2xl rounded-xl bg-white p-5 shadow-2xl">
            <h2 className="mb-4 text-lg font-bold">Add Member</h2>

            <div className="flex flex-col gap-4 md:flex-row">
              {/* Upload photo */}
              <div className="flex w-full flex-col items-center gap-2.5 self-start rounded-xl bg-zinc-50 p-6 md:w-60">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg text-indigo-500">
                  <Camera className="h-7 w-7" />
                </span>
                <div className="text-lg font-semibold">Upload Photo</div>
                <div className="text-center text-xs leading-tight text-zinc-400">
                  Best Resolution
                  <br />
                  500px * 400px
                </div>
                <button className="rounded-md border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600">
                  Choose File
                </button>
              </div>

              {/* Fields */}
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Full Name"
                      className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm text-zinc-500 outline-none focus:border-indigo-400">
                      <option>Select Designation</option>
                      <option>UI/UX Designer</option>
                      <option>Web Developer</option>
                      <option>Content Writer</option>
                      <option>Project Manager</option>
                    </select>
                    <div className="mt-1.5 flex justify-end">
                      <button
                        onClick={() => setShowAddDesignation(true)}
                        className="rounded-lg border border-indigo-200 px-2.5 py-1 text-xs font-semibold text-indigo-600"
                      >
                        + Add Designation
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium">Department</label>
                  <select className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm text-zinc-500 outline-none focus:border-indigo-400">
                    <option>Select Department</option>
                    <option>Design</option>
                    <option>Development</option>
                    <option>Content</option>
                    <option>Management</option>
                    <option>Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium">Description</label>
                  <textarea
                    rows={3}
                    maxLength={160}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description about team member......."
                    className="w-full resize-none rounded-lg border border-black/15 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400"
                  />
                  <div className="mt-0.5 text-right text-xs text-zinc-400">
                    {description.length}/160
                  </div>
                </div>
              </div>
            </div>

            {/* Social fields */}
            <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-3">
              {["Facebook", "Twitter URL", "Instagram URL", "LinkedIn URL", "Domain", "Phone"].map(
                (label) => (
                  <div key={label}>
                    <label className="mb-1 block text-xs font-bold">{label}</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-black/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                    />
                  </div>
                )
              )}
            </div>

            {/* Actions */}
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowAddMember(false)}
                className="rounded-lg border border-black/15 px-4 py-2 text-sm font-medium text-zinc-700"
              >
                Cancel
              </button>
              <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

     
    </div>
  );
}
