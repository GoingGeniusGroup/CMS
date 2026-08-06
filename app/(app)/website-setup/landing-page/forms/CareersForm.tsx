"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { CareersData, CareersItem } from "@/lib/content/schemas";
import { IconSelect } from "@/components/content/IconSelect";

const inputCls =
  "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-indigo-400 focus:bg-white";

/**
 * Form for the "careers" kind (Phase 4): eyebrow/heading/copy, an optional
 * button (defaults to a working link to /career), and the repeatable culture
 * points (icon, title, description) shown above it.
 */
export function CareersForm({
  data,
  onChange,
}: {
  data: CareersData;
  onChange: (data: CareersData) => void;
}) {
  const [form, setForm] = useState<CareersData>(data);

  function update<K extends keyof CareersData>(key: K, value: CareersData[K]) {
    const next = { ...form, [key]: value };
    setForm(next);
    onChange(next);
  }

  function updateItem(index: number, patch: Partial<CareersItem>) {
    const items = form.cultureItems.map((item, i) => (i === index ? { ...item, ...patch } : item));
    update("cultureItems", items);
  }

  function addItem() {
    if (form.cultureItems.length >= 8) return;
    update("cultureItems", [...form.cultureItems, { title: "" }]);
  }

  function removeItem(index: number) {
    update(
      "cultureItems",
      form.cultureItems.filter((_, i) => i !== index)
    );
  }

  function moveItem(index: number, direction: "up" | "down") {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= form.cultureItems.length) return;
    const items = [...form.cultureItems];
    [items[index], items[target]] = [items[target], items[index]];
    update("cultureItems", items);
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-bold text-zinc-800">Eyebrow</label>
        <input
          type="text"
          value={form.eyebrow ?? ""}
          onChange={(e) => update("eyebrow", e.target.value)}
          placeholder="e.g. Careers"
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-zinc-800">
          Heading <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.heading}
          onChange={(e) => update("heading", e.target.value)}
          placeholder="e.g. Join Our Team"
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
            placeholder="e.g. View All Openings"
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-zinc-800">Button Link</label>
          <input
            type="text"
            value={form.buttonHref ?? ""}
            onChange={(e) => update("buttonHref", e.target.value)}
            placeholder="/career"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-bold text-zinc-800">Culture Points</label>
          <span className="text-xs text-zinc-400">{form.cultureItems.length} / 8</span>
        </div>

        <div className="space-y-3">
          {form.cultureItems.map((item, index) => (
            <div key={index} className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => moveItem(index, "up")}
                    disabled={index === 0}
                    aria-label="Move point up"
                    className="rounded p-0.5 text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, "down")}
                    disabled={index === form.cultureItems.length - 1}
                    aria-label="Move point down"
                    className="rounded p-0.5 text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="flex-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Point {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  aria-label={`Remove point ${index + 1}`}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"
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
                    placeholder="e.g. Great Culture"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">Description</label>
                  <input
                    type="text"
                    value={item.description ?? ""}
                    onChange={(e) => updateItem(index, { description: e.target.value })}
                    placeholder="One-line description"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">Icon</label>
                  <IconSelect
                    value={item.iconName ?? null}
                    onChange={(name) => updateItem(index, { iconName: name })}
                  />
                  <p className="mt-1 text-[11px] text-zinc-400">
                    Optional. Pick an icon from the dropdown or leave empty for none.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {form.cultureItems.length < 8 && (
          <button
            type="button"
            onClick={addItem}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add point
          </button>
        )}
      </div>
    </div>
  );
}