import { PageHeader } from "@/components/PageHeader";
import { Users, UserCheck, UserPlus, TrendingUp, Mail, Phone, Eye, Pencil, Trash2 } from "lucide-react";

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

const customers = [
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

export default function CustomerPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Customer" description="Manage your customers." />

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
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            Add Customer
            <span className="text-lg">+</span>
          </button>
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
    </div>
  );
}
