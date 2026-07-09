"use client";

import { UploadCloud, X, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    serviceName: "",
    shortDetails: "",
    description: "",
    image: "",
  });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await createService({
      serviceName: form.serviceName,
      description: form.description || form.shortDetails || undefined,
      image: form.image || undefined,
    });

    setIsLoading(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong");
      return;
    }

    // Reset form
    setForm({ serviceName: "", shortDetails: "", description: "", image: "" });
    setFileName(null);
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

          {/* Thumbnail */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-zinc-800">
              Thumbnail <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 rounded-xl bg-zinc-100 px-6 py-10 text-center transition-colors hover:bg-zinc-200 overflow-hidden relative w-full h-40"
            >
              {form.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <UploadCloud className="h-7 w-7 text-zinc-600" />
                  <span className="text-lg font-bold leading-tight text-zinc-800">
                    Click to upload
                    <br />
                    or drag and drop
                  </span>
                  <span className="text-xs text-zinc-400">
                    WEBP, JPEG, JPG (Max 2MB)
                  </span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".webp,.jpeg,.jpg,image/webp,image/jpeg"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          {/* Actions */}
          <div className="mt-2 flex items-center justify-end gap-3">
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
