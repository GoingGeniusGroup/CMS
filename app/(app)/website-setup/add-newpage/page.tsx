"use client";

import { useRef, useState } from "react";
import { FileText, Search, CloudUpload } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { PageHeader } from "@/components/PageHeader";

/* ── tiny toolbar button ── */
function ToolbarBtn({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-7 w-7 items-center justify-center rounded text-xs font-medium text-zinc-500 hover:bg-zinc-200"
    >
      {children}
    </button>
  );
}

/* ── labelled field wrapper ── */
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
  /* ── Page Content state ── */
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  /* ── SEO state ── */
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [keywords, setKeywords] = useState("");
  const [metaImage, setMetaImage] = useState<File | null>(null);
  const [metaImagePreview, setMetaImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* auto-generate slug from link */
  const handleLinkChange = (val: string) => {
    setLink(val);
    setSlug(val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };

  const handleImageFile = (file: File) => {
    setMetaImage(file);
    setMetaImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleReset = () => {
    setTitle("");
    setLink("");
    setSlug("");
    setContent("");
    setMetaTitle("");
    setMetaDesc("");
    setKeywords("");
    setMetaImage(null);
    setMetaImagePreview(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Page"
        description="Create a new page for your website."
      />

      {/* ── Page Content Card ── */}
      <Card>
        {/* Card heading */}
        <div className="mb-5 flex items-center gap-2 text-base font-bold text-zinc-900">
          <FileText className="h-4 w-4 text-zinc-500" strokeWidth={2} />
          Page Content
        </div>

        <div className="space-y-5">
          {/* Title */}
          <Field label="Title" hint="Enter page title" required>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. About Us"
              className={inputCls}
            />
          </Field>

          {/* Link */}
          <Field label="Link" hint="Enter page link" required>
            <input
              type="text"
              value={link}
              onChange={(e) => handleLinkChange(e.target.value)}
              placeholder="e.g. About-us"
              className={inputCls}
            />
          </Field>

          {/* Slug */}
          <Field label="Slug" hint="URL friendly version of the link">
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. About Us"
              className={inputCls}
            />
          </Field>

          {/* Add Content – rich-text mock */}
          <Field label="Add Content" hint="Write or add the content of the page" required>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 rounded-t-lg border border-b-0 border-zinc-200 bg-zinc-50 px-2 py-1.5">
              <ToolbarBtn>
                <strong>B</strong>
              </ToolbarBtn>
              <ToolbarBtn>
                <em>I</em>
              </ToolbarBtn>
              <ToolbarBtn>
                <span className="underline">U</span>
              </ToolbarBtn>
              <ToolbarBtn>A▾</ToolbarBtn>
              <ToolbarBtn>A▾</ToolbarBtn>
              <span className="mx-1 h-4 w-px bg-zinc-200" />
              <ToolbarBtn>≡</ToolbarBtn>
              <ToolbarBtn>≡</ToolbarBtn>
              <ToolbarBtn>≡</ToolbarBtn>
              <ToolbarBtn>≡</ToolbarBtn>
              <span className="mx-1 h-4 w-px bg-zinc-200" />
              <ToolbarBtn>
                <span className="font-mono text-xs">&lt;&gt;</span>
              </ToolbarBtn>
            </div>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing..."
              className="w-full resize-none rounded-b-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-600 outline-none placeholder:text-zinc-400 focus:border-indigo-400 transition-colors"
            />
          </Field>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={handleReset} className="px-6">
            Cancel
          </Button>
          <button
            type="button"
            className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 active:scale-95 transition-all"
          >
            Update
          </button>
        </div>
      </Card>

      {/* ── SEO Fields Card ── */}
      <Card>
        {/* Card heading */}
        <div className="mb-5 flex items-center gap-2 text-base font-bold text-zinc-900">
          <Search className="h-4 w-4 text-zinc-500" strokeWidth={2} />
          SEO Fields
        </div>

        <div className="space-y-5">
          {/* Meta Title */}
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

          {/* Meta Description */}
          <Field label="Meta description" hint="Recommended: 150-160 Characters">
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

          {/* Keywords */}
          <Field label="Keywords" hint="Enter keywords separated by comma">
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. design, development"
              className={inputCls}
            />
          </Field>

          {/* Meta Image */}
          <Field label="Meta Image" hint="Upload meta image for this page">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 transition-colors ${
                isDragging
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-zinc-200 bg-zinc-50 hover:border-indigo-300 hover:bg-indigo-50/40"
              }`}
            >
              {metaImagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={metaImagePreview}
                  alt="Meta image preview"
                  className="max-h-20 max-w-full rounded-md object-contain"
                />
              ) : (
                <CloudUpload
                  className="h-10 w-10 text-indigo-400"
                  strokeWidth={1.5}
                />
              )}

              <p className="text-sm text-zinc-500">
                {metaImagePreview
                  ? metaImage?.name
                  : "Drag & drop your image here"}
              </p>

              {!metaImagePreview && (
                <>
                  <p className="text-xs text-zinc-400">or</p>
                  <span className="rounded-md bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-200">
                    Browse File
                  </span>
                  <p className="text-xs text-zinc-400">
                    PNG, JPG, SVG (12 × 60px)
                  </p>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageFile(file);
                }}
              />
            </div>
          </Field>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={handleReset} className="px-6">
            Cancel
          </Button>
          <button
            type="button"
            className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 active:scale-95 transition-all"
          >
            Update
          </button>
        </div>
      </Card>
    </div>
  );
}
