"use client";

import { useState } from "react";
import { FileText, Search, Loader2 } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { PageHeader } from "@/components/PageHeader";
import { ImageUploader } from "@/components/ImageUploader";
import { createPage } from "@/app/actions/pages";
import { useRouter } from "next/navigation";

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-semibold text-zinc-800">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </p>
      {hint && <p className="text-xs text-zinc-400">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:border-indigo-400 transition-colors";

export default function AddNewPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [status, setStatus] = useState<"Published" | "Draft">("Draft");

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [keywords, setKeywords] = useState("");
  const [metaImage, setMetaImage] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleTitleChange(val: string) {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
    );
  }

  function handleReset() {
    setTitle("");
    setSlug("");
    setContent("");
    setThumbnail(null);
    setStatus("Draft");
    setMetaTitle("");
    setMetaDesc("");
    setKeywords("");
    setMetaImage(null);
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit() {
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    const result = await createPage({
      title,
      slug,
      content: content || undefined,
      thumbnail: thumbnail || undefined,
      metaTitle: metaTitle || undefined,
      metaDesc: metaDesc || undefined,
      keywords: keywords || undefined,
      metaImage: metaImage || undefined,
      status,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || "Something went wrong");
      return;
    }

    setSuccess(true);
    handleReset();
    // Optionally navigate to pages list
    router.push("/pages");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Page"
        description="Create a new page for your website. It will appear in the Pages list."
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Page created successfully!
        </div>
      )}

      {/* Page Content Card */}
      <Card>
        <div className="mb-5 flex items-center gap-2 text-base font-bold text-zinc-900">
          <FileText className="h-4 w-4 text-zinc-500" strokeWidth={2} />
          Page Content
        </div>

        <div className="space-y-5">
          <Field label="Title" required>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. About Us"
              className={inputCls}
            />
          </Field>

          <Field label="Slug" hint="URL-friendly version (auto-generated from title)">
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. about-us"
              className={inputCls}
            />
          </Field>

          <ImageUploader
            label="Page Thumbnail"
            value={thumbnail}
            onChange={(url) => setThumbnail(url)}
          />

          <Field label="Content" hint="Write the content of the page">
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing..."
              className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-600 outline-none placeholder:text-zinc-400 focus:border-indigo-400 transition-colors"
            />
          </Field>

          <Field label="Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "Published" | "Draft")}
              className={inputCls}
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </Field>
        </div>
      </Card>

      {/* SEO Fields Card */}
      <Card>
        <div className="mb-5 flex items-center gap-2 text-base font-bold text-zinc-900">
          <Search className="h-4 w-4 text-zinc-500" strokeWidth={2} />
          SEO Fields
        </div>

        <div className="space-y-5">
          <Field label="Meta Title" hint="Recommended: 50-60 Characters">
            <div className="relative">
              <input
                type="text"
                value={metaTitle}
                maxLength={60}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Enter meta title"
                className={`${inputCls} pr-14`}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
                {metaTitle.length}/60
              </span>
            </div>
          </Field>

          <Field label="Meta Description" hint="Recommended: 150-160 Characters">
            <div className="relative">
              <input
                type="text"
                value={metaDesc}
                maxLength={160}
                onChange={(e) => setMetaDesc(e.target.value)}
                placeholder="Enter meta description"
                className={`${inputCls} pr-16`}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
                {metaDesc.length}/160
              </span>
            </div>
          </Field>

          <Field label="Keywords" hint="Enter keywords separated by comma">
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. design, development, agency"
              className={inputCls}
            />
          </Field>

          <ImageUploader
            label="Meta Image"
            value={metaImage}
            onChange={(url) => setMetaImage(url)}
          />
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="secondary" onClick={handleReset}>
          Reset
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || !title || !slug}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Creating..." : "Create Page"}
        </Button>
      </div>
    </div>
  );
}
