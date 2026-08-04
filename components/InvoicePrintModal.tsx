"use client";

import { Printer, X } from "lucide-react";
import { useStatusBadge } from "@/components/ConfigProvider";
import { useState, useEffect } from "react";
import { getGeneralSettings } from "@/app/actions/general-settings";

type Invoice = {
  id: string;
  invoiceNumber: string;
  customerId: string | null;
  category: string | null;
  customer: { id: string; fullName: string } | null;
  projects: { project: { id: string; title: string } }[];
  amount: number;
  tax: number;
  total: number;
  status: string;
  issuedDate: Date | null;
  dueDate: Date | null;
};

export function InvoicePrintModal({
  open,
  onClose,
  invoice,
  companyName = "Your Company",
  companyAddress = "",
  companyEmail = "",
  companyPhone = "",
}: {
  open: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  companyName?: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
}) {
  const statusOption = useStatusBadge("invoice", invoice?.status ?? "");
  const statusColor = statusOption?.color ?? "#6b7280";
  const statusLabel = statusOption?.label ?? invoice?.status ?? "";
  const [currencySymbol, setCurrencySymbol] = useState("Rs.");

  // Load currency from settings
  useEffect(() => {
    async function loadCurrency() {
      const settings = await getGeneralSettings();
      if (settings && settings.currencySymbol) {
        setCurrencySymbol(settings.currencySymbol);
      }
    }
    if (open) {
      loadCurrency();
    }
  }, [open]);

  if (!open || !invoice) return null;

  function formatDate(date: Date | null) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 print:bg-white print:p-0">
      <div className="relative max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl print:max-h-none print:overflow-visible print:shadow-none">
        {/* Screen-only header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 print:hidden">
          <h2 className="text-lg font-bold text-zinc-900">Invoice Preview</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ─── Printable Invoice Content ─── */}
        <div className="print-content px-6 pb-8 pt-6 sm:px-10 sm:pb-10 sm:pt-8">
          {/* Header Row */}
          <div className="mb-8 flex items-start justify-between border-b-2 border-zinc-900 pb-6">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">INVOICE</h1>
              <p className="mt-1 text-sm text-zinc-500">#{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-zinc-900">{companyName}</p>
              {companyAddress && <p className="text-sm text-zinc-500">{companyAddress}</p>}
              {companyPhone && <p className="text-sm text-zinc-500">{companyPhone}</p>}
              {companyEmail && <p className="text-sm text-zinc-500">{companyEmail}</p>}
            </div>
          </div>

          {/* Bill To + Dates */}
          <div className="mb-8 grid grid-cols-2 gap-8">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">Bill To</p>
              <p className="text-base font-semibold text-zinc-900">
                {invoice.customer?.fullName || "N/A"}
              </p>
              {invoice.category && (
                <p className="text-sm text-zinc-500">Category: {invoice.category}</p>
              )}
            </div>
            <div className="space-y-1 text-right">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Invoice Date:</span>
                <span className="font-medium text-zinc-900">{formatDate(invoice.issuedDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Due Date:</span>
                <span className="font-medium text-zinc-900">{formatDate(invoice.dueDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Status:</span>
                <span
                  className="inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                  style={{ backgroundColor: `${statusColor}1a`, color: statusColor, borderColor: `${statusColor}66` }}
                >
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Projects Table */}
          <table className="mb-6 w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-zinc-300 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <th className="pb-3 pr-4">#</th>
                <th className="pb-3 pr-4">Item / Project</th>
                <th className="pb-3 pr-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.projects?.length > 0 ? (
                invoice.projects.map((p, i) => (
                  <tr key={p.project.id} className="border-b border-zinc-100">
                    <td className="py-3 pr-4 text-sm text-zinc-400">{i + 1}</td>
                    <td className="py-3 pr-4 text-sm font-medium text-zinc-900">{p.project.title}</td>
                    <td className="py-3 pr-4 text-right text-sm text-zinc-900">
                      {currencySymbol} {(invoice.amount / invoice.projects.length).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-3 pr-4 text-sm text-zinc-400">1</td>
                  <td className="py-3 pr-4 text-sm text-zinc-900">General Service</td>
                  <td className="py-3 pr-4 text-right text-sm text-zinc-900">{currencySymbol} {invoice.amount.toLocaleString()}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mb-8 ml-auto w-full max-w-xs space-y-1.5 border-t-2 border-zinc-300 pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Subtotal</span>
              <span className="text-zinc-900">{currencySymbol} {invoice.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Tax</span>
              <span className="text-zinc-900">{currencySymbol} {invoice.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-zinc-200 pt-1.5 text-base font-bold">
              <span className="text-zinc-900">Total</span>
              <span className="text-zinc-900">{currencySymbol} {invoice.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-zinc-200 pt-4 text-center text-xs text-zinc-400">
            <p>Thank you for your business!</p>
            <p className="mt-0.5">For inquiries, contact {companyEmail || "accounts@yourcompany.com"}</p>
          </div>
        </div>


      </div>

      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-content {
            padding: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}
