"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/Button";
import { CustomFieldRenderer, type CustomValues } from "@/components/CustomFieldRenderer";
import { useEntityLabel, useStatusOptions } from "@/components/ConfigProvider";
import { createInvoice, updateInvoice, type InvoiceInput } from "@/app/actions/invoices";

type SelectOption = { id: string; label: string };

type Invoice = {
  id: string;
  invoiceNumber: string;
  customerId: string | null;
  category?: string | null;
  amount: number;
  tax: number;
  total: number;
  status: string;
  issuedDate: Date | null;
  dueDate: Date | null;
  projects?: { project: { id: string; title: string } }[];
};

export function InvoiceModal({
  open,
  onClose,
  onSuccess,
  invoice,
  customers = [],
  projects = [],
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  invoice?: Invoice | null;
  customers?: SelectOption[];
  projects?: SelectOption[];
}) {
  const isEditing = !!invoice;
  const invoiceLabel = useEntityLabel("invoice");
  const invoiceStatusOptions = useStatusOptions("invoice");
  const defaultStatus = invoiceStatusOptions.find((o) => o.isDefault)?.statusValue ?? "Pending";

  const [invoiceNumber, setInvoiceNumber] = useState(invoice?.invoiceNumber ?? "");
  const [customerId, setCustomerId] = useState(invoice?.customerId ?? "");
  const [category, setCategory] = useState(invoice?.category ?? "");
  const [projectIds, setProjectIds] = useState<string[]>(
    invoice?.projects?.map((p) => p.project.id) ?? []
  );
  const [amount, setAmount] = useState(invoice?.amount?.toString() ?? "");
  const [tax, setTax] = useState(invoice?.tax?.toString() ?? "0");
  const [status, setStatus] = useState<string>(invoice?.status ?? defaultStatus);
  const [issuedDate, setIssuedDate] = useState(
    invoice?.issuedDate ? new Date(invoice.issuedDate).toISOString().split("T")[0] : ""
  );
  const [dueDate, setDueDate] = useState(
    invoice?.dueDate ? new Date(invoice.dueDate).toISOString().split("T")[0] : ""
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customValues, setCustomValues] = useState<CustomValues>({});

  if (!open) return null;

  const computedTotal = (parseFloat(amount) || 0) + (parseFloat(tax) || 0);

  function toggleProject(id: string) {
    setProjectIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const data: InvoiceInput = {
      invoiceNumber,
      customerId: customerId || undefined,
      category: category || undefined,
      projectIds: projectIds.length > 0 ? projectIds : undefined,
      amount: parseFloat(amount) || 0,
      tax: parseFloat(tax) || 0,
      total: computedTotal,
      status,
      issuedDate: issuedDate || undefined,
      dueDate: dueDate || undefined,
    };

    const result = isEditing
      ? await updateInvoice(invoice!.id, data, customValues)
      : await createInvoice(data, customValues);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || "Something went wrong");
      return;
    }

    onSuccess();
    onClose();
  }

  const inputCls = "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40";
  const labelCls = "block text-sm font-medium text-gray-700";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-zinc-400 hover:text-zinc-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="shrink-0 px-6 pt-6 sm:px-8 sm:pt-8">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? `Edit ${invoiceLabel}` : `Add ${invoiceLabel}`}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 sm:px-8">
            <div className="space-y-4 pt-5">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className={labelCls}>
                  Invoice Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="INV-001"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Customer</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Consulting, Development"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Projects</label>
                <div className="mt-1 max-h-40 overflow-y-auto rounded-lg border border-gray-300 p-2 space-y-1">
                  {projects.length === 0 ? (
                    <p className="px-2 py-1 text-sm text-zinc-400">No projects available</p>
                  ) : (
                    projects.map((p) => (
                      <label
                        key={p.id}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-50"
                      >
                        <input
                          type="checkbox"
                          checked={projectIds.includes(p.id)}
                          onChange={() => toggleProject(p.id)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        {p.label}
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Tax</label>
                  <input
                    type="number"
                    step="0.01"
                    value={tax}
                    onChange={(e) => setTax(e.target.value)}
                    placeholder="0.00"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 px-4 py-3">
                <span className="text-sm text-gray-600">Total: </span>
                <span className="text-sm font-bold text-gray-900">
                  Rs. {computedTotal.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Issued Date</label>
                  <input
                    type="date"
                    value={issuedDate}
                    onChange={(e) => setIssuedDate(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={inputCls}
                >
                  {invoiceStatusOptions.map((o) => (
                    <option key={o.statusValue} value={o.statusValue}>{o.label}</option>
                  ))}
                </select>
              </div>

              <CustomFieldRenderer
                moduleKey="invoice"
                recordId={invoice?.id}
                onValuesChange={setCustomValues}
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4 sm:px-8">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditing ? "Saving…" : "Creating…"
                : isEditing ? "Save Changes" : `Add ${invoiceLabel}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
