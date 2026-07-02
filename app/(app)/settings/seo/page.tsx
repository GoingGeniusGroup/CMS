"use client";

import { useRef, useState } from "react";
import { Search, ImageIcon } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export default function SeoSettingsPage() {
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  return (
    <Card className="p-6 sm:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-xl font-bold" style={{ color: "#f0a500" }}>
          <Search className="h-5 w-5" />
          Global SEO Settings
        </h1>
        <p className="mt-1 text-sm font-semibold text-zinc-800">
          Manage global SEO information for your website.
        </p>
      </div>

      <div className="space-y-6">
        {/* Meta Title */}
        <div>
          <label className="mb-2 block text-sm font-bold text-zinc-800">
            Meta Title
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-3.5 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        {/* Meta Description */}
        <div>
          <label className="mb-2 block text-sm font-bold text-zinc-800">
            Meta Description
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-3.5 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        {/* Meta Keywords */}
        <div>
          <label className="mb-2 block text-sm font-bold text-zinc-800">
            Meta Keywords
          </label>
          <textarea
            rows={1}
            className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-3.5 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        {/* Meta Images */}
        <div>
          <label className="mb-2 block text-sm font-bold text-zinc-800">
            Meta Images
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-zinc-300 bg-white py-12 transition-colors hover:bg-zinc-50 sm:w-96"
          >
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt="Meta preview"
                className="max-h-40 w-full rounded-md object-contain px-4"
              />
            ) : (
              <>
                <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-md border border-zinc-400 text-zinc-700">
                  <ImageIcon className="h-6 w-6" />
                </span>
                <p className="text-sm text-zinc-500">Click to Upload Image</p>
              </>
            )}
          </div>

          <p className="mt-2 text-xs text-zinc-400">
            Recommended size : 1200*630px(Max 2MB
          </p>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </div>
    </Card>
  );
}
