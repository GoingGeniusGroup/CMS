"use client";

import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import { createCustomer } from "@/app/actions/customers";
import { ImageUploader } from "@/components/ImageUploader";

interface Service {
  id: string;
  serviceName: string;
}

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  services: Service[];
}

export function AddCustomerModal({ isOpen, onClose, onSuccess, services }: AddCustomerModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    email: "",
    services: "",
    companyName: "",
    status: "Active" as "Active" | "Inactive",
    image: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // For phone number, only allow digits and limit to 10
    if (name === "phoneNumber") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await createCustomer({
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      servicesId: formData.services,
      companyName: formData.companyName,
      status: formData.status,
      image: formData.image ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.firstName}`,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong");
      return;
    }

    // Reset form
    setFormData({
      firstName: "", lastName: "", phoneNumber: "", address: "",
      email: "", services: "", companyName: "", status: "Active", image: "",
    });
    onSuccess?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-900">Add New Customer</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" type="button">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Photo Upload via Uploadcare */}
          <ImageUploader
            label="Customer Photo"
            value={formData.image || null}
            onChange={(url) => setFormData((prev) => ({ ...prev, image: url || "" }))}
          />

          {/* Basic Info */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Basic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input name="firstName" value={formData.firstName} onChange={handleChange} required
                  placeholder="Enter first name"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-gray-400 outline-none transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input name="lastName" value={formData.lastName} onChange={handleChange} required
                  placeholder="Enter last name"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-gray-400 outline-none transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone No. <span className="text-gray-400">(10 digits)</span>
                </label>
                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                  type="tel" placeholder="Enter 10-digit phone number" maxLength={10}
                  pattern="\d{10}"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-gray-400 outline-none transition-colors text-sm" />
                {formData.phoneNumber && formData.phoneNumber.length !== 10 && (
                  <p className="text-xs text-amber-600 mt-1">Phone number must be exactly 10 digits</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Company Name
                </label>
                <input name="companyName" value={formData.companyName} onChange={handleChange}
                  placeholder="Enter company name"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-gray-400 outline-none transition-colors text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                <input name="address" value={formData.address} onChange={handleChange}
                  placeholder="Enter address"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-gray-400 outline-none transition-colors text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input name="email" value={formData.email} onChange={handleChange}
                  type="email" required placeholder="Enter email address"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-gray-400 outline-none transition-colors text-sm" />
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Project Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Services <span className="text-red-500">*</span>
                </label>
                <select
                  name="services"
                  value={formData.services}
                  onChange={handleChange}
                >
                  <option value="">Select Service</option>

                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.serviceName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-6 h-[42px]">
                  {(["Active", "Inactive"] as const).map((s) => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="status" value={s}
                        checked={formData.status === s} onChange={handleChange}
                        className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-lg transition-colors text-sm">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 bg-blue-900 hover:bg-blue-950 disabled:opacity-60 text-white font-medium px-6 py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Adding..." : "Add Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
