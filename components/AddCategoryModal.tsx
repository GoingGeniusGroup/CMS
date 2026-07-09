"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  category?: Category | null;
  parentOptions?: string[];
}

export function AddCategoryModal({ open, onClose }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [order, setOrder] = useState("");
  const [link, setLink] = useState("");
  const [banner, setBanner] = useState<string | null>(null);
  const [icon, setIcon] = useState<string | null>(null);

  const bannerRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLInputElement>(null);

  const handleBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setBanner(URL.createObjectURL(file));
  };

  const handleIcon = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setIcon(URL.createObjectURL(file));
  };

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
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">
              {isEditing ? "Edit Category" : "Add New Category"}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {isEditing ? "Update category details." : "Create a new category to organize your website content."}
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* Order Number */}
          <div>
            <label className="mb-0.5 block text-sm font-bold text-zinc-800">
              Order Number <span className="text-red-500">*</span>
            </label>
            <p className="mb-1.5 text-xs text-zinc-400">Set the order for displaying category.</p>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              placeholder="e.g. 1"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-600 outline-none placeholder:text-zinc-400 focus:border-amber-400"
            />
            <p className="mt-1 text-xs text-amber-500">Lower numbers appear first.</p>
          </div>

          {/* Banner */}
          <div>
            <label className="mb-0.5 block text-sm font-bold text-zinc-800">Banner</label>
            <p className="mb-1.5 text-xs text-zinc-400">Upload a banner image for this category.</p>
            <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={handleBanner} />
            <div
              onClick={() => bannerRef.current?.click()}
              className="flex min-h-[140px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white transition-colors hover:bg-zinc-50"
            >
              {banner ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={banner} alt="Banner preview" className="max-h-32 rounded-md object-contain" />
              ) : (
                <>
                  <UploadCloud className="h-8 w-8 text-amber-500" />
                  <p className="text-sm text-zinc-600">Drag &amp; drop your banner image here</p>
                  <p className="text-xs text-zinc-400">or</p>
                  <span className="text-sm font-semibold text-amber-500 hover:underline">Browse File</span>
                  <p className="text-xs text-zinc-400">Recommended size: 1920 × 600px</p>
                </>
              )}
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="mb-0.5 block text-sm font-bold text-zinc-800">Icon</label>
            <p className="mb-1.5 text-xs text-zinc-400">Upload an icon to represent this category.</p>
            <input ref={iconRef} type="file" accept="image/*,.svg" className="hidden" onChange={handleIcon} />
            <div
              onClick={() => iconRef.current?.click()}
              className="flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white transition-colors hover:bg-zinc-50"
            >
              {icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={icon} alt="Icon preview" className="h-16 w-16 rounded-md object-contain" />
              ) : (
                <>
                  <UploadCloud className="h-7 w-7 text-amber-500" />
                  <p className="text-sm font-medium text-zinc-600">Upload Icon</p>
                  <p className="text-xs text-zinc-400">Only SVG, PNG, JPG, WEBP</p>
                  <p className="text-xs text-zinc-400">Recommended: 64×64px</p>
                </>
              )}
            </div>
          </div>

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

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
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
