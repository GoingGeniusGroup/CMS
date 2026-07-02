"use client";

import { useState } from "react";
import { Users, User, Filter, Plus, Search, Phone, Mail } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { RowActions } from "@/components/RowActions";
import { Pagination } from "@/components/Pagination";
import { AddMemberModal } from "@/components/AddMemberModal";

const stats = [
  { label: "Total Members", value: 28, icon: Users },
  { label: "Active Members", value: 24, icon: Users },
  { label: "Leave Members", value: 2, icon: User },
  { label: "Departments", value: 5, icon: User },
];

const members = [
  { name: "Jhon Deo", designation: "UI/UX Designer", department: "Design", phone: "9863527410", email: "johndoe@gmail.com", status: "Active", gender: "male", image: null as string | null },
  { name: "Jhon Deo", designation: "Web Developer", department: "Development", phone: "9863527410", email: "johndoe@gmail.com", status: "Active", gender: "female", image: null as string | null },
  { name: "Jhon Deo", designation: "Content Writer", department: "Content", phone: "9863527410", email: "johndoe@gmail.com", status: "Active", gender: "male", image: null as string | null },
  { name: "Jhon Deo", designation: "Project Manager", department: "Management", phone: "9863527410", email: "johndoe@gmail.com", status: "On Leave", gender: "male", image: null as string | null },
  { name: "Jhon Deo", designation: "Marketing Manager", department: "Marketing", phone: "9863527410", email: "johndoe@gmail.com", status: "Active", gender: "female", image: null as string | null },
];

export default function TeamPage() {
  const [showAddMember, setShowAddMember] = useState(false);

  return (
    <div className="space-y-5 sm:space-y-6 text-zinc-800">
      <Topbar showSearch={false}/>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader title="Team" description="Manage Your team members and their information." />
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button onClick={() => setShowAddMember(true)}>
            Add Member
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Team Members */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-black">Team Members</h2>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
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
              {members.map((m, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {m.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.image} alt={m.name} className="h-9 w-9 rounded-full object-cover" />
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
                    <span className={`text-sm font-medium ${m.status === "Active" ? "text-gray-900" : "text-gray-500"}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <RowActions />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden divide-y divide-gray-100">
          {members.map((m, i) => (
            <div key={i} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                {m.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.image} alt={m.name} className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full object-cover" />
                ) : (
                  <span className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-500">
                    <User className="h-6 w-6" />
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">{m.name}</h3>
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
                  <span className={`font-medium ${m.status === "Active" ? "text-gray-900" : "text-gray-500"}`}>
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

              <RowActions variant="buttons" />
            </div>
          ))}
        </div>
      </Card>

      {/* Pagination */}
      <Pagination page={1} pageCount={3} rangeLabel="Showing 1 to 5 of 28 entries" />

      {/* Add Member modal */}
      <AddMemberModal open={showAddMember} onClose={() => setShowAddMember(false)} />
    </div>
  );
}
