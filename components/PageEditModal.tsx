"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/Button";
import { ImageUploader } from "@/components/ImageUploader";
import { updatePage, type PageInput } from "@/app/actions/pages";

type Page = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  thumbnail: string | null;
  metaTitle?: string | null;
  metaDesc?: string | null;
  keywords?: string | null;
  metaImage?: string | null;
  status: string;
};

export function PageEditModal({
  open,
  onClose,
  onSuccess,
  page,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  page: Page | null;
}) {
  const [title, setTitle] = useState(page?.title ?? "");
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [content, setContent] = useState(page?.content ?? "");
  const [thumbnail, setThumbnail] = useState<string | null>(page?.thumbnail ?? null);
  const [status, setStatus] = useState<"Published" | "Draft">(
    (page?.status as "Published" | "Draft") ?? "Draft"
  );
  const [metaTitle, setMetaTitle] = useState(page?.metaTitle ?? "");
  const [metaDesc, setMetaDesc] = useState(page?.metaDesc ?? "");
  const [keywords, setKeywords] = useState(page?.keywords ?? "");
  const [metaImage, setMetaImage] = useState<string | null>(page?.metaImage ?? null);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open || !page) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const data: PageInput = {
      title,
      slug,
      content: content || undefined,
      thumbnail: thumbnail || undefined,
      metaTitle: metaTitle || undefined,
      metaDesc: metaDesc || undefined,
      keywords: keywords || undefined,
      metaImage: metaImage || undefined,
      status,
    };

    const result = await updatePage(page!.id, data);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || "Something went wrong");
      return;
    }

    onSuccess();
    onClose();
  }

  const inputCls = "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8"
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

        <h2 className="text-xl font-bold text-gray-900">Edit Page</h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Page title" className={inputCls} />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Slug <span className="text-red-500">*</span>
            </label>
            <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)}
              placeholder="page-slug" className={inputCls} />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea rows={4} value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="Page content..."
              className="mt-1 w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40" />
          </div>

          {/* Thumbnail */}
          <ImageUploader label="Thumbnail" value={thumbnail} onChange={(url) => setThumbnail(url)} />

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as "Published" | "Draft")}
              className={inputCls}>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>

          {/* SEO Section */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-bold text-gray-700 mb-3">SEO Fields</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600">Meta Title</label>
                <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Meta title" maxLength={60} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">Meta Description</label>
                <input type="text" value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)}
                  placeholder="Meta description" maxLength={160} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">Keywords</label>
                <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)}
                  placeholder="keyword1, keyword2" className={inputCls} />
              </div>
              <ImageUploader label="Meta Image" value={metaImage} onChange={(url) => setMetaImage(url)} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
