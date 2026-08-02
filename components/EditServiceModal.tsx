"use client";

import { X, Loader2, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { TiptapEditor } from "@/components/TiptapEditor";
import type { JSONContent } from "@tiptap/react";
import { updateService } from "@/app/actions/services";

export interface ServiceRow {
  id: string;
  serviceName: string;
  description: string | null;
  isActive: boolean;
  isFeatured: boolean;
  thumbnailUrl: string | null;
}

interface EditServiceModalProps {
  open: boolean;
  service: ServiceRow | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditServiceModal({
  open,
  service,
  onClose,
  onSuccess,
}: EditServiceModalProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    serviceName: service?.serviceName ?? "",
    isActive: service?.isActive ?? true,
  });

  const [descriptionContent, setDescriptionContent] = useState<JSONContent | null>(() => {
    if (!service?.description) return null;
    try { return JSON.parse(service.description); } catch { return null; }
  });

  // Sync when service prop changes (safety net for key-based remount)
  useEffect(() => {
    if (service) {
      setForm({
        serviceName: service.serviceName,
        isActive: service.isActive,
      });
      setThumbnailUrl(service.thumbnailUrl ?? null);
      setIsFeatured(service.isFeatured ?? false);
      setFileName(null);
      setError(null);
      try {
        setDescriptionContent(service.description ? JSON.parse(service.description) : null);
      } catch {
        setDescriptionContent(null);
      }
    }
  }, [service]);

  if (!open || !service) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  function handleDescriptionChange(json: JSONContent) {
    setDescriptionContent(json);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!descriptionContent) {
      setError("Description is required");
      return;
    }

    setIsLoading(true);

    const result = await updateService(service.id, {
      serviceName: form.serviceName,
      description: descriptionContent ? JSON.stringify(descriptionContent) : undefined,
      isActive: form.isActive,
      isFeatured,
      thumbnailUrl: thumbnailUrl || undefined,
    });

    setIsLoading(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong");
      return;
    }

    onSuccess?.();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-zinc-400 hover:text-zinc-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="shrink-0 px-6 pt-6 sm:px-8 sm:pt-8">
          <h2 className="text-xl font-bold text-zinc-900">Edit Service</h2>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
            {error && (
              <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-5">
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

              {/* Description — Tiptap Editor */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-800">
                  Description <span className="text-red-500">*</span>
                </label>
                <TiptapEditor
                  content={descriptionContent}
                  onChange={handleDescriptionChange}
                  placeholder="Write service description..."
                />
              </div>

              {/* Status */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-800">Status</label>
                <div className="flex items-center gap-6">
                  {([true, false] as const).map((val) => (
                    <label key={String(val)} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="isActive"
                        checked={form.isActive === val}
                        onChange={() => setForm((prev) => ({ ...prev, isActive: val }))}
                        className="h-4 w-4 text-indigo-600"
                      />
                      <span className="text-sm text-zinc-700">
                        {val ? "Active" : "Inactive"}
                      </span>
                    </label>
                  ))}
                </div>
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
              <div className="flex items-center justify-between rounded-xl border border-black/15 px-4 py-3">
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
            </div>
          </div>

          {/* Actions - always visible */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4 sm:px-8">
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
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
