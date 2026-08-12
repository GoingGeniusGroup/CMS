"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { getHeroStatIcon } from "@/lib/content/hero-icons";
import { getSiteIcons, getCustomIcons, type CustomIconData } from "@/app/actions/icons";

/**
 * Icon picker for section forms. Loads the enabled icon list (Settings > Icons
 * controls which subset of `lib/content/hero-icons.ts` is offered) plus any
 * custom uploaded icons, and renders a dropdown with a live preview so admins
 * pick an icon visually instead of typing a name.
 */
export function IconSelect({
  value,
  onChange,
  placeholder = "Select an icon...",
}: {
  value?: string | null;
  onChange: (name?: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [icons, setIcons] = useState<string[]>([]);
  const [customIcons, setCustomIcons] = useState<CustomIconData[]>([]);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getSiteIcons(), getCustomIcons()])
      .then(([builtIn, custom]) => {
        if (!cancelled) {
          setIcons(builtIn);
          setCustomIcons(custom);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIcons([]);
          setCustomIcons([]);
        }
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

  const filteredBuiltIn = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? icons.filter((name) => name.includes(q)) : icons;
  }, [icons, query]);

  const filteredCustom = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? customIcons.filter((i) => i.name.includes(q)) : customIcons;
  }, [customIcons, query]);

  // Check if the current value is a custom icon
  const customIconMap = useMemo(() => {
    const map = new Map<string, CustomIconData>();
    for (const ci of customIcons) map.set(`custom:${ci.id}`, ci);
    return map;
  }, [customIcons]);

  const isCustomValue = value?.startsWith("custom:");
  const currentCustomIcon = isCustomValue ? customIconMap.get(value!) : null;

  /** Render the icon preview (built-in or custom) */
  function renderIconPreview(iconValue: string | null | undefined, size: "sm" | "md" = "sm") {
    if (!iconValue) return null;
    if (iconValue.startsWith("custom:")) {
      const ci = customIconMap.get(iconValue);
      if (!ci) return null;
      const cls = size === "sm" ? "h-4 w-4" : "h-4 w-4";
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={ci.url} alt={ci.name} className={`${cls} object-contain`} />;
    }
    const Icon = getHeroStatIcon(iconValue);
    return Icon ? <Icon className="h-4 w-4" /> : null;
  }

  function getDisplayName(iconValue: string | null | undefined): string {
    if (!iconValue) return placeholder;
    if (iconValue.startsWith("custom:")) {
      const ci = customIconMap.get(iconValue);
      return ci ? ci.name : iconValue;
    }
    return iconValue;
  }

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
          {renderIconPreview(value)}
        </span>
        <span className={`flex-1 truncate text-left ${value ? "" : "text-zinc-400"}`}>
          {getDisplayName(value)}
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
              placeholder="Search icons..."
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-8 py-1.5 text-sm text-zinc-700 outline-none focus:border-indigo-400 focus:bg-white"
            />
          </div>
          <div role="listbox" className="max-h-56 overflow-y-auto">
            {/* No icon option */}
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
                &empty;
              </span>
              <span className="flex-1">No icon</span>
              {!value && <Check className="h-4 w-4 text-indigo-600" />}
            </button>

            {/* Custom icons section */}
            {filteredCustom.length > 0 && (
              <>
                <div className="px-2.5 pb-1 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Custom Icons</span>
                </div>
                {filteredCustom.map((ci) => {
                  const iconValue = `custom:${ci.id}`;
                  const active = value === iconValue;
                  return (
                    <button
                      key={ci.id}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        onChange(iconValue);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-zinc-50 ${active ? "bg-indigo-50 text-indigo-700" : "text-zinc-600"}`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ci.url} alt={ci.name} className="h-4 w-4 object-contain" />
                      </span>
                      <span className="flex-1 truncate">{ci.name}</span>
                      {active && <Check className="h-4 w-4 text-indigo-600" />}
                    </button>
                  );
                })}
              </>
            )}

            {/* Built-in icons section */}
            {filteredBuiltIn.length > 0 && (
              <>
                {filteredCustom.length > 0 && (
                  <div className="px-2.5 pb-1 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Built-in Icons</span>
                  </div>
                )}
                {filteredBuiltIn.map((name) => {
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
                        {(() => {
                          const Icon = getHeroStatIcon(name);
                          return Icon ? <Icon className="h-4 w-4" /> : null;
                        })()}
                      </span>
                      <span className="flex-1 truncate">{name}</span>
                      {active && <Check className="h-4 w-4 text-indigo-600" />}
                    </button>
                  );
                })}
              </>
            )}

            {filteredBuiltIn.length === 0 && filteredCustom.length === 0 && (
              <p className="px-2.5 py-3 text-sm text-zinc-400">No icons match your search.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
