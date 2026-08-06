"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { LifeData, LifeImage } from "@/lib/content/schemas";
import { ImageUploader } from "@/components/ImageUploader";

const inputCls =
  "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-indigo-400 focus:bg-white";

/**
 * Form for the "life" kind (Phase 5): heading + copy + the photo mosaic. The
 * first image renders large on the left; images 2–3 fill the right column and
 * any beyond that render in a row below.
 */
export function LifeForm({
  data,
  onChange,
}: {
  data: LifeData;
  onChange: (data: LifeData) => void;
}) {
  const [form, setForm] = useState<LifeData>(data);

  function update<K extends keyof LifeData>(key: K, value: LifeData[K]) {
    const next = { ...form, [key]: value };
    setForm(next);
    onChange(next);
  }

  function updateImage(index: number, patch: Partial<LifeImage>) {
    const images = form.images.map((img, i) => (i === index ? { ...img, ...patch } : img));
    update("images", images);
  }

  function addImage() {
    if (form.images.length >= 6) return;
    update("images", [...form.images, { src: "" }]);
  }

  function removeImage(index: number) {
    if (form.images.length <= 1) return; // schema requires at least one
    update(
      "images",
      form.images.filter((_, i) => i !== index)
    );
  }

  function moveImage(index: number, direction: "up" | "down") {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= form.images.length) return;
    const images = [...form.images];
    [images[index], images[target]] = [images[target], images[index]];
    update("images", images);
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-bold text-zinc-800">
          Heading <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.heading}
          onChange={(e) => update("heading", e.target.value)}
          placeholder="e.g. Life at Going Genius"
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

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-bold text-zinc-800">
            Images <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-zinc-400">{form.images.length} / 6</span>
        </div>
        <p className="mb-3 text-xs text-zinc-400">
          The first image shows large on the left; images 2–3 fill the right
          column; any further ones render in a row below.
        </p>

        <div className="space-y-3">
          {form.images.map((image, index) => (
            <div key={index} className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => moveImage(index, "up")}
                    disabled={index === 0}
                    aria-label="Move image up"
                    className="rounded p-0.5 text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, "down")}
                    disabled={index === form.images.length - 1}
                    aria-label="Move image down"
                    className="rounded p-0.5 text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="flex-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Image {index + 1}
                  {index === 0 ? " (large)" : ""}
                </p>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  disabled={form.images.length <= 1}
                  aria-label={`Remove image ${index + 1}`}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <ImageUploader
                  label="Image"
                  value={image.src || null}
                  onChange={(url) => updateImage(index, { src: url ?? "" })}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-zinc-700">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={image.alt ?? ""}
                      onChange={(e) => updateImage(index, { alt: e.target.value })}
                      placeholder="Describes the image for screen readers"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-zinc-700">
                      Label (optional)
                    </label>
                    <input
                      type="text"
                      value={image.label ?? ""}
                      onChange={(e) => updateImage(index, { label: e.target.value })}
                      placeholder="Shown over the image corner"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {form.images.length < 6 && (
          <button
            type="button"
            onClick={addImage}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add image
          </button>
        )}
      </div>
    </div>
  );
}