"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddCategoryModal({ open, onClose }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [order, setOrder] = useState("");
  const [link, setLink] = useState("");
  const [banner, setBanner] = useState<string | null>(null);
  const [icon, setIcon] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-zinc-900">Add New Category</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Create a new category to organize your website content.
          </p>
        </div>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="mb-0.5 block text-sm font-bold text-zinc-800">
              Name <span className="text-red-500">*</span>
            </label>
            <p className="mb-1.5 text-xs text-zinc-400">Enter the name of the category.</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Web Development"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-600 outline-none placeholder:text-zinc-400 focus:border-amber-400"
            />
          </div>

          {/* Parent Category */}
          <div>
            <label className="mb-0.5 block text-sm font-bold text-zinc-800">
              Parent Category
            </label>
            <p className="mb-1.5 text-xs text-zinc-400">Select parent category (optional).</p>
            <select
              value={parent}
              onChange={(e) => setParent(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-500 outline-none focus:border-amber-400"
            >
              <option value="">None (Top Level)</option>
              <option>Services</option>
              <option>Marketing</option>
              <option>Technology</option>
            </select>
          </div>

          {/* Order Number */}
          <div>
            <label className="mb-0.5 block text-sm font-bold text-zinc-800">
              Order Number <span className="text-red-500">*</span>
            </label>
            <p className="mb-1.5 text-xs text-zinc-400">Set the order for displaying category.</p>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              placeholder="e.g. 1"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-600 outline-none placeholder:text-zinc-400 focus:border-amber-400"
            />
            <p className="mt-1 text-xs text-amber-500">Lower numbers appear first.</p>
          </div>

          {/* Banner — Uploadcare */}
          <ImageUploader
            label="Banner"
            value={banner}
            onChange={setBanner}
          />
          <p className="-mt-3 text-xs text-zinc-400">Recommended size: 1920 × 600px</p>

          {/* Icon — Uploadcare */}
          <ImageUploader
            label="Icon"
            value={icon}
            onChange={setIcon}
          />
          <p className="-mt-3 text-xs text-zinc-400">Only SVG, PNG, JPG, WEBP · Recommended: 64×64px</p>

          {/* Link */}
          <div>
            <label className="mb-0.5 block text-sm font-bold text-zinc-800">Link</label>
            <p className="mb-1.5 text-xs text-zinc-400">Enter link for this category.</p>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Link"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-600 outline-none placeholder:text-zinc-400 focus:border-amber-400"
            />
            <p className="mt-1 text-xs text-zinc-400">This will be used as the category page URL.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
