"use client";

import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import { updateCustomer } from "@/app/actions/customers";
import { CustomFieldRenderer, type CustomValues } from "@/components/CustomFieldRenderer";
import { useEntityLabel, useStatusOptions } from "@/components/ConfigProvider";

export interface CustomerRow {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  servicesId: string | null;
  companyName: string | null;
  status: string;
  image: string;
}

interface Service {
  id: string;
  serviceName: string;
}

interface EditCustomerModalProps {
  isOpen: boolean;
  customer: CustomerRow | null;
  services?: Service[];
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditCustomerModal({ isOpen, customer, services = [], onClose, onSuccess }: EditCustomerModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const customerLabel = useEntityLabel("customer");
  const statusOptions = useStatusOptions("customer");
  const [customValues, setCustomValues] = useState<CustomValues>({});
  // Keyed by customer.id at the call site, so this mounts fresh per record.
  const [formData, setFormData] = useState({
    fullName: customer?.fullName ?? "",
    email: customer?.email ?? "",
    phoneNumber: customer?.phoneNumber ?? "",
    address: customer?.address ?? "",
    servicesId: customer?.servicesId ?? "",
    companyName: customer?.companyName ?? "",
    status: customer?.status ?? "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const cleaned = value.replace(/[^\d+]/g, "");
      const plusCount = (cleaned.match(/\+/g) || []).length;
      const sanitized = plusCount > 1 ? "+" + cleaned.replace(/\+/g, "") : cleaned;
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
      if (sanitized && !/^\+?\d{7,15}$/.test(sanitized)) {
        setPhoneError("Enter a valid phone number (e.g. 9801234567 or +9779801234567)");
      } else {
        setPhoneError(null);
      }
      return;
    }
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
      servicesId: formData.servicesId,
      companyName: formData.companyName,
      status: formData.status,
    }, customValues);

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
      <div className="relative flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl max-h-[95vh]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-zinc-400 hover:text-zinc-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="shrink-0 border-b border-gray-200 px-6 py-4 sm:px-8 sm:py-5">
          <h2 className="text-lg font-bold text-gray-900">Edit {customerLabel}</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
                  <label className={labelCls}>Phone No. <span className="text-gray-400">(e.g. +9779801234567)</span></label>
                  <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                    type="tel" placeholder="e.g. +9779801234567" className={inputCls} />
                  {phoneError && (
                    <p className="text-xs text-amber-600 mt-1">{phoneError}</p>
                  )}
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
            <div className="mt-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Project Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Services</label>
                  <select
                    name="servicesId"
                    value={formData.servicesId}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-gray-400 outline-none transition-colors text-sm"
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
                  <label className={labelCls}>Status <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-6 h-[42px]">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-gray-400 outline-none transition-colors text-sm"
                    >
                      {statusOptions.map((s) => (
                        <option key={s.statusValue} value={s.statusValue}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Fields */}
            <CustomFieldRenderer
              moduleKey="customer"
              recordId={customer?.id}
              onValuesChange={setCustomValues}
            />
          </div>

          {/* Buttons - always visible */}
          <div className="flex shrink-0 items-center gap-3 border-t border-gray-200 px-6 py-4 sm:px-8">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-950 disabled:opacity-60">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
