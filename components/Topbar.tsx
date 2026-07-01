"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { TopbarActions } from "@/components/TopbarActions";

/**
 * Top navigation bar. Import and render it at the top of any page.
 *
 * - `<Topbar />`                    → search bar + icons + logo
 * - `<Topbar showSearch={false} />` → only icons + logo
 */
export function Topbar({ showSearch = true }: { showSearch?: boolean }) {
  // On mobile the search bar is hidden by default and toggled via icon
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="mb-4 w-full sm:mb-6">
      {/* ── Main row ── */}
      <div
        className={`flex w-full items-center gap-2 sm:gap-4 ${
          showSearch ? "justify-between" : "justify-end"
        }`}
      >
        {/* Search bar:
            - hidden on mobile (< sm), replaced by the icon toggle below
            - visible and flex-1 from sm upwards               */}
        {showSearch ? (
          <SearchBar className="hidden h-11 min-w-0 flex-1 sm:flex sm:h-12 lg:h-14" />
        ) : null}

        {/* Right-side actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Mobile search toggle — visible only below sm when showSearch is true */}
          {showSearch ? (
            <button
              type="button"
              aria-label={mobileSearchOpen ? "Close search" : "Open search"}
              onClick={() => setMobileSearchOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-500 shadow-md transition-colors hover:bg-zinc-50 sm:hidden"
            >
              {mobileSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>
          ) : null}

          <TopbarActions />
        </div>
      </div>

      {/* ── Mobile expanded search row (below sm, when open) ── */}
      {showSearch && mobileSearchOpen ? (
        <div className="mt-3 sm:hidden">
          <SearchBar
            className="h-11 w-full"
            placeholder="Search here"
          />
        </div>
      ) : null}
    </header>
  );
}
