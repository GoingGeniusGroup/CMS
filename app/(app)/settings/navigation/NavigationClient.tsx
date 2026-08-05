"use client";

import { useMemo, useState, useTransition } from "react";
import { PanelLeft } from "lucide-react";
import { Card } from "@/components/Card";
import { useConfig } from "@/components/ConfigProvider";
import { navItems } from "@/components/Sidebar";
import { saveSidebarModuleConfig } from "@/app/actions/sidebar-nav";
import { cn } from "@/lib/utils";

type Row = {
  key: string;
  label: string;
  parentKey?: string;
};

function Toggle({ on, onToggle, disabled, ariaLabel }: {
  on: boolean;
  onToggle: () => void;
  disabled: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors",
        on ? "bg-emerald-500" : "bg-zinc-300",
        disabled && "cursor-not-allowed opacity-40"
      )}
    >
      <span className={cn("absolute top-1 h-5 w-5 rounded-full bg-white transition-all", on ? "left-6" : "left-1")} />
    </button>
  );
}

function keyOf(item: { id?: string; labelKey?: string; href: string }) {
  return item.id ?? item.labelKey ?? item.href;
}

export default function NavigationClient({
  initialDisabled,
}: {
  initialDisabled: string[];
}) {
  const [disabled, setDisabled] = useState<Set<string>>(new Set(initialDisabled));
  const [baseline, setBaseline] = useState<string[]>(initialDisabled);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { entityLabel, refreshConfig } = useConfig();

  const rows: Row[] = useMemo(() => {
    const core = navItems.filter((item) => item.href !== "/dashboard" && item.href !== "/settings");
    const out: Row[] = [];
    for (const item of core) {
      const label = item.labelKey
        ? entityLabel(item.labelKey, { plural: true }) || item.labelKey
        : item.label ?? item.href;
      const key = keyOf(item);
      out.push({ key, label });
      if (item.children) {
        for (const child of item.children) {
          const childLabel = child.labelKey
            ? entityLabel(child.labelKey, { plural: true }) || child.labelKey
            : child.label ?? child.href;
          out.push({ key: keyOf(child), label: childLabel, parentKey: key });
        }
      }
    }
    return out;
  }, [entityLabel]);

  const isOn = (key: string) => !disabled.has(key);
  const parentOff = (parentKey?: string) =>
    parentKey ? disabled.has(parentKey) : false;

  function toggle(key: string) {
    setDisabled((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
    setMessage(null);
  }

  function handleCancel() {
    setDisabled(new Set(baseline));
    setMessage(null);
  }

  function handleSave() {
    setMessage(null);
    const disabledList = Array.from(disabled);
    startTransition(async () => {
      const res = await saveSidebarModuleConfig(disabledList);
      if (res.success) {
        setBaseline(disabledList);
        await refreshConfig();
        setMessage({ type: "success", text: "Sidebar modules updated." });
      } else {
        setMessage({ type: "error", text: res.error ?? "Failed to save." });
      }
    });
  }

  const hasChanges = JSON.stringify(Array.from(disabled).sort()) !== JSON.stringify([...baseline].sort());

  return (
    <>
      <div className="sticky top-0 z-10 mb-6 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <PanelLeft className="h-4 w-4" />
            </span>
            <div>
              <h1 className="text-base font-bold text-amber-500 sm:text-lg">Sidebar Modules</h1>
              <p className="text-xs text-zinc-500">
                Show or hide modules in the admin sidebar.
              </p>
            </div>
          </div>
          {hasChanges && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
              >
                {isPending ? "Saving…" : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>

      {message && (
        <p
          className={`mb-6 rounded-lg px-4 py-2 text-sm font-medium ${
            message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          {message.text}
        </p>
      )}

      <Card>
        <ul className="divide-y divide-zinc-100">
          {rows.map((row) => {
            const on = isOn(row.key);
            const parentOffValue = parentOff(row.parentKey);
            return (
              <li
                key={row.key}
                className={cn("flex items-center justify-between gap-3 px-5 py-3", row.parentKey && "pl-10")}
              >
                <span
                  className={cn(
                    "text-sm font-medium text-zinc-800",
                    row.parentKey && "text-zinc-500",
                    parentOffValue && "text-zinc-400"
                  )}
                >
                  {row.label}
                  {row.parentKey && !parentOffValue && (
                    <span className="ml-2 text-xs font-normal text-zinc-400">sub-module</span>
                  )}
                  {parentOffValue && (
                    <span className="ml-2 text-xs font-normal text-zinc-400">hidden by parent</span>
                  )}
                </span>
                <Toggle
                  on={on && !parentOffValue}
                  onToggle={() => toggle(row.key)}
                  disabled={parentOffValue}
                  ariaLabel={`Toggle ${row.label}`}
                />
              </li>
            );
          })}
        </ul>
      </Card>
    </>
  );
}