"use client";

import { UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";

export function AddServiceModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire up to your data layer
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Add Services
        </h2>

        <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Enter Services title"
              className="h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-200 dark:border-white/15 dark:bg-white/5 dark:text-zinc-200"
            />
          </div>

          {/* Short Details */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
              Short Details <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Enter short details"
              className="w-full resize-none rounded-xl border border-black/15 bg-white p-4 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-200 dark:border-white/15 dark:bg-white/5 dark:text-zinc-200"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
              Description
            </label>
            <textarea
              rows={5}
              placeholder="Write description here......."
              className="w-full resize-none rounded-xl border border-black/15 bg-white p-4 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-200 dark:border-white/15 dark:bg-white/5 dark:text-zinc-200"
            />
          </div>

          {/* Thumbnail */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
              Thumbnail <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 rounded-xl bg-zinc-100 px-6 py-10 text-center transition-colors hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <UploadCloud className="h-7 w-7 text-zinc-600 dark:text-zinc-300" />
              <span className="text-lg font-bold leading-tight text-zinc-800 dark:text-zinc-100">
                Click to upload
                <br />
                or drag and drop
              </span>
              <span className="text-xs text-zinc-400">
                {fileName ?? "WEBP, JPEG, JPG (Max 2MB)"}
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".webp,.jpeg,.jpg,image/webp,image/jpeg"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
          </div>

          {/* Actions */}
          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-black/15 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-black/5 dark:border-white/15 dark:bg-white/5 dark:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Add Services
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
