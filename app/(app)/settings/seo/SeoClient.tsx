"use client";

import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Card } from "@/components/Card";
import { ImageUploader } from "@/components/ImageUploader";
import { saveSeoSettings, type SeoData } from "@/app/actions/seo";

export default function SeoClient({ initialData }: { initialData: SeoData }) {
  const [metaTitle, setMetaTitle] = useState(initialData.metaTitle);
  const [metaDescription, setMetaDescription] = useState(initialData.metaDescription);
  const [metaKeywords, setMetaKeywords] = useState(initialData.metaKeywords);
  const [metaImage, setMetaImage] = useState<string>(initialData.metaImage);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const hasChanges =
    metaTitle !== initialData.metaTitle ||
    metaDescription !== initialData.metaDescription ||
    metaKeywords !== initialData.metaKeywords ||
    metaImage !== initialData.metaImage;

  function handleCancel() {
    setMetaTitle(initialData.metaTitle);
    setMetaDescription(initialData.metaDescription);
    setMetaKeywords(initialData.metaKeywords);
    setMetaImage(initialData.metaImage);
    setMessage(null);
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveSeoSettings({ metaTitle, metaDescription, metaKeywords, metaImage });
      setMessage(result.success ? "Settings saved." : (result.error ?? "Failed to save."));
      setTimeout(() => setMessage(null), 3000);
    });
  }

  return (
    <>
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-10 mb-6 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <Search className="h-4 w-4" />
            </span>
            <div>
              <h1 className="text-base font-bold text-amber-500 sm:text-lg">Global SEO Settings</h1>
              <p className="text-xs text-zinc-500">Manage global SEO information for your website.</p>
            </div>
          </div>
          {hasChanges && (
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleCancel} disabled={isPending}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={isPending}
              className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
          )}
        </div>
      </div>

      {message && (
        <div className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
          message.includes("Failed") || message.includes("error")
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-green-200 bg-green-50 text-green-700"
        }`}>
          {message}
        </div>
      )}

    <Card className="p-6 sm:p-8">
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-bold text-zinc-800">Meta Title</label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-3.5 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-zinc-800">Meta Description</label>
          <input
            type="text"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-3.5 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-zinc-800">Meta Keywords</label>
          <textarea
            rows={1}
            value={metaKeywords}
            onChange={(e) => setMetaKeywords(e.target.value)}
            className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-3.5 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-zinc-800">Meta Image</label>
          <ImageUploader value={metaImage} onChange={(url) => setMetaImage(url ?? "")} />
          <p className="mt-2 text-xs text-zinc-400">
            Recommended size: 1200×630px (Max 2MB)
          </p>
        </div>
      </div>
    </Card>
    </>
  );
}
