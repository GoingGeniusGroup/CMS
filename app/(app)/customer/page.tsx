"use client";

import { PageHeader } from "@/components/PageHeader";
import { Users, UserCheck, UserPlus, TrendingUp, Mail, Eye, Pencil, Trash2, CalendarDays, ChevronDown, Search } from "lucide-react";
import { AddCustomerModal, type CustomerFormData } from "@/components/AddcostumerModal";
import { useState } from "react";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: "Male" | "Female";
  avatar: string;
  services: string;
  status: "Active" | "Inactive";
  invoiceStatus: "Paid" | "Unpaid" | "Pending";
};

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

const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "Jhon Deo",
    email: "Jhondeo@gmail.com",
    phone: "9898989898",
    gender: "Male",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John1",
    services: "Web Development",
    status: "Active",
    invoiceStatus: "Paid"
  },
  {
    id: 2,
    name: "Jhon Deo",
    email: "Jhondeo@gmail.com",
    phone: "9898989898",
    gender: "Female",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane2",
    services: "Web Development",
    status: "Inactive",
    invoiceStatus: "Paid"
  },
  {
    id: 3,
    name: "Jhon Deo",
    email: "Jhondeo@gmail.com",
    phone: "9898989898",
    gender: "Male",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John3",
    services: "Web Development",
    status: "Active",
    invoiceStatus: "Paid"
  },
  {
    id: 4,
    name: "Jhon Deo",
    email: "Jhondeo@gmail.com",
    phone: "9898989898",
    gender: "Female",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane4",
    services: "Web Development",
    status: "Inactive",
    invoiceStatus: "Paid"
  }
];

function FilterPeriod() {
  return (
    <button
      type="button"
      className="flex items-center gap-2 sm:gap-3 rounded-2xl bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-left shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.14)]"
    >
      <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
        <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" />
      </span>
      <span className="flex flex-col">
        <span className="text-xs sm:text-sm font-semibold text-black">
          Filter Period
        </span>
        <span className="text-[10px] sm:text-xs text-zinc-500 hidden sm:block">17 April 2021 - 21 May 2021</span>
      </span>
      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-black" />
    </button>
  );
}

export default function CustomerPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCustomer = (customerData: CustomerFormData) => {
    const newCustomer: Customer = {
      id: customers.length + 1,
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      gender: customerData.gender as "Male" | "Female",
      avatar: customerData.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
      services: customerData.services,
      status: customerData.status,
      invoiceStatus: customerData.invoiceStatus
    };
    setCustomers([...customers, newCustomer]);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start justify-between gap-3 sm:gap-4">
        <PageHeader title="Customer" description="Manage your customers." />
        <FilterPeriod />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500 mb-1 sm:mb-2">{stat.label}</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.iconColor} p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">Customer List</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64 lg:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search Member...."
                className="w-full rounded-full border border-black/10 bg-white py-2 sm:py-2.5 pl-9 sm:pl-10 pr-4 text-xs sm:text-sm text-zinc-700 shadow-sm outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap text-xs sm:text-sm lg:text-base"
            >
              Add Customer
              <span className="text-base sm:text-lg">+</span>
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
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

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden divide-y divide-gray-100">
          {customers.map((customer) => (
            <div key={customer.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">{customer.name}</h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-1">
                    <Mail className="w-3 h-3 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">{customer.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-500 block mb-1">Gender</span>
                  <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${customer.gender === "Male"
                    ? "bg-teal-100 text-teal-700"
                    : "bg-pink-100 text-pink-700"
                    }`}>
                    {customer.gender}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Status</span>
                  <span className={`font-medium ${customer.status === "Active" ? "text-gray-900" : "text-gray-500"}`}>
                    {customer.status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Services</span>
                  <span className="text-gray-900 line-clamp-1">{customer.services}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Invoice</span>
                  <span className="text-gray-900">{customer.invoiceStatus}</span>
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

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCustomer}
      />
    </div>
  );
}
