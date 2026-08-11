"use client";

import { X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createCustomer } from "@/app/actions/customers";
import { ImageUploader } from "@/components/ImageUploader";
import { CustomFieldRenderer, type CustomValues } from "@/components/CustomFieldRenderer";
import { useEntityLabel, useStatusOptions, useConfig } from "@/components/ConfigProvider";
import { getProfileConfig } from "@/lib/config/industry-profiles";
import { getActiveProfile } from "@/app/actions/labels";

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
  const [showCompanyName, setShowCompanyName] = useState(true);
  const customerLabel = useEntityLabel("customer");
  const statusOptions = useStatusOptions("customer");
  const [customValues, setCustomValues] = useState<CustomValues>({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    email: "",
    services: "",
    companyName: "",
    status: "",
    image: "",
  });
  const statusDefault = statusOptions.find((s) => s.isDefault)?.statusValue ?? statusOptions[0]?.statusValue ?? "Active";

  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Load field visibility based on industry profile
  useEffect(() => {
    async function loadFieldVisibility() {
      const profileKey = await getActiveProfile();
      const profile = getProfileConfig(profileKey);
      
      // Check if customer module has fieldVisibility config
      const customerFields = profile.fieldVisibility?.customer;
      
      // If fieldVisibility is defined and doesn't include 'companyName', hide it
      if (customerFields) {
        setShowCompanyName(customerFields.includes('companyName'));
      } else {
        // Default behavior: show company name for most profiles
        // Hide for profiles that typically don't need it
        const profilesWithoutCompany = ['Healthcare', 'Café & Restaurant', 'Hospitality', 'Education'];
        setShowCompanyName(!profilesWithoutCompany.includes(profileKey));
      }
    }
    
    if (isOpen) {
      loadFieldVisibility();
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
    setError(null);

    if (!formData.firstName.trim() && !formData.lastName.trim()) {
      setError("Customer name is required");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    setIsSubmitting(true);

    const result = await createCustomer({
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      servicesId: formData.services,
      companyName: formData.companyName,
      status: formData.status || statusDefault,
      image: formData.image ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.firstName}`,
    }, customValues);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong");
      return;
    }

    // Reset form
    setFormData({
      firstName: "", lastName: "", phoneNumber: "", address: "",
      email: "", services: "", companyName: "", status: "", image: "",
    });
    setCustomValues({});
    onSuccess?.();
    onClose();
  };

  if (!isOpen) return null;

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
          <h2 className="text-lg font-bold text-gray-900">Add New {customerLabel}</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
            {/* Error */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Photo Upload via Uploadcare */}
            <ImageUploader
              label={`${customerLabel} Photo`}
              value={formData.image || null}
              onChange={(url) => setFormData((prev) => ({ ...prev, image: url || "" }))}
            />

            {/* Basic Info */}
            <div className="mt-5">
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
                    Phone No. <span className="text-gray-400">(e.g. +9779801234567)</span>
                  </label>
                  <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                    type="tel" placeholder="e.g. +9779801234567"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-gray-400 outline-none transition-colors text-sm" />
                  {phoneError && (
                    <p className="text-xs text-amber-600 mt-1">{phoneError}</p>
                  )}
                </div>
                {showCompanyName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Company Name
                    </label>
                    <input name="companyName" value={formData.companyName} onChange={handleChange}
                      placeholder="Enter company name"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-gray-400 outline-none transition-colors text-sm" />
                  </div>
                )}
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
            <div className="mt-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-6 h-[42px]">
                    <select
                      name="status"
                      value={formData.status || statusDefault}
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
              {isSubmitting ? "Adding..." : `Add ${customerLabel}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
