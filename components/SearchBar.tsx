"use client";

import { Search } from "lucide-react";

export function SearchBar({
  placeholder = "Search here",
  className = "",
  inputClassName = "",
}: {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        className={`h-full w-full rounded-lg bg-white pl-5 pr-12 text-sm text-zinc-700 shadow-md outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-200 ${inputClassName}`}
      />
      <Search className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
    </div>
  );
}
