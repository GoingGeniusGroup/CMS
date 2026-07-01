"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import type { Invoice } from "./types";
import { StatusBadge } from "./StatusBadge";
import { ActionButtons } from "./ActionButtons";
import { EmptyState } from "./EmptyState";
import { LoadingSkeleton } from "./LoadingSkeleton";

type SortKey = keyof Pick<Invoice, "id" | "subject" | "clientName" | "amount" | "issueDate" | "dueDate" | "status">;
type SortDir = "asc" | "desc";

interface InvoiceTableProps {
  invoices: Invoice[];
  loading: boolean;
  query: string;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "id",         label: "Invoice ID"   },
  { key: "subject",    label: "Subject"      },
  { key: "clientName", label: "Client Name"  },
  { key: "amount",     label: "Amount"       },
  { key: "issueDate",  label: "Issue Date"   },
  { key: "dueDate",    label: "Due Date"     },
  { key: "status",     label: "Status"       },
];

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronUp className="h-3 w-3 text-zinc-300" />;
  return dir === "asc"
    ? <ChevronUp className="h-3 w-3 text-[#4F46E5]" />
    : <ChevronDown className="h-3 w-3 text-[#4F46E5]" />;
}

export function InvoiceTable({ invoices, loading, query, sortKey, sortDir, onSort }: InvoiceTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
      <table className="w-full min-w-[900px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className="px-4 py-4 text-left"
              >
                <button
                  type="button"
                  onClick={() => onSort(col.key)}
                  className="inline-flex items-center gap-1 font-bold text-[#111827] hover:text-[#4F46E5]"
                >
                  {col.label}
                  <SortIcon active={sortKey === col.key} dir={sortDir} />
                </button>
              </th>
            ))}
            <th className="px-4 py-4 text-left font-bold text-[#111827]">Actions</th>
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
                className="transition-colors hover:bg-zinc-50"
              >
                <td className="px-4 py-3 font-medium text-[#4F46E5]">{inv.id}</td>
                <td className="px-4 py-3 text-[#374151]">{inv.subject}</td>
                <td className="px-4 py-3 text-[#374151]">{inv.clientName}</td>
                <td className="px-4 py-3 font-medium text-[#111827]">{inv.amount}</td>
                <td className="px-4 py-3 text-[#6B7280]">{inv.issueDate}</td>
                <td className="px-4 py-3 text-[#6B7280]">{inv.dueDate}</td>
                <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                <td className="px-4 py-3">
                  <ActionButtons />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
