"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Plus, Search, Wallet } from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { StatsCard } from "@/components/invoices/StatsCard";
import { InvoiceTable } from "@/components/invoices/InvoiceTable";
import { Pagination } from "@/components/invoices/Pagination";
import { INVOICES } from "@/components/invoices/data";
import type { Invoice } from "@/components/invoices/types";

type SortKey = keyof Pick<
  Invoice,
  "id" | "subject" | "clientName" | "amount" | "issueDate" | "dueDate" | "status"
>;
type SortDir = "asc" | "desc";

const PAGE_SIZE = 5;

const STATS = [
  { label: "Total Invoices",   value: "128,000" },
  { label: "Paid Invoices",    value: "82,500"  },
  { label: "Pending Invoices", value: "34,500"  },
  { label: "Overdue Invoices", value: "11,000"  },
];

export default function InvoicesPage() {
  const [query, setQuery]             = useState("");
  const [sortKey, setSortKey]         = useState<SortKey>("id");
  const [sortDir, setSortDir]         = useState<SortDir>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

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
        inv.status.toLowerCase().includes(q),
    );
  }, [query]);

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        const av = a[sortKey].toLowerCase();
        const bv = b[sortKey].toLowerCase();
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      }),
    [filtered, sortKey, sortDir],
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated  = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    // Mobile: 16px padding | Tablet: 24px | Desktop: 32px
    <div className="flex min-h-screen flex-col gap-4 bg-[#F8FAFC] px-4 pb-8 sm:gap-6 md:px-6 lg:px-8">

      {/* ── Topbar ── */}
      <Topbar />

      {/* ── Page header ── */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#111827] sm:text-2xl lg:text-3xl">
            Invoices
          </h1>
          <p className="mt-0.5 text-sm text-[#6B7280]">
            Manage and track all your invoices.
          </p>
        </div>

        {/* Action buttons — side-by-side on all sizes, stack only below 360px */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#374151] shadow-sm transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <Filter className="h-4 w-4 shrink-0" />
            Filter
          </button>
          <button
            type="button"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#4F46E5] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#4338CA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
          >
            Add Invoices
            <Plus className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </header>

      {/* ── Stats grid ──
           Mobile:       1 col
           Small tablet: 2 cols
           Large tablet: 4 cols (enough space by 768px)
      */}
      <section aria-label="Invoice statistics">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <StatsCard key={s.label} icon={Wallet} value={s.value} label={s.label} />
          ))}
        </div>
      </section>

      {/* ── Invoice list section ── */}
      <section aria-label="Invoice list" className="flex flex-col gap-4">

        {/* List header row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-[#111827] sm:text-xl lg:text-2xl">
            Invoices List
          </h2>

          {/* Search — full width on mobile, fixed width on sm+ */}
          <div className="relative w-full sm:w-64 lg:w-80">
            <label htmlFor="invoice-search" className="sr-only">Search invoices</label>
            <input
              id="invoice-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Invoices..."
              className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-white pl-4 pr-11 text-sm text-[#374151] outline-none placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#4F46E5]/40"
            />
            <Search
              className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9CA3AF]"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Table — horizontal scroll on mobile, sticky header */}
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
      </section>
    </div>
  );
}
