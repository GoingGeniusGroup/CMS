"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Plus, Search, Wallet } from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { StatsCard } from "@/components/invoices/StatsCard";
import { InvoiceTable } from "@/components/invoices/InvoiceTable";
import { Pagination } from "@/components/invoices/Pagination";
import { INVOICES } from "@/components/invoices/data";
import type { Invoice } from "@/components/invoices/types";

type SortKey = keyof Pick<Invoice, "id" | "subject" | "clientName" | "amount" | "issueDate" | "dueDate" | "status">;
type SortDir = "asc" | "desc";

const PAGE_SIZE = 5;

const STATS = [
  { label: "Total Invoices",   value: "128,000" },
  { label: "Paid Invoices",    value: "82,500"  },
  { label: "Pending Invoices", value: "34,500"  },
  { label: "Overdue Invoices", value: "11,000"  },
];

export default function InvoicesPage() {
  const [query, setQuery]           = useState("");
  const [sortKey, setSortKey]       = useState<SortKey>("id");
  const [sortDir, setSortDir]       = useState<SortDir>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading]       = useState(true);

  // Simulate an initial data load
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Reset to page 1 when query changes
  useEffect(() => { setCurrentPage(1); }, [query]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setCurrentPage(1);
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return INVOICES.filter(
      (inv) =>
        inv.id.toLowerCase().includes(q) ||
        inv.subject.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q) ||
        inv.status.toLowerCase().includes(q)
    );
  }, [query]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey].toLowerCase();
      const bv = b[sortKey].toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated  = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6 bg-[#F8FAFC] min-h-screen">
      {/* Topbar */}
      <Topbar />

      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
            Invoices
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Manage and track all your invoices.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#374151] shadow-sm transition-colors hover:bg-zinc-50"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#4338CA]"
          >
            Add Invoices
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => (
          <StatsCard key={s.label} icon={Wallet} value={s.value} label={s.label} />
        ))}
      </div>

      {/* List section */}
      <div className="flex flex-col gap-4">
        {/* List header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-[#111827] sm:text-2xl">
            Invoices List
          </h2>
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Invoices..."
              className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-white pl-4 pr-10 text-sm text-[#374151] outline-none placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#4F46E5]/30"
              aria-label="Search invoices"
            />
            <Search className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9CA3AF]" />
          </div>
        </div>

        {/* Table */}
        <InvoiceTable
          invoices={paginated}
          loading={loading}
          query={query}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
        />

        {/* Pagination */}
        {!loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalEntries={sorted.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
