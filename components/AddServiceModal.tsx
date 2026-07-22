"use client";

import { X, Loader2, Star } from "lucide-react";
import { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { createService } from "@/app/actions/services";

export function AddServiceModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    serviceName: "",
    shortDetails: "",
    description: "",
  });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await createService({
      serviceName: form.serviceName,
      description: form.description || form.shortDetails || undefined,
      thumbnailUrl: thumbnailUrl || undefined,
      isFeatured,
    });

    setIsLoading(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong");
      return;
    }

    // Reset form
    setForm({ serviceName: "", shortDetails: "", description: "" });
    setFileName(null);
    setThumbnailUrl(null);
    setIsFeatured(false);
    onSuccess?.();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-zinc-900">Add Service</h2>

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-zinc-800">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="serviceName"
              value={form.serviceName}
              onChange={handleChange}
              required
              placeholder="Enter service title"
              className="h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Short Details */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-zinc-800">
              Short Details <span className="text-red-500">*</span>
            </label>
            <textarea
              name="shortDetails"
              value={form.shortDetails}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Enter short details"
              className="w-full resize-none rounded-xl border border-black/15 bg-white p-4 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-zinc-800">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Write description here......."
              className="w-full resize-none rounded-xl border border-black/15 bg-white p-4 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Thumbnail — ImageUploader */}
          <ImageUploader
            label="Thumbnail"
            value={thumbnailUrl}
            onChange={(url) => {
              setThumbnailUrl(url);
              setFileName(url ? "Uploaded Image" : null);
            }}
          />

          {/* Featured Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-black/15 px-4 py-3 max-md:mb-24">
            <div className="flex items-center gap-2">
              <Star className={`h-4 w-4 ${isFeatured ? "text-amber-500 fill-amber-500" : "text-zinc-400"}`} />
              <span className="text-sm font-bold text-zinc-800">Featured Service</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isFeatured}
              onClick={() => setIsFeatured(!isFeatured)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isFeatured ? "bg-indigo-600" : "bg-zinc-200"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${isFeatured ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="mt-2 flex items-center justify-end gap-3 max-md:sticky max-md:bottom-0 max-md:z-10 max-md:bg-white max-md:border-t max-md:border-gray-200 max-md:py-4 max-md:-mx-8 max-md:px-8">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-black/15 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-black/5 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Adding..." : "Add Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
