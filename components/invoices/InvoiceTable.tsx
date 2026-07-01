"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import type { Invoice } from "./types";
import { StatusBadge } from "./StatusBadge";
import { ActionButtons } from "./ActionButtons";
import { EmptyState } from "./EmptyState";
import { LoadingSkeleton } from "./LoadingSkeleton";

type SortKey = keyof Pick<
  Invoice,
  "id" | "subject" | "clientName" | "amount" | "issueDate" | "dueDate" | "status"
>;
type SortDir = "asc" | "desc";

interface InvoiceTableProps {
  invoices: Invoice[];
  loading: boolean;
  query: string;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}

const COLUMNS: { key: SortKey; label: string; minW?: string }[] = [
  { key: "id",         label: "Invoice ID",  minW: "min-w-[110px]" },
  { key: "subject",    label: "Subject",     minW: "min-w-[140px]" },
  { key: "clientName", label: "Client Name", minW: "min-w-[120px]" },
  { key: "amount",     label: "Amount",      minW: "min-w-[100px]" },
  { key: "issueDate",  label: "Issue Date",  minW: "min-w-[110px]" },
  { key: "dueDate",    label: "Due Date",    minW: "min-w-[110px]" },
  { key: "status",     label: "Status",      minW: "min-w-[100px]" },
];

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronUp className="h-3 w-3 text-zinc-300" aria-hidden="true" />;
  return dir === "asc"
    ? <ChevronUp   className="h-3 w-3 text-[#4F46E5]" aria-hidden="true" />
    : <ChevronDown className="h-3 w-3 text-[#4F46E5]" aria-hidden="true" />;
}

export function InvoiceTable({
  invoices, loading, query, sortKey, sortDir, onSort,
}: InvoiceTableProps) {
  return (
    /* overflow-x-auto keeps horizontal scroll inside this box only,
       preventing it from affecting the rest of the page layout        */
    <div className="w-full overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
      <table className="w-full border-collapse text-sm" role="grid">
        <thead>
          <tr className="border-b border-[#E5E7EB] bg-white">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`whitespace-nowrap px-4 py-3.5 text-left lg:py-4 ${col.minW ?? ""}`}
              >
                <button
                  type="button"
                  onClick={() => onSort(col.key)}
                  className="inline-flex items-center gap-1 rounded font-bold text-[#111827] transition-colors hover:text-[#4F46E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                  aria-sort={
                    sortKey === col.key
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  {col.label}
                  <SortIcon active={sortKey === col.key} dir={sortDir} />
                </button>
              </th>
            ))}
            <th
              scope="col"
              className="whitespace-nowrap px-4 py-3.5 text-left font-bold text-[#111827] lg:py-4"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#E5E7EB]">
          {loading ? (
            <LoadingSkeleton />
          ) : invoices.length === 0 ? (
            <EmptyState query={query} />
          ) : (
            invoices.map((inv) => (
              <tr
                key={inv.id}
                className="transition-colors hover:bg-zinc-50 focus-within:bg-zinc-50"
              >
                <td className="whitespace-nowrap px-4 py-3 font-medium text-[#4F46E5]">
                  {inv.id}
                </td>
                <td className="px-4 py-3 text-[#374151]">{inv.subject}</td>
                <td className="whitespace-nowrap px-4 py-3 text-[#374151]">{inv.clientName}</td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-[#111827]">{inv.amount}</td>
                <td className="whitespace-nowrap px-4 py-3 text-[#6B7280]">{inv.issueDate}</td>
                <td className="whitespace-nowrap px-4 py-3 text-[#6B7280]">{inv.dueDate}</td>
                <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                <td className="px-4 py-3"><ActionButtons /></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
