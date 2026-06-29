import { Users, User, Filter, Plus, Eye, Pencil, Trash2, Search } from "lucide-react";
import { FaMale, FaFemale } from "react-icons/fa";
import { PageHeader } from "@/components/PageHeader";

const stats = [
  { label: "Total Members", value: 28, icon: Users },
  { label: "Active Members", value: 24, icon: Users },
  { label: "Leave Members", value: 2, icon: User },
  { label: "Departments", value: 5, icon: User },
];

const members = [
  { name: "Jhon Deo", designation: "UI/UX Designer", department: "Design", phone: "9863527410", email: "johndoe@gmail.com", status: "Active", gender: "male" },
  { name: "Jhon Deo", designation: "Web Developer", department: "Development", phone: "9863527410", email: "johndoe@gmail.com", status: "Active", gender: "female" },
  { name: "Jhon Deo", designation: "Content Writer", department: "Content", phone: "9863527410", email: "johndoe@gmail.com", status: "Active", gender: "male" },
  { name: "Jhon Deo", designation: "Project Manager", department: "Management", phone: "9863527410", email: "johndoe@gmail.com", status: "On Leave", gender: "male" },
  { name: "Jhon Deo", designation: "Marketing Manager", department: "Marketing", phone: "9863527410", email: "johndoe@gmail.com", status: "Active", gender: "female" },
];

export default function TeamPage() {
  return (
    <div className="text-zinc-800">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <PageHeader title="Team" description="Manage Your team members and their information." />
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm">
            Add Member
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-8 shadow-[0_6px_24px_rgba(0,0,0,0.25)]">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
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
    </div>
  );
}
