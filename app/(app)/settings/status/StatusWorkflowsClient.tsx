"use client";

import { useState, useTransition } from "react";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Trash2,
  GitBranch,
} from "lucide-react";
import { Card } from "@/components/Card";
import { useConfig } from "@/components/ConfigProvider";
import {
  saveStatusOption,
  deleteStatusOption,
  setStatusActive,
  setStatusDefault,
  reorderStatusOption,
  updateStatusColor,
  type StatusOptionInput,
} from "@/app/actions/status-options";

type StatusRow = {
  id: string;
  moduleKey: string;
  statusValue: string;
  label: string;
  color: string;
  sortOrder: number;
  isDefault: boolean;
  isActive: boolean;
};

type EditorState = { open: boolean; editing: StatusRow | null; moduleKey: string };

const MODULE_LABELS: Record<string, string> = {
  project: "Projects",
  blog: "Blog",
  invoice: "Invoices",
  customer: "Customers",
  team: "Team",
  service: "Services",
  category: "Categories",
  page: "Pages",
  job: "Vacancies",
  applicant: "Applicants",
  faq: "FAQs",
};

export default function StatusWorkflowsClient({
  initialStatusOptions,
  modules,
}: {
  initialStatusOptions: StatusRow[];
  modules: string[];
}) {
  const [rows, setRows] = useState<StatusRow[]>(initialStatusOptions);
  const [editor, setEditor] = useState<EditorState>({ open: false, editing: null, moduleKey: modules[0] ?? "project" });
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { refreshConfig } = useConfig();

  async function notify(res: { success: boolean; error?: string }, ok: string) {
    setMessage(
      res.success ? { type: "success", text: ok } : { type: "error", text: res.error ?? "Action failed." }
    );
    if (res.success) {
      await refreshConfig();
    }
  }

  function handleToggleActive(row: StatusRow) {
    startTransition(async () => {
      const res = await setStatusActive(row.id, !row.isActive);
      if (res.success) {
        setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, isActive: !r.isActive } : r)));
      }
      notify(res, "Status updated.");
    });
  }

  function handleSetDefault(row: StatusRow) {
    startTransition(async () => {
      const res = await setStatusDefault(row.id);
      if (res.success) {
        setRows((prev) =>
          prev.map((r) => (r.moduleKey === row.moduleKey ? { ...r, isDefault: r.id === row.id } : r))
        );
      }
      notify(res, "Default status updated.");
    });
  }

  function handleReorder(row: StatusRow, direction: "up" | "down") {
    startTransition(async () => {
      const res = await reorderStatusOption(row.id, direction);
      if (res.success) {
        setRows((prev) => {
          const moduleRows = prev.filter((r) => r.moduleKey === row.moduleKey);
          const others = prev.filter((r) => r.moduleKey !== row.moduleKey);
          const index = moduleRows.findIndex((r) => r.id === row.id);
          const to = direction === "up" ? index - 1 : index + 1;
          if (to < 0 || to >= moduleRows.length) return prev;
          const [moved] = moduleRows.splice(index, 1);
          moduleRows.splice(to, 0, moved);
          return [...others, ...moduleRows];
        });
      }
      notify(res, "Order updated.");
    });
  }

  function handleDelete(row: StatusRow) {
    if (!window.confirm(`Remove the status "${row.label}"?`)) return;
    startTransition(async () => {
      const res = await deleteStatusOption(row.id);
      if (res.success) {
        setRows((prev) => prev.filter((r) => r.id !== row.id));
      }
      notify(res, "Status removed.");
    });
  }

  function openCreate(moduleKey: string) {
    setEditor({ open: true, editing: null, moduleKey });
  }

  function openEdit(row: StatusRow) {
    setEditor({ open: true, editing: row, moduleKey: row.moduleKey });
  }

  const grouped = modules.map((moduleKey) => ({
    moduleKey,
    rows: rows.filter((r) => r.moduleKey === moduleKey).sort((a, b) => a.sortOrder - b.sortOrder),
  }));

  return (
    <>
      <div className="sticky top-0 z-10 mb-6 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
            <GitBranch className="h-4 w-4" />
          </span>
          <div>
            <h1 className="text-base font-bold text-amber-500 sm:text-lg">Status Workflows</h1>
            <p className="text-xs text-zinc-500">
              Configure status options and badge colors per module. At least one active status and a
              default must always remain.
            </p>
          </div>
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

      <div className="space-y-6">
        {grouped.map(({ moduleKey, rows: moduleRows }) => (
          <Card key={moduleKey}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-5 py-4">
              <h2 className="text-base font-bold text-zinc-800">
                {MODULE_LABELS[moduleKey] ?? moduleKey}
                <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
                  {moduleRows.length}
                </span>
              </h2>
              <button
                type="button"
                onClick={() => openCreate(moduleKey)}
                className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-600"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Status
              </button>
            </div>

            {moduleRows.length === 0 ? (
              <p className="px-5 py-6 text-sm text-zinc-500">No status options configured.</p>
            ) : (
              <ul className="divide-y divide-zinc-100">
                {moduleRows.map((row) => (
                  <li
                    key={row.id}
                    className={`flex flex-wrap items-center gap-3 px-5 py-3 ${!row.isActive ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleReorder(row, "up")}
                        disabled={isPending}
                        aria-label="Move up"
                        className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReorder(row, "down")}
                        disabled={isPending}
                        aria-label="Move down"
                        className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                    <span
                      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      style={{ backgroundColor: `${row.color}1a`, color: row.color }}
                    >
                      {row.isDefault ? "★" : "•"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-zinc-800">
                        {row.label}
                        {row.isDefault && (
                          <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                            Default
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-zinc-500">
                        {row.statusValue} · #{row.color}
                        {!row.isActive ? " · inactive" : ""}
                      </p>
                    </div>
                    <input
                      type="color"
                      value={row.color}
                      onChange={(e) => {
                        const color = e.target.value;
                        setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, color } : r)));
                        startTransition(() => {
                          updateStatusColor(row.id, color).then((res) => {
                            if (res.success) refreshConfig();
                            else notify(res, "Color updated.");
                          });
                        });
                      }}
                      className="h-8 w-12 shrink-0 cursor-pointer rounded border border-zinc-200 bg-white p-1"
                      aria-label="Status color"
                    />
                    <button
                      type="button"
                      onClick={() => handleSetDefault(row)}
                      disabled={isPending || row.isDefault}
                      className="shrink-0 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-600 hover:bg-zinc-50 disabled:cursor-default disabled:opacity-40"
                    >
                      Set default
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(row)}
                      disabled={isPending}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                        row.isActive ? "bg-emerald-500" : "bg-zinc-300"
                      }`}
                      aria-pressed={row.isActive}
                      title={row.isActive ? "Active" : "Inactive"}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                          row.isActive ? "left-[22px]" : "left-0.5"
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(row)}
                      className="shrink-0 rounded-lg border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                      aria-label="Edit status"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(row)}
                      disabled={isPending}
                      className="shrink-0 rounded-lg border border-zinc-200 p-2 text-rose-500 hover:bg-rose-50"
                      aria-label="Delete status"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>

      {editor.open && (
        <StatusEditorModal
          editor={editor}
          onClose={() => setEditor((e) => ({ ...e, open: false }))}
          onSaved={(saved) => {
            setEditor((e) => ({ ...e, open: false }));
            setRows((prev) => {
              if (editor.editing) {
                return prev.map((r) => (r.id === saved.id ? saved : r));
              }
              return [...prev, saved];
            });
            refreshConfig();
          }}
        />
      )}
    </>
  );
}

function StatusEditorModal({
  editor,
  onClose,
  onSaved,
}: {
  editor: EditorState;
  onClose: () => void;
  onSaved: (row: StatusRow) => void;
}) {
  const editing = editor.editing;
  const [statusValue, setStatusValue] = useState(editing?.statusValue ?? "");
  const [label, setLabel] = useState(editing?.label ?? "");
  const [color, setColor] = useState(editing?.color ?? "#16a34a");
  const [isActive, setIsActive] = useState(editing?.isActive ?? true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    const payload: StatusOptionInput = {
      id: editing?.id,
      moduleKey: editor.moduleKey,
      statusValue: statusValue.trim(),
      label: label.trim(),
      color,
      sortOrder: editing?.sortOrder ?? 0,
      isDefault: editing?.isDefault ?? false,
      isActive,
    };
    const res = await saveStatusOption(payload);
    setSubmitting(false);
    if (!res.success || !res.id) {
      setError(res.error ?? "Failed to save status");
      return;
    }
    onSaved({
      id: res.id,
      moduleKey: editor.moduleKey,
      statusValue: payload.statusValue,
      label: payload.label,
      color,
      sortOrder: editing?.sortOrder ?? 0,
      isDefault: editing?.isDefault ?? false,
      isActive,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-900">
          {editing ? "Edit Status" : "Add Status"}
        </h3>
        <p className="mt-1 text-sm capitalize text-gray-500">Module: {editor.moduleKey}</p>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Status Value</label>
              <input
                type="text"
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
                placeholder="e.g. Published"
                disabled={!!editing}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40 disabled:bg-zinc-50 disabled:text-zinc-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Display Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Live"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
              />
            </div>
          </div>
          <div className="flex items-center gap-8">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              Color
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-9 w-14 cursor-pointer rounded border border-gray-300 bg-white p-1"
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Active
            </label>
          </div>
        </div>

        {error && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !statusValue.trim() || !label.trim()}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Status"}
          </button>
        </div>
      </div>
    </div>
  );
}
