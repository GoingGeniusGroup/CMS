"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useThemeMode, type ThemePreference } from "@/components/ThemeModeProvider";

const OPTIONS: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

/** A compact popover prevents the theme control competing with navigation on small headers. */
export function ThemeSelector({ compact = false }: { compact?: boolean }) {
  const { preference, resolvedTheme, setPreference } = useThemeMode();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = OPTIONS.find((option) => option.value === preference) ?? OPTIONS[2];
  const ActiveIcon = resolvedTheme === "dark" ? Moon : Sun;

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  if (!compact) {
    return (
      <div className="inline-flex items-center gap-0.5 rounded-full bg-[var(--color-surface-sunken)] p-1 text-[var(--color-text-muted)]" aria-label="Color theme" role="group">
        {OPTIONS.map(({ value, label, Icon }) => {
          const selected = preference === value;
          return (
            <button key={value} type="button" onClick={() => setPreference(value)} aria-pressed={selected}
              className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] ${selected ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm" : "hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]"}`}>
              <Icon className="h-3.5 w-3.5" aria-hidden="true" /><span>{label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="menu" aria-label={`Theme: ${active.label}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-surface-sunken)] text-[var(--color-text)] transition-colors hover:bg-[var(--color-primary-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]">
        <ActiveIcon className="h-4 w-4" aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-[70] mt-2 w-36 rounded-xl bg-[var(--color-surface-raised)] p-1.5 text-[var(--color-text)] shadow-xl ring-1 ring-black/10 dark:ring-white/10">
          {OPTIONS.map(({ value, label, Icon }) => (
            <button key={value} type="button" role="menuitemradio" aria-checked={preference === value}
              onClick={() => { setPreference(value); setOpen(false); }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors hover:bg-[var(--color-surface-sunken)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]">
              <Icon className="h-3.5 w-3.5" aria-hidden="true" /><span className="flex-1">{label}</span>
              {preference === value && <Check className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
