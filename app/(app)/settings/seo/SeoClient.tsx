"use client";

import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/Button";
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

  function handleSave() {
    startTransition(async () => {
      const result = await saveSeoSettings({ metaTitle, metaDescription, metaKeywords, metaImage });
      setMessage(result.success ? "Settings saved." : (result.error ?? "Failed to save."));
      setTimeout(() => setMessage(null), 3000);
    });
  }

  return (
    <Card className="p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold" style={{ color: "#f0a500" }}>
            <Search className="h-5 w-5" />
            Global SEO Settings
          </h1>
          <p className="mt-1 text-sm font-semibold text-zinc-800">
            Manage global SEO information for your website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {message && <p className="text-sm text-zinc-500">{message}</p>}
          <Button onClick={handleSave} disabled={isPending} className="w-full shrink-0 sm:w-auto">
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

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
  );
}
