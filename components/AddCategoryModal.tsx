"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/Button";
import { ImageUploader } from "@/components/ImageUploader";
import { createCategory, updateCategory, type CategoryInput } from "@/app/actions/categories";

type Category = {
  id: string;
  name: string;
  slug: string;
  parent: string | null;
  order: number;
  banner: string | null;
  icon: string | null;
  link: string | null;
  status: string;
};

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  category?: Category | null;
  parentOptions?: string[];
}

export function AddCategoryModal({
  open,
  onClose,
  onSuccess,
  category,
  parentOptions = ["Services", "Careers", "Invoices", "Blogs", "Pages"],
}: AddCategoryModalProps) {
  const isEditing = !!category;

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [parent, setParent] = useState(category?.parent ?? "");
  const [order, setOrder] = useState(category?.order?.toString() ?? "0");
  const [link, setLink] = useState(category?.link ?? "");
  const [banner, setBanner] = useState<string | null>(category?.banner ?? null);
  const [icon, setIcon] = useState<string | null>(category?.icon ?? null);
  const [status, setStatus] = useState<"Active" | "Draft" | "Inactive">(
    (category?.status as "Active" | "Draft" | "Inactive") ?? "Active"
  );

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  function handleNameChange(val: string) {
    setName(val);
    if (!isEditing) setSlug(generateSlug(val));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const data: CategoryInput = {
      name,
      slug,
      parent: parent || undefined,
      order: parseInt(order) || 0,
      banner: banner || undefined,
      icon: icon || undefined,
      link: link || undefined,
      status,
    };

    const result = isEditing
      ? await updateCategory(category!.id, data)
      : await createCategory(data);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || "Something went wrong");
      return;
    }

    onSuccess?.();
    onClose();
  }

  const inputCls = "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:border-amber-400 focus:bg-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-zinc-400 hover:text-zinc-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="shrink-0 px-6 pt-6 sm:px-8 sm:pt-8">
          <h2 className="text-xl font-bold text-zinc-900">
            {isEditing ? "Edit Category" : "Add New Category"}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {isEditing ? "Update category details." : "Create a new category to organize your website content."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 sm:px-8">
            <div className="space-y-5 pt-5">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="mb-0.5 block text-sm font-bold text-zinc-800">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Web Development"
                  className={inputCls}
                />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-0.5 block text-sm font-bold text-zinc-800">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. web-development"
                  className={inputCls}
                />
              </div>

              {/* Parent Category */}
              <div>
                <label className="mb-0.5 block text-sm font-bold text-zinc-800">Parent Category</label>
                <select value={parent} onChange={(e) => setParent(e.target.value)} className={inputCls}>
                  <option value="">None (Top Level)</option>
                  {parentOptions.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Order + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-0.5 block text-sm font-bold text-zinc-800">Order Number</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    placeholder="e.g. 1"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-0.5 block text-sm font-bold text-zinc-800">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "Active" | "Draft" | "Inactive")}
                    className={inputCls}
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Banner via Uploadcare */}
              <ImageUploader label="Banner" value={banner} onChange={(url) => setBanner(url)} />

              {/* Icon via Uploadcare */}
              <ImageUploader label="Icon" value={icon} onChange={(url) => setIcon(url)} />

              {/* Link */}
              <div>
                <label className="mb-0.5 block text-sm font-bold text-zinc-800">Link</label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="Category page URL"
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4 sm:px-8">
            <Button variant="secondary" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
