"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { HeroData } from "@/lib/content/schemas";
import { ImageUploader } from "@/components/ImageUploader";

const inputCls =
  "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-indigo-400 focus:bg-white";

/**
 * Form for the "hero" kind (Task 14). `headingLines` is an ordered array of
 * up to 4 short lines (matching how the current home hero renders "Think
 * Bigger," / "Build Smarter," / "Scale Faster" as separate <br/>-separated
 * lines) rather than one free-text heading, so line breaks stay predictable
 * instead of depending on manual wrapping.
 */
export function HeroForm({
  data,
  onChange,
}: {
  data: HeroData;
  onChange: (data: HeroData) => void;
}) {
  // Migrate legacy highlight fields into coloredHighlights on load
  const [form, setForm] = useState<HeroData>(() => {
    if (data.coloredHighlights && data.coloredHighlights.length > 0) return data;
    const migrated: Array<{ word: string; color: string }> = [];
    if (data.highlightedWords && data.highlightedWords.length > 0) {
      for (const w of data.highlightedWords) {
        if (w) migrated.push({ word: w, color: "#4f46e5" });
      }
    } else if (data.highlightedWord) {
      migrated.push({ word: data.highlightedWord, color: "#4f46e5" });
    }
    if (migrated.length === 0) return data;
    return { ...data, coloredHighlights: migrated };
  });

  function update<K extends keyof HeroData>(key: K, value: HeroData[K]) {
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
        <ImageUploader
          label="Hero Logo (centered layout only)"
          value={form.logoUrl ?? null}
          onChange={(url) => update("logoUrl", url ?? undefined)}
        />
        <p className="mt-1 text-xs text-zinc-400">
          A small circular logo rendered above the heading when the layout is &quot;Centered&quot; (e.g. the company hero).
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-zinc-800">
          Heading Lines <span className="text-red-500">*</span>
        </label>
        <p className="mb-2 text-xs text-zinc-400">
          Each line renders on its own row, up to 4 lines — e.g. &quot;Think Bigger,&quot;
          then &quot;Build Smarter,&quot; then &quot;Scale Faster&quot;.
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
        <label className="mb-1 block text-sm font-bold text-zinc-800">
          Highlights
        </label>
        <p className="mb-2 text-xs text-zinc-400">
          Pick any word or phrase from the heading lines and assign a color. The text must appear exactly in one of the lines above.
        </p>
        <div className="space-y-2">
          {(form.coloredHighlights ?? []).map((entry, i) => (
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
              update("coloredHighlights", [...(form.coloredHighlights ?? []), { word: "", color: "#4f46e5" }]);
            }}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add highlight
          </button>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-zinc-800">Dark card style</label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600">
          <input
            type="checkbox"
            checked={form.darkCardStyle}
            onChange={(e) => update("darkCardStyle", e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-indigo-600"
          />
          Render the two columns inside a dark rounded card (used by the Projects hero)
        </label>
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
          <label className="mb-1 block text-sm font-bold text-zinc-800">Primary CTA Label</label>
          <input
            type="text"
            value={form.primaryCtaLabel ?? ""}
            onChange={(e) => update("primaryCtaLabel", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-zinc-800">Primary CTA Link</label>
          <input
            type="text"
            value={form.primaryCtaHref ?? ""}
            onChange={(e) => update("primaryCtaHref", e.target.value)}
            placeholder="#contact"
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-zinc-800">Secondary CTA Label</label>
          <input
            type="text"
            value={form.secondaryCtaLabel ?? ""}
            onChange={(e) => update("secondaryCtaLabel", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-zinc-800">Secondary CTA Link</label>
          <input
            type="text"
            value={form.secondaryCtaHref ?? ""}
            onChange={(e) => update("secondaryCtaHref", e.target.value)}
            placeholder="#services"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <ImageUploader
          label="Hero Image"
          value={form.imageUrl ?? null}
          onChange={(url) => update("imageUrl", url ?? undefined)}
        />
        <p className="mt-1 text-xs text-zinc-400">
          Leave empty to keep the current default illustration.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-zinc-800">Image Alt Text</label>
        <input
          type="text"
          value={form.imageAlt ?? ""}
          onChange={(e) => update("imageAlt", e.target.value)}
          placeholder="Describes the hero image for screen readers"
          className={inputCls}
        />
      </div>
    </div>
  );
}
