"use client";

import { X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { updateCustomer } from "@/app/actions/customers";

export interface CustomerRow {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  services: string | null;
  companyName: string | null;
  status: string;
  image: string;
}

interface EditCustomerModalProps {
  isOpen: boolean;
  customer: CustomerRow | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditCustomerModal({ isOpen, customer, onClose, onSuccess }: EditCustomerModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    services: "",
    companyName: "",
    status: "Active" as "Active" | "Inactive",
  });

  // Pre-fill form when customer changes
  useEffect(() => {
    if (customer) {
      setFormData({
        fullName: customer.fullName,
        email: customer.email,
        phoneNumber: customer.phoneNumber ?? "",
        address: customer.address ?? "",
        services: customer.services ?? "",
        companyName: customer.companyName ?? "",
        status: customer.status === "Inactive" ? "Inactive" : "Active",
      });
      setError(null);
    }
  }, [customer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    setError(null);
    setIsSubmitting(true);

    const result = await updateCustomer(customer.id, {
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      services: formData.services,
      companyName: formData.companyName,
      status: formData.status,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Update failed");
      return;
    }

    onSuccess?.();
    onClose();
  };

  if (!isOpen || !customer) return null;

  const inputCls = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-gray-400 outline-none transition-colors text-sm";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-900">Edit Customer</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" type="button">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Basic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                <input name="fullName" value={formData.fullName} onChange={handleChange}
                  required placeholder="Enter full name" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email <span className="text-red-500">*</span></label>
                <input name="email" value={formData.email} onChange={handleChange}
                  type="email" required placeholder="Enter email" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Phone No.</label>
                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                  type="tel" placeholder="Enter phone number" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Company Name</label>
                <input name="companyName" value={formData.companyName} onChange={handleChange}
                  placeholder="Enter company name" className={inputCls} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Address</label>
                <input name="address" value={formData.address} onChange={handleChange}
                  placeholder="Enter address" className={inputCls} />
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Project Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Services</label>
                <select name="services" value={formData.services} onChange={handleChange} className={inputCls}>
                  <option value="">Select Service</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="SEO">SEO</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Status <span className="text-red-500">*</span></label>
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
