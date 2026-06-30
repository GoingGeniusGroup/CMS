"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customerData: CustomerFormData) => void;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  gender: "Male" | "Female" | "";
  services: string;
  status: "Active" | "Inactive";
  invoiceStatus: "Paid" | "Unpaid" | "Pending";
  avatar?: string;
}

export function AddCustomerModal({ isOpen, onClose, onSubmit }: AddCustomerModalProps) {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    services: "",
    status: "Active",
    invoiceStatus: "Pending",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate avatar URL based on name
    const avatarSeed = formData.name.replace(/\s+/g, "") + Date.now();
    const customerData = {
      ...formData,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`,
    };

    onSubmit(customerData);

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      gender: "",
      services: "",
      status: "Active",
      invoiceStatus: "Pending",
    });

    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl m-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-gray-900">Add New Customer</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-gray-400 outline-none transition-colors"
              placeholder="Enter customer name"
            />
          </div>

          {/* Email & Phone Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-gray-400 outline-none transition-colors"
                placeholder="customer@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-gray-400 outline-none transition-colors"
                placeholder="9898989898"
              />
            </div>
          </div>

          {/* Gender & Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-gray-400 outline-none transition-colors bg-white"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-gray-400 outline-none transition-colors bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Services Field */}
          <div>
            <label htmlFor="services" className="block text-sm font-medium text-gray-700 mb-2">
              Services <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="services"
              name="services"
              value={formData.services}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-gray-400 outline-none transition-colors"
              placeholder="e.g., Web Development, Mobile App, etc."
            />
          </div>

          {/* Invoice Status */}
          <div>
            <label htmlFor="invoiceStatus" className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Status <span className="text-red-500">*</span>
            </label>
            <select
              id="invoiceStatus"
              name="invoiceStatus"
              value={formData.invoiceStatus}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-gray-400 outline-none transition-colors bg-white"
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Add Customer
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
