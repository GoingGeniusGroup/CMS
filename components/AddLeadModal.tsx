"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/Button";
import { CustomFieldRenderer, type CustomValues } from "@/components/CustomFieldRenderer";
import { useEntityLabel, useStatusOptions } from "@/components/ConfigProvider";
import { createLead, updateLead, type LeadInput } from "@/app/actions/leads";

export type LeadRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  serviceInterest: string;
  budget: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

interface AddLeadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  lead?: LeadRow | null;
  services?: string[];
}

const BUDGET_OPTIONS = [
  "Under $5k",
  "$5k – $10k",
  "$10k – $25k",
  "$25k – $50k",
  "$50k+",
  "Not sure",
];

export function AddLeadModal({ open, onClose, onSuccess, lead, services }: AddLeadModalProps) {
  const isEditing = !!lead;
  const leadLabel = useEntityLabel("lead");
  const statusOptions = useStatusOptions("lead");

  const statusDefault = statusOptions.find((s) => s.isDefault)?.statusValue ?? statusOptions[0]?.statusValue ?? "New";

  const [fullName, setFullName] = useState(lead?.fullName ?? "");
  const [email, setEmail] = useState(lead?.email ?? "");
  const [phone, setPhone] = useState(lead?.phone ?? "");
  const [company, setCompany] = useState(lead?.company ?? "");
  const [subject, setSubject] = useState(lead?.subject ?? "");
  const [message, setMessage] = useState(lead?.message ?? "");
  const [serviceInterest, setServiceInterest] = useState(lead?.serviceInterest ?? "");
  const [budget, setBudget] = useState(lead?.budget ?? "");
  const [status, setStatus] = useState(lead?.status ?? "");
  const [customValues, setCustomValues] = useState<CustomValues>({});

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const data: LeadInput = {
      fullName,
      email,
      phone,
      company,
      subject,
      message,
      serviceInterest,
      budget,
      status: status || statusDefault,
    };

    const result = isEditing
      ? await updateLead(lead!.id, data, customValues)
      : await createLead(data, customValues);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || "Something went wrong");
      return;
    }

    onSuccess?.();
    onClose();
  }

  const inputCls = "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:border-amber-400 focus:bg-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-zinc-400 hover:text-zinc-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="shrink-0 px-6 pt-6 sm:px-8 sm:pt-8">
          <h2 className="text-xl font-bold text-zinc-900">
            {isEditing ? `Edit ${leadLabel}` : `Add New ${leadLabel}`}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {isEditing ? `Update ${leadLabel.toLowerCase()} details.` : `Create a ${leadLabel.toLowerCase()} manually.`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 sm:px-8">
            <div className="space-y-5 pt-5">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Name + Email */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-0.5 block text-sm font-bold text-zinc-800">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-0.5 block text-sm font-bold text-zinc-800">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Phone + Company */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-0.5 block text-sm font-bold text-zinc-800">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 555 000 1234"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-0.5 block text-sm font-bold text-zinc-800">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Service + Budget */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-0.5 block text-sm font-bold text-zinc-800">Service of Interest</label>
                  <select
                    value={serviceInterest}
                    onChange={(e) => setServiceInterest(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">None selected</option>
                    {services?.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-0.5 block text-sm font-bold text-zinc-800">Budget</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Not specified</option>
                    {BUDGET_OPTIONS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="mb-0.5 block text-sm font-bold text-zinc-800">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject of the inquiry"
                  className={inputCls}
                />
              </div>

              {/* Message */}
              <div>
                <label className="mb-0.5 block text-sm font-bold text-zinc-800">Message</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Details about the inquiry"
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-0.5 block text-sm font-bold text-zinc-800">Status</label>
                <select
                  value={status || statusDefault}
                  onChange={(e) => setStatus(e.target.value)}
                  className={inputCls}
                >
                  {statusOptions.map((s) => (
                    <option key={s.statusValue} value={s.statusValue}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Custom Fields */}
              <CustomFieldRenderer
                moduleKey="lead"
                recordId={lead?.id}
                onValuesChange={setCustomValues}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4 sm:px-8">
            <Button variant="secondary" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : `Add ${leadLabel}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}