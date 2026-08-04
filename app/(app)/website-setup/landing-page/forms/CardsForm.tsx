"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { CardsData, CardItem } from "@/lib/content/schemas";
import { ImageUploader } from "@/components/ImageUploader";

const inputCls =
  "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-indigo-400 focus:bg-white";

function makeId() {
  return `card-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Repeatable card manager (Task 15) for `cardsSchema` sections — today only
 * the homepage "Products and Solutions" grid, but generic enough for any
 * future admin-managed card grid. Add/edit/reorder/delete, matching the
 * up/down-chevron reorder pattern already used by the Custom Fields settings
 * page rather than introducing a drag-and-drop dependency for one screen.
 */
export function CardsForm({
  data,
  onChange,
}: {
  data: CardsData;
  onChange: (data: CardsData) => void;
}) {
  const [form, setForm] = useState<CardsData>(data);

  function update<K extends keyof CardsData>(key: K, value: CardsData[K]) {
    const next = { ...form, [key]: value };
    setForm(next);
    onChange(next);
  }

  function updateItem(index: number, patch: Partial<CardItem>) {
    const items = form.items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    update("items", items);
  }

  function addItem() {
    if (form.items.length >= 24) return;
    update("items", [...form.items, { id: makeId(), title: "" }]);
  }

  function removeItem(index: number) {
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
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-zinc-800">Heading</label>
        <input
          type="text"
          value={form.heading ?? ""}
          onChange={(e) => update("heading", e.target.value)}
          className={inputCls}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-bold text-zinc-800">CTA Label</label>
          <input
            type="text"
            value={form.ctaLabel ?? ""}
            onChange={(e) => update("ctaLabel", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-zinc-800">CTA Link</label>
          <input
            type="text"
            value={form.ctaHref ?? ""}
            onChange={(e) => update("ctaHref", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-bold text-zinc-800">
            Cards <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-zinc-400">{form.items.length} / 24</span>
        </div>

        {form.items.length === 0 && (
          <p className="mb-3 rounded-lg border border-dashed border-zinc-300 px-4 py-6 text-center text-xs text-zinc-400">
            No cards yet. This section will hide itself on the public site until you add one.
          </p>
        )}

        <div className="space-y-3">
          {form.items.map((item, index) => (
            <CardItemEditor
              key={item.id}
              item={item}
              index={index}
              total={form.items.length}
              onChange={(patch) => updateItem(index, patch)}
              onRemove={() => removeItem(index)}
              onMove={(dir) => moveItem(index, dir)}
            />
          ))}
        </div>

        {form.items.length < 24 && (
          <button
            type="button"
            onClick={addItem}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add card
          </button>
        )}
      </div>
    </div>
  );
}

function CardItemEditor({
  item,
  index,
  total,
  onChange,
  onRemove,
  onMove,
}: {
  item: CardItem;
  index: number;
  total: number;
  onChange: (patch: Partial<CardItem>) => void;
  onRemove: () => void;
  onMove: (direction: "up" | "down") => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => onMove("up")}
            disabled={index === 0}
            aria-label="Move card up"
            className="rounded p-0.5 text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMove("down")}
            disabled={index === total - 1}
            aria-label="Move card down"
            className="rounded p-0.5 text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="flex-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Card {index + 1}
        </p>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove card ${index + 1}`}
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
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="e.g. Growth Analytics"
            className={inputCls}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-zinc-700">Description</label>
          <textarea
            rows={2}
            value={item.description ?? ""}
            onChange={(e) => onChange({ description: e.target.value })}
            className={`${inputCls} resize-none`}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold text-zinc-700">Link (optional)</label>
            <input
              type="text"
              value={item.href ?? ""}
              onChange={(e) => onChange({ href: e.target.value })}
              placeholder="/our-services"
              className={inputCls}
            />
          </div>
          <ImageUploader
            label="Icon / Image (optional)"
            value={item.imageUrl ?? null}
            onChange={(url) => onChange({ imageUrl: url ?? undefined })}
          />
        </div>
      </div>
    </div>
  );
}
