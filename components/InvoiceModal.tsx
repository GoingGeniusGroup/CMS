"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/Button";
import { createInvoice, updateInvoice, type InvoiceInput } from "@/app/actions/invoices";

type SelectOption = { id: string; label: string };

type Invoice = {
  id: string;
  invoiceNumber: string;
  customerId: string | null;
  projectId: string | null;
  amount: number;
  tax: number;
  total: number;
  status: string;
  issuedDate: Date | null;
  dueDate: Date | null;
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

  const [invoiceNumber, setInvoiceNumber] = useState(invoice?.invoiceNumber ?? "");
  const [customerId, setCustomerId] = useState(invoice?.customerId ?? "");
  const [projectId, setProjectId] = useState(invoice?.projectId ?? "");
  const [amount, setAmount] = useState(invoice?.amount?.toString() ?? "");
  const [tax, setTax] = useState(invoice?.tax?.toString() ?? "0");
  const [status, setStatus] = useState<"Paid" | "Pending" | "Overdue">(
    (invoice?.status as "Paid" | "Pending" | "Overdue") ?? "Pending"
  );
  const [issuedDate, setIssuedDate] = useState(
    invoice?.issuedDate ? new Date(invoice.issuedDate).toISOString().split("T")[0] : ""
  );
  const [dueDate, setDueDate] = useState(
    invoice?.dueDate ? new Date(invoice.dueDate).toISOString().split("T")[0] : ""
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const computedTotal = (parseFloat(amount) || 0) + (parseFloat(tax) || 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const data: InvoiceInput = {
      invoiceNumber,
      customerId: customerId || undefined,
      projectId: projectId || undefined,
      amount: parseFloat(amount) || 0,
      tax: parseFloat(tax) || 0,
      total: computedTotal,
      status,
      issuedDate: issuedDate || undefined,
      dueDate: dueDate || undefined,
    };

    const result = isEditing
      ? await updateInvoice(invoice!.id, data)
      : await createInvoice(data);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || "Something went wrong");
      return;
    }

    onSuccess();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-900">
          {isEditing ? "Edit Invoice" : "Add Invoice"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Invoice Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="INV-001"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Customer</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
            >
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Project</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
            >
              <option value="">Select project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tax</label>
              <input
                type="number"
                step="0.01"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                placeholder="0.00"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
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
              <label className="block text-sm font-medium text-gray-700">Issued Date</label>
              <input
                type="date"
                value={issuedDate}
                onChange={(e) => setIssuedDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "Paid" | "Pending" | "Overdue")}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditing ? "Saving…" : "Creating…"
                : isEditing ? "Save Changes" : "Add Invoice"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
