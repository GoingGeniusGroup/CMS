"use client";

import { useState } from "react";
import { FileText, Search, Loader2, Menu } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { PageHeader } from "@/components/PageHeader";
import { ImageUploader } from "@/components/ImageUploader";
import { TiptapEditor } from "@/components/TiptapEditor";
import { createPage } from "@/app/actions/pages";
import { getWebsiteHeader, saveWebsiteHeader } from "@/app/actions/website-header";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/react";

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
  const [content, setContent] = useState<JSONContent | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [status, setStatus] = useState<"Published" | "Draft">("Draft");

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [keywords, setKeywords] = useState("");
  const [metaImage, setMetaImage] = useState<string | null>(null);

  const [addToNav, setAddToNav] = useState(false);
  const [navLabel, setNavLabel] = useState("");

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
    if (!navLabel) setNavLabel(val);
  }

  function handleReset() {
    setTitle("");
    setSlug("");
    setContent(null);
    setThumbnail(null);
    setStatus("Draft");
    setMetaTitle("");
    setMetaDesc("");
    setKeywords("");
    setMetaImage(null);
    setAddToNav(false);
    setNavLabel("");
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
      content: content ? JSON.parse(JSON.stringify(content)) : undefined,
      thumbnail: thumbnail || undefined,
      metaTitle: metaTitle || undefined,
      metaDesc: metaDesc || undefined,
      keywords: keywords || undefined,
      metaImage: metaImage || undefined,
      status,
    });

    if (!result.success) {
      setIsSubmitting(false);
      setError(result.error || "Something went wrong");
      return;
    }

    // Optionally add to navigation menu
    if (addToNav) {
      try {
        const header = await getWebsiteHeader();
        const path = `/${slug}`;
        const exists = header.menuItems.some((m) => m.path === path);
        if (!exists) {
          await saveWebsiteHeader({
            ...header,
            menuItems: [
              ...header.menuItems,
              { label: navLabel || title, path },
            ],
          });
        }
      } catch (e) {
        console.error("Failed to add page to navigation:", e);
      }
    }

    setIsSubmitting(false);
    setSuccess(true);
    handleReset();
    router.push("/pages");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Page"
        description="Create a new page for your website. Content is fully customizable with the rich text editor."
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
              placeholder="e.g. Terms & Conditions"
              className={inputCls}
            />
          </Field>

          <Field label="Slug" hint="URL-friendly version (auto-generated from title)">
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. terms-and-conditions"
              className={inputCls}
            />
          </Field>

          <ImageUploader
            label="Page Thumbnail"
            value={thumbnail}
            onChange={(url) => setThumbnail(url)}
          />

          <Field
            label="Content"
            hint="Use headings (H2) to create numbered sections. They automatically appear in the 'On this page' sidebar."
          >
            <TiptapEditor
              content={content}
              onChange={(json) => setContent(json)}
              placeholder="Start writing your page content..."
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

      {/* Navigation Menu Card */}
      <Card>
        <div className="mb-5 flex items-center gap-2 text-base font-bold text-zinc-900">
          <Menu className="h-4 w-4 text-zinc-500" strokeWidth={2} />
          Navigation Menu
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={addToNav}
              onChange={(e) => setAddToNav(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 accent-indigo-600"
            />
            <span className="text-sm font-medium text-zinc-700">
              Add this page to the website navigation menu
            </span>
          </label>

          {addToNav && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Menu Label" hint="Text shown in the navbar">
                <input
                  type="text"
                  value={navLabel}
                  onChange={(e) => setNavLabel(e.target.value)}
                  placeholder="e.g. Terms & Conditions"
                  className={inputCls}
                />
              </Field>
              <Field label="Route" hint="Auto-generated from slug">
                <input
                  type="text"
                  value={slug ? `/${slug}` : ""}
                  disabled
                  className={`${inputCls} bg-zinc-50 text-zinc-400`}
                />
              </Field>
            </div>
          )}
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
              placeholder="e.g. terms, conditions, legal"
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
