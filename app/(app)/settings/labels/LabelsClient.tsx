"use client";

import { useState, useTransition } from "react";
import { Type } from "lucide-react";
import { Card } from "@/components/Card";
import { useConfig } from "@/components/ConfigProvider";
import { saveEntityLabels } from "@/app/actions/labels";

type LabelRow = { entityKey: string; singular: string; plural: string };

export default function LabelsClient({ initialLabels }: { initialLabels: LabelRow[] }) {
  const [rows, setRows] = useState<LabelRow[]>(initialLabels);
  const [baseline, setBaseline] = useState<LabelRow[]>(initialLabels);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { refreshConfig } = useConfig();

  const hasChanges =
    JSON.stringify(rows) !== JSON.stringify(baseline);

  function update(entityKey: string, field: "singular" | "plural", value: string) {
    setRows((prev) =>
      prev.map((r) => (r.entityKey === entityKey ? { ...r, [field]: value } : r))
    );
  }

  function handleCancel() {
    setRows(baseline);
    setMessage(null);
  }

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      const res = await saveEntityLabels(rows);
      if (res.success) {
        setBaseline(rows);
        await refreshConfig();
        setMessage({ type: "success", text: "Entity labels saved successfully." });
      } else {
        setMessage({ type: "error", text: res.error ?? "Failed to save." });
      }
    });
  }

  return (
    <>
      <div className="sticky top-0 z-10 mb-6 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <Type className="h-4 w-4" />
            </span>
            <div>
              <h1 className="text-base font-bold text-amber-500 sm:text-lg">Entity Labels</h1>
              <p className="text-xs text-zinc-500">
                Rename entities used across page titles, buttons and columns.
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

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-4 py-3 font-semibold">Entity</th>
                <th className="px-4 py-3 font-semibold">Singular Label</th>
                <th className="px-4 py-3 font-semibold">Plural Label</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.entityKey} className="border-b border-zinc-100 last:border-0">
                  <td className="px-4 py-3 font-medium capitalize text-zinc-700">
                    {row.entityKey}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={row.singular}
                      onChange={(e) => update(row.entityKey, "singular", e.target.value)}
                      className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={row.plural}
                      onChange={(e) => update(row.entityKey, "plural", e.target.value)}
                      className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
