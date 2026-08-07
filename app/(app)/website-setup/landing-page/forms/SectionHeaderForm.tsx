"use client";

import { useState } from "react";
import type { SectionHeaderData } from "@/lib/content/schemas";

const inputCls =
  "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-indigo-400 focus:bg-white";

/**
 * Form for the "sectionHeader" kind: eyebrow/heading/Subheading + optional
 * CTA label+href. Covers Services, Featured Projects, Blog, Partners, Tech,
 * Team, and FAQ section headers — every section that isn't a hero or a card
 * grid (Task 14).
 */
export function SectionHeaderForm({
  data,
  onChange,
}: {
  data: SectionHeaderData;
  onChange: (data: SectionHeaderData) => void;
}) {
  const [form, setForm] = useState(data);

  function update<K extends keyof SectionHeaderData>(key: K, value: SectionHeaderData[K]) {
    const next = { ...form, [key]: value };
    setForm(next);
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-bold text-zinc-800">Eyebrow</label>
        <input
          type="text"
          value={form.eyebrow ?? ""}
          onChange={(e) => update("eyebrow", e.target.value)}
          placeholder="e.g. Our Services"
          className={inputCls}
        />
        <p className="mt-1 text-xs text-zinc-400">Optional small label shown above the heading.</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-zinc-800">
          Heading <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.heading}
          onChange={(e) => update("heading", e.target.value)}
          placeholder="e.g. What We Do Best"
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-zinc-800">Subheading</label>
        <textarea
          rows={2}
          value={form.Subheading ?? ""}
          onChange={(e) => update("Subheading", e.target.value)}
          placeholder="Optional supporting sentence shown below the heading."
          className={`${inputCls} resize-none`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-bold text-zinc-800">CTA Label</label>
          <input
            type="text"
            value={form.ctaLabel ?? ""}
            onChange={(e) => update("ctaLabel", e.target.value)}
            placeholder="e.g. View All Services"
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-zinc-800">CTA Link</label>
          <input
            type="text"
            value={form.ctaHref ?? ""}
            onChange={(e) => update("ctaHref", e.target.value)}
            placeholder="/our-services, #contact, or https://..."
            className={inputCls}
          />
          <p className="mt-1 text-xs text-zinc-400">
            Leave both blank to hide the link entirely.
          </p>
        </div>
      </div>
    </div>
  );
}
