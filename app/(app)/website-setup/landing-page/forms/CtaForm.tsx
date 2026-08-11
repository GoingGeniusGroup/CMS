"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CtaData } from "@/lib/content/schemas";
import { ImageUploader } from "@/components/ImageUploader";

const inputCls =
  "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-indigo-400 focus:bg-white";

/**
 * Form for the "cta" kind: variant toggle (split image block / centered text)
 * plus heading lines, highlighted word, Subheading, two optional buttons and
 * the side image.
 */
export function CtaForm({
  data,
  onChange,
}: {
  data: CtaData;
  onChange: (data: CtaData) => void;
}) {
  const [form, setForm] = useState<CtaData>(data);

  function update<K extends keyof CtaData>(key: K, value: CtaData[K]) {
    const next = { ...form, [key]: value };
    setForm(next);
    onChange(next);
  }

  function updateLine(index: number, value: string) {
    const lines = [...form.headingLines];
    lines[index] = value;
    update("headingLines", lines);
  }

  function addLine() {
    if (form.headingLines.length >= 4) return;
    update("headingLines", [...form.headingLines, ""]);
  }

  function removeLine(index: number) {
    if (form.headingLines.length <= 1) return; // schema requires at least one
    update(
      "headingLines",
      form.headingLines.filter((_, i) => i !== index)
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-bold text-zinc-800">Layout</label>
        <div className="flex gap-2">
          {(
            [
              { value: "split", label: "Text + image" },
              { value: "centered", label: "Centered text" },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => update("variant", option.value)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                form.variant === option.value
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {form.variant === "split" && (
          <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-zinc-600">
            <input
              type="checkbox"
              checked={form.cardStyle}
              onChange={(e) => update("cardStyle", e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-indigo-600"
            />
            Tinted card style (used by the Projects page CTA)
          </label>
        )}
      </div>

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
        <label className="mb-1 block text-sm font-bold text-zinc-800">
          Heading Lines <span className="text-red-500">*</span>
        </label>
        <p className="mb-2 text-xs text-zinc-400">
          Each line renders on its own row, up to 4 lines — e.g. &quot;Ready to
          Start&quot; then &quot;Your Project?&quot;.
        </p>
        <div className="space-y-2">
          {form.headingLines.map((line, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={line}
                onChange={(e) => updateLine(i, e.target.value)}
                placeholder={`Line ${i + 1}`}
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => removeLine(i)}
                disabled={form.headingLines.length <= 1}
                aria-label={`Remove line ${i + 1}`}
                className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        {form.headingLines.length < 4 && (
          <button
            type="button"
            onClick={addLine}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add line
          </button>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-zinc-800">Highlights</label>
        <p className="mb-2 text-xs text-zinc-400">
          Pick any word or phrase from the heading lines and assign a color.
        </p>
        <div className="space-y-2">
          {(form.coloredHighlights ?? (form.highlightedWord ? [{ word: form.highlightedWord, color: "#f59e0b" }] : [])).map((entry, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={entry.word}
                onChange={(e) => {
                  const next = [...(form.coloredHighlights ?? [])];
                  next[i] = { ...next[i], word: e.target.value };
                  update("coloredHighlights", next);
                }}
                placeholder="Word or phrase to highlight"
                className={`${inputCls} flex-1`}
              />
              <input
                type="color"
                value={entry.color}
                onChange={(e) => {
                  const next = [...(form.coloredHighlights ?? [])];
                  next[i] = { ...next[i], color: e.target.value };
                  update("coloredHighlights", next);
                }}
                className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-zinc-200 p-0.5"
                title="Pick color"
              />
              <button
                type="button"
                onClick={() => {
                  update("coloredHighlights", (form.coloredHighlights ?? []).filter((_, idx) => idx !== i));
                }}
                aria-label={`Remove highlight ${i + 1}`}
                className="shrink-0 rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        {(form.coloredHighlights ?? []).length < 8 && (
          <button
            type="button"
            onClick={() => {
              update("coloredHighlights", [...(form.coloredHighlights ?? []), { word: "", color: "#f59e0b" }]);
            }}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add highlight
          </button>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-zinc-800">Subheading</label>
        <textarea
          rows={3}
          value={form.Subheading ?? ""}
          onChange={(e) => update("Subheading", e.target.value)}
          className={`${inputCls} resize-none`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-bold text-zinc-800">Primary Button Label</label>
          <input
            type="text"
            value={form.primaryCtaLabel ?? ""}
            onChange={(e) => update("primaryCtaLabel", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-zinc-800">Primary Button Link</label>
          <input
            type="text"
            value={form.primaryCtaHref ?? ""}
            onChange={(e) => update("primaryCtaHref", e.target.value)}
            placeholder="/contact"
            className={inputCls}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600">
            <input
              type="checkbox"
              checked={form.primaryCtaShowArrow}
              onChange={(e) => update("primaryCtaShowArrow", e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-indigo-600"
            />
            Show arrow on the primary button
          </label>
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-zinc-800">Secondary Button Label</label>
          <input
            type="text"
            value={form.secondaryCtaLabel ?? ""}
            onChange={(e) => update("secondaryCtaLabel", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-zinc-800">Secondary Button Link</label>
          <input
            type="text"
            value={form.secondaryCtaHref ?? ""}
            onChange={(e) => update("secondaryCtaHref", e.target.value)}
            placeholder="/contact"
            className={inputCls}
          />
        </div>
      </div>

      {form.variant === "split" && (
        <div>
          <ImageUploader
            label="Side Image"
            value={form.imageUrl ?? null}
            onChange={(url) => update("imageUrl", url ?? undefined)}
          />
          <p className="mt-1 text-xs text-zinc-400">
            Shown next to the text in the split layout. Leave empty to hide it.
          </p>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-bold text-zinc-800">Image Alt Text</label>
        <input
          type="text"
          value={form.imageAlt ?? ""}
          onChange={(e) => update("imageAlt", e.target.value)}
          placeholder="Describes the image for screen readers"
          className={inputCls}
        />
      </div>
    </div>
  );
}