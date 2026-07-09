"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

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

  const bannerRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLInputElement>(null);

  const handleBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setBanner(URL.createObjectURL(file));
  };

  const handleIcon = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setIcon(URL.createObjectURL(file));
  };

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

          {/* Banner */}
          <div>
            <label className="mb-0.5 block text-sm font-bold text-zinc-800">Banner</label>
            <p className="mb-1.5 text-xs text-zinc-400">Upload a banner image for this category.</p>
            <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={handleBanner} />
            <div
              onClick={() => bannerRef.current?.click()}
              className="flex min-h-[140px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white transition-colors hover:bg-zinc-50"
            >
              {banner ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={banner} alt="Banner preview" className="max-h-32 rounded-md object-contain" />
              ) : (
                <>
                  <UploadCloud className="h-8 w-8 text-amber-500" />
                  <p className="text-sm text-zinc-600">Drag &amp; drop your banner image here</p>
                  <p className="text-xs text-zinc-400">or</p>
                  <span className="text-sm font-semibold text-amber-500 hover:underline">Browse File</span>
                  <p className="text-xs text-zinc-400">Recommended size: 1920 × 600px</p>
                </>
              )}
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="mb-0.5 block text-sm font-bold text-zinc-800">Icon</label>
            <p className="mb-1.5 text-xs text-zinc-400">Upload an icon to represent this category.</p>
            <input ref={iconRef} type="file" accept="image/*,.svg" className="hidden" onChange={handleIcon} />
            <div
              onClick={() => iconRef.current?.click()}
              className="flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white transition-colors hover:bg-zinc-50"
            >
              {icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={icon} alt="Icon preview" className="h-16 w-16 rounded-md object-contain" />
              ) : (
                <>
                  <UploadCloud className="h-7 w-7 text-amber-500" />
                  <p className="text-sm font-medium text-zinc-600">Upload Icon</p>
                  <p className="text-xs text-zinc-400">Only SVG, PNG, JPG, WEBP</p>
                  <p className="text-xs text-zinc-400">Recommended: 64×64px</p>
                </>
              )}
            </div>
          </div>

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
