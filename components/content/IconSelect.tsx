"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { getHeroStatIcon } from "@/lib/content/hero-icons";
import { getSiteIcons } from "@/app/actions/icons";

/**
 * Icon picker for section forms. Loads the enabled icon list (Settings > Icons
 * controls which subset of `lib/content/hero-icons.ts` is offered) and renders
 * a dropdown with a live preview of each option, so admins pick an icon
 * visually instead of typing a name. Selecting the empty entry clears the
 * icon (stored as `undefined`, matching existing schemas).
 */
export function IconSelect({
  value,
  onChange,
  placeholder = "Select an icon…",
}: {
  value?: string | null;
  onChange: (name?: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [icons, setIcons] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    getSiteIcons()
      .then((names) => {
        if (!cancelled) setIcons(names);
      })
      .catch(() => {
        if (!cancelled) setIcons([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", onDocClick);
      inputRef.current?.focus();
    }
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? icons.filter((name) => name.includes(q)) : icons;
  }, [icons, query]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 outline-none transition-colors focus:border-indigo-400 focus:bg-white"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-700">
          {[value].filter(Boolean).map((name) => {
            const Icon = name ? getHeroStatIcon(name) : null;
            return Icon ? <Icon key={name} className="h-4 w-4" /> : null;
          })}
        </span>
        <span className={`flex-1 truncate text-left ${value ? "" : "text-zinc-400"}`}>
          {value ?? placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full rounded-xl border border-zinc-200 bg-white p-2 shadow-lg">
          <div className="relative mb-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search icons…"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-8 py-1.5 text-sm text-zinc-700 outline-none focus:border-indigo-400 focus:bg-white"
            />
          </div>
          <div role="listbox" className="max-h-56 overflow-y-auto">
            <button
              type="button"
              role="option"
              aria-selected={!value}
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-50"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-100 text-[10px] font-bold uppercase text-zinc-400">
                ∅
              </span>
              <span className="flex-1">No icon</span>
              {!value && <Check className="h-4 w-4 text-indigo-600" />}
            </button>
            {filtered.map((name) => {
              const active = value === name;
              return (
                <button
                  key={name}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(name);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-zinc-50 ${active ? "bg-indigo-50 text-indigo-700" : "text-zinc-600"}`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-700">
                    {[name].map((n) => {
                      const Icon = getHeroStatIcon(n);
                      return Icon ? <Icon className="h-4 w-4" /> : null;
                    })}
                  </span>
                  <span className="flex-1 truncate">{name}</span>
                  {active && <Check className="h-4 w-4 text-indigo-600" />}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="px-2.5 py-3 text-sm text-zinc-400">No icons match your search.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}