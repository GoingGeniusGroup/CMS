"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalEntries,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalEntries);

  const pages: (number | "...")[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-base font-semibold text-[#111827]">
        Showing {from} to {to} of {totalEntries} entries
      </p>

      <nav aria-label="Pagination" className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-1 text-sm text-zinc-400">
              ...
            </span>
          ) : (
            <button
              key={p}
              type="button"
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? "page" : undefined}
              onClick={() => onPageChange(p as number)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === currentPage
                  ? "bg-[#4F46E5] text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          aria-label="Next page"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
