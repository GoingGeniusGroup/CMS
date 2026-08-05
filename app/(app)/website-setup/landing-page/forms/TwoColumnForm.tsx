"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { TwoColumnData, TwoColumnItem } from "@/lib/content/schemas";

const inputCls =
  "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-indigo-400 focus:bg-white";

/**
 * Form for the "twoColumn" kind (Phase 3): optional header (eyebrow/heading/
 * copy) and button, plus the two icon columns themselves (icon, title,
 * description). Used by the about-us Mission & Vision section.
 */
export function TwoColumnForm({
  data,
  onChange,
}: {
  data: TwoColumnData;
  onChange: (data: TwoColumnData) => void;
}) {
  const [form, setForm] = useState<TwoColumnData>(data);

  function update<K extends keyof TwoColumnData>(key: K, value: TwoColumnData[K]) {
    const next = { ...form, [key]: value };
    setForm(next);
    onChange(next);
  }

  function updateItem(index: number, patch: Partial<TwoColumnItem>) {
    const items = form.items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    update("items", items);
  }

  function addItem() {
    if (form.items.length >= 4) return;
    update("items", [...form.items, { title: "" }]);
  }

  function removeItem(index: number) {
    if (form.items.length <= 1) return; // schema requires at least one
    update(
      "items",
      form.items.filter((_, i) => i !== index)
    );
  }

  function moveItem(index: number, direction: "up" | "down") {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= form.items.length) return;
    const items = [...form.items];
    [items[index], items[target]] = [items[target], items[index]];
    update("items", items);
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-bold text-zinc-800">Eyebrow</label>
        <input
          type="text"
          value={form.eyebrow ?? ""}
          onChange={(e) => update("eyebrow", e.target.value)}
          placeholder="Optional small label above the heading"
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-zinc-800">Heading</label>
        <input
          type="text"
          value={form.heading ?? ""}
          onChange={(e) => update("heading", e.target.value)}
          placeholder="Optional heading above the columns"
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-zinc-800">Copy</label>
        <textarea
          rows={3}
          value={form.copy ?? ""}
          onChange={(e) => update("copy", e.target.value)}
          className={`${inputCls} resize-none`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-bold text-zinc-800">Button Label</label>
          <input
            type="text"
            value={form.buttonLabel ?? ""}
            onChange={(e) => update("buttonLabel", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-zinc-800">Button Link</label>
          <input
            type="text"
            value={form.buttonHref ?? ""}
            onChange={(e) => update("buttonHref", e.target.value)}
            placeholder="/contact"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-bold text-zinc-800">
            Columns <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-zinc-400">{form.items.length} / 4</span>
        </div>

        <div className="space-y-3">
          {form.items.map((item, index) => (
            <div key={index} className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => moveItem(index, "up")}
                    disabled={index === 0}
                    aria-label="Move column up"
                    className="rounded p-0.5 text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, "down")}
                    disabled={index === form.items.length - 1}
                    aria-label="Move column down"
                    className="rounded p-0.5 text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="flex-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Column {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={form.items.length <= 1}
                  aria-label={`Remove column ${index + 1}`}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(index, { title: e.target.value })}
                    placeholder="e.g. Our Mission"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">Description</label>
                  <textarea
                    rows={3}
                    value={item.description ?? ""}
                    onChange={(e) => updateItem(index, { description: e.target.value })}
                    className={`${inputCls} resize-none`}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">Icon</label>
                  <input
                    type="text"
                    value={item.iconName ?? ""}
                    onChange={(e) => updateItem(index, { iconName: e.target.value })}
                    placeholder="globe, star, lightbulb, shield"
                    className={inputCls}
                  />
                  <p className="mt-1 text-[11px] text-zinc-400">
                    Optional. Leave empty for no icon.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {form.items.length < 4 && (
          <button
            type="button"
            onClick={addItem}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add column
          </button>
        )}
      </div>
    </div>
  );
}
