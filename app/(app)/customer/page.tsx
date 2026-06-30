"use client";

import { PageHeader } from "@/components/PageHeader";
import { Users, UserCheck, UserPlus, TrendingUp, Mail, Eye, Pencil, Trash2, CalendarDays, ChevronDown, Search } from "lucide-react";
import { AddCustomerModal, type CustomerFormData } from "@/components/AddcostumerModal";
import { useState } from "react";

const stats = [
  {
    icon: Users,
    label: "Total Clients",
    value: "375",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    icon: UserCheck,
    label: "Active Clients",
    value: "200",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    icon: UserPlus,
    label: "New Clients",
    value: "50",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    icon: TrendingUp,
    label: "Total Revenue",
    value: "$128",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  }
];

const initialCustomers = [
  {
    id: 1,
    name: "Jhon Deo",
    email: "Jhondeo@gmail.com",
    phone: "9898989898",
    gender: "Male" as const,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John1",
    services: "Web Development",
    status: "Active" as const,
    invoiceStatus: "Paid" as const
  },
  {
    id: 2,
    name: "Jhon Deo",
    email: "Jhondeo@gmail.com",
    phone: "9898989898",
    gender: "Female" as const,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane2",
    services: "Web Development",
    status: "Inactive" as const,
    invoiceStatus: "Paid" as const
  },
  {
    id: 3,
    name: "Jhon Deo",
    email: "Jhondeo@gmail.com",
    phone: "9898989898",
    gender: "Male" as const,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John3",
    services: "Web Development",
    status: "Active" as const,
    invoiceStatus: "Paid" as const
  },
  {
    id: 4,
    name: "Jhon Deo",
    email: "Jhondeo@gmail.com",
    phone: "9898989898",
    gender: "Female" as const,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane4",
    services: "Web Development",
    status: "Inactive" as const,
    invoiceStatus: "Paid" as const
  }
];
function FilterPeriod() {
  return (
    <button
      type="button"
      className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2.5 text-left shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.14)]"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
        <CalendarDays className="h-5 w-5" />
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-semibold text-black">
          Filter Period
        </span>
        <span className="text-xs text-zinc-500">17 April 2021 - 21 May 2021</span>
      </span>
      <ChevronDown className="h-4 w-4 text-black" />
    </button>
  );
}

export default function CustomerPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCustomer = (customerData: CustomerFormData) => {
    const newCustomer = {
      id: customers.length + 1,
      ...customerData,
      avatar: customerData.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
      gender: customerData.gender as "Male" | "Female",
      status: customerData.status as "Active" | "Inactive",
      invoiceStatus: customerData.invoiceStatus as "Paid" | "Unpaid" | "Pending"
    };
    setCustomers([...customers, newCustomer]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title="Customer" description="Manage your customers." />
        <FilterPeriod />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.iconColor} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Customer List</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search Member...."
                className="w-72 rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-700 shadow-sm outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              Add Customer
              <span className="text-lg">+</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-sm font-medium text-gray-500">Image</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Name</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Email</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Phone</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Gender</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Services</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Invoice Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                      <img
                        src={customer.avatar}
                        alt={customer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-900">{customer.name}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-blue-600" />
                      {customer.email}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{customer.phone}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${customer.gender === "Male"
                      ? "bg-teal-100 text-teal-700"
                      : "bg-pink-100 text-pink-700"
                      }`}>
                      {customer.gender}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{customer.services}</td>
                  <td className="p-4">
                    <span className={`text-sm font-medium ${customer.status === "Active" ? "text-gray-900" : "text-gray-500"
                      }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-600">{customer.invoiceStatus}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCustomer}
      />
    </div>
  );
}
