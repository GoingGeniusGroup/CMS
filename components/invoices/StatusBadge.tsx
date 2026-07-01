import type { InvoiceStatus } from "./types";

const styles: Record<InvoiceStatus, string> = {
  Paid:    "bg-emerald-100 text-emerald-600",
  Pending: "bg-amber-100   text-amber-600",
  Overdue: "bg-red-100     text-red-500",
};

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}
