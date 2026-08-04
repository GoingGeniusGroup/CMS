"use client";

import { useState, useTransition } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff, LayoutTemplate, Pencil } from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { SECTION_REGISTRY, type SectionKey } from "@/lib/content/schemas";
import { toggleSection, reorderSections, type SiteContentSection } from "@/app/actions/site-content";
import { SectionEditorModal } from "./SectionEditorModal";

type SectionRow = SiteContentSection;
type PageGroup = { pageKey: string; label: string; sections: SectionRow[] };

/**
 * The full editor shell (Task 13, extended in Phase 18/Task 18 to cover every
 * page rather than just home/shared): a page-tabbed list, each row
 * reorderable and toggleable, opening a kind-specific form via
 * `SectionEditorModal` (Task 14/15) with a live preview (Task 18).
 */
export function LandingPageClient({ pages }: { pages: PageGroup[] }) {
  const [groups, setGroups] = useState(pages);
  const [activePageKey, setActivePageKey] = useState(pages[0]?.pageKey ?? "");
  const [editing, setEditing] = useState<SectionRow | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const activeGroup = groups.find((g) => g.pageKey === activePageKey) ?? groups[0];

  function notify(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  function updateGroupRows(pageKey: string, updater: (rows: SectionRow[]) => SectionRow[]) {
    setGroups((prev) =>
      prev.map((g) => (g.pageKey === pageKey ? { ...g, sections: updater(g.sections) } : g))
    );
  }

  function handleToggle(pageKey: string, row: SectionRow) {
    const nextVisible = !row.isVisible;
    updateGroupRows(pageKey, (rows) =>
      rows.map((r) => (r.sectionKey === row.sectionKey ? { ...r, isVisible: nextVisible } : r))
    );
    startTransition(async () => {
      const result = await toggleSection(pageKey, row.sectionKey, nextVisible);
      if (!result.success) {
        updateGroupRows(pageKey, (rows) =>
          rows.map((r) => (r.sectionKey === row.sectionKey ? { ...r, isVisible: row.isVisible } : r))
        );
        notify("error", result.error ?? "Failed to update visibility");
      }
    });
  }

  function handleMove(pageKey: string, rows: SectionRow[], index: number, direction: "up" | "down") {
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= rows.length) return;

    const reordered = [...rows];
    [reordered[index], reordered[swapWith]] = [reordered[swapWith], reordered[index]];
    const withOrder = reordered.map((r, i) => ({ ...r, order: i }));
    updateGroupRows(pageKey, () => withOrder);

    startTransition(async () => {
      const result = await reorderSections(pageKey, withOrder.map((r) => r.sectionKey));
      if (!result.success) {
        updateGroupRows(pageKey, () => rows); // revert
        notify("error", result.error ?? "Failed to reorder sections");
      }
    });
  }

  function handleSaved(pageKey: string, sectionKey: SectionKey, data: unknown) {
    updateGroupRows(pageKey, (rows) =>
      rows.map((r) => (r.sectionKey === sectionKey ? ({ ...r, data } as SectionRow) : r))
    );
    setEditing(null);
    notify("success", "Section updated.");
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar showSearch={false} />

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader
          title="Landing Page"
          description="Manage the text, headings, and cards shown across your public-facing pages."
        />
      </div>

      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            message.type === "success"
              ? "border border-green-200 bg-green-50 text-green-700"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Page tabs */}
      <div className="flex flex-wrap gap-2">
        {groups.map((g) => (
          <button
            key={g.pageKey}
            type="button"
            onClick={() => setActivePageKey(g.pageKey)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activePageKey === g.pageKey
                ? "bg-amber-500 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {activeGroup && (
        <SectionList
          rows={activeGroup.sections}
          isPending={isPending}
          onToggle={(row) => handleToggle(activeGroup.pageKey, row)}
          onMove={(index, dir) => handleMove(activeGroup.pageKey, activeGroup.sections, index, dir)}
          onEdit={setEditing}
        />
      )}

      <SectionEditorModal
        row={editing}
        onClose={() => setEditing(null)}
        onSaved={(data) => editing && handleSaved(editing.pageKey, editing.sectionKey, data)}
      />
    </div>
  );
}

function SectionList({
  rows,
  isPending,
  onToggle,
  onMove,
  onEdit,
}: {
  rows: SectionRow[];
  isPending: boolean;
  onToggle: (row: SectionRow) => void;
  onMove: (index: number, direction: "up" | "down") => void;
  onEdit: (row: SectionRow) => void;
}) {
  return (
    <Card noPadding className="overflow-hidden">
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
          <LayoutTemplate className="h-10 w-10 text-zinc-300" />
          <p className="text-sm text-zinc-500">No sections registered yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-100">
          {rows.map((row, index) => {
            const entry = SECTION_REGISTRY[row.sectionKey];
            return (
              <div
                key={row.sectionKey}
                className={`flex items-center gap-3 px-6 py-4 transition-opacity ${
                  row.isVisible ? "" : "opacity-50"
                }`}
              >
                {/* Reorder */}
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => onMove(index, "up")}
                    disabled={isPending || index === 0}
                    aria-label={`Move ${entry.label} up`}
                    className="rounded p-0.5 text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMove(index, "down")}
                    disabled={isPending || index === rows.length - 1}
                    aria-label={`Move ${entry.label} down`}
                    className="rounded p-0.5 text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                {/* Label */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-900">{entry.label}</p>
                  <p className="truncate text-xs text-zinc-500">{summarize(row)}</p>
                </div>

                {/* Visibility toggle */}
                <button
                  type="button"
                  onClick={() => onToggle(row)}
                  disabled={isPending}
                  aria-label={row.isVisible ? `Hide ${entry.label}` : `Show ${entry.label}`}
                  aria-pressed={row.isVisible}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                    row.isVisible
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                  }`}
                >
                  {row.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {row.isVisible ? "Visible" : "Hidden"}
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => onEdit(row)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

/** One-line preview of a section's current content, shown under its label. */
function summarize(row: SectionRow): string {
  const data = row.data as Record<string, unknown>;
  if (typeof data.heading === "string") return data.heading;
  if (Array.isArray(data.headingLines)) return (data.headingLines as string[]).join(" ");
  if (Array.isArray((data as { items?: unknown[] }).items)) {
    return `${(data as { items: unknown[] }).items.length} card(s)`;
  }
  return "";
}
