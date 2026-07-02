"use client";

import { ChevronRight } from "lucide-react";

/**
 * Consistent pagination row used across list pages.
 */
export function Pagination({
  page = 1,
  pageCount = 3,
  rangeLabel,
  onPageChange,
}: {
  page?: number;
  pageCount?: number;
  rangeLabel: string;
  onPageChange?: (page: number) => void;
}) {
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-zinc-600">{rangeLabel}</p>
      <div className="flex items-center gap-2">
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange?.(p)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? "bg-sky-500 text-white"
                : "text-zinc-600 hover:bg-black/5"
            }`}
          >
            {p}
          </button>
        ))}
        <span className="px-1 text-zinc-400">...</span>
        <button
          type="button"
          aria-label="Next page"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-black/5"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
