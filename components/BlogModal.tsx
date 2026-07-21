"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/Button";
import { ImageUploader } from "@/components/ImageUploader";
import { TiptapEditor } from "@/components/TiptapEditor";
import { createBlog, updateBlog, type BlogInput } from "@/app/actions/blogs";
import type { JSONContent } from "@tiptap/react";

type Author = {
  id: string;
  fullName: string;
};

type Blog = {
  id: string;
  title: string;
  slug: string;
  content: unknown;
  excerpt: string | null;
  category: string | null;
  tags: string[];
  readTime: string | null;
  authorId: string | null;
  author: Author | null;
  status: string;
  thumbnail?: string | null;
};

export function BlogModal({
  open,
  onClose,
  onSuccess,
  blog,
  authors,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  blog?: Blog | null;
  authors: Author[];
}) {
  const isEditing = !!blog;

  const [title, setTitle] = useState(blog?.title ?? "");
  const [slug, setSlug] = useState(blog?.slug ?? "");
  const [content, setContent] = useState<JSONContent | null>(
    (blog?.content as JSONContent) ?? null
  );
  const [excerpt, setExcerpt] = useState(blog?.excerpt ?? "");
  const [category, setCategory] = useState(blog?.category ?? "");
  const [tags, setTags] = useState<string[]>(blog?.tags ?? []);
  const [readTime, setReadTime] = useState(blog?.readTime ?? "");
  const [authorId, setAuthorId] = useState(blog?.authorId ?? "");
  const [thumbnail, setThumbnail] = useState(blog?.thumbnail ?? "");
  const [status, setStatus] = useState<"Published" | "Draft">(
    (blog?.status as "Published" | "Draft") ?? "Draft"
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

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEditing) {
      setSlug(generateSlug(value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const data: BlogInput = {
      title,
      slug,
      content: content ? JSON.parse(JSON.stringify(content)) : undefined,
      excerpt: excerpt || undefined,
      category: category || undefined,
      tags: tags.filter(Boolean),
      readTime: readTime || undefined,
      authorId: authorId || undefined,
      thumbnail: thumbnail || undefined,
      status,
    };

    const result = isEditing
      ? await updateBlog(blog!.id, data)
      : await createBlog(data);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || "Something went wrong");
      return;
    }

    onSuccess();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[95vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-zinc-400 hover:text-zinc-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="shrink-0 px-6 pt-6 sm:px-8 sm:pt-8">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? "Edit Blog" : "Add Blog"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 sm:px-8">
            <div className="space-y-4 pt-5">
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
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Blog title"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="blog-slug"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
                />
              </div>

              {/* Content — Tiptap Editor */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Content
                </label>
                <TiptapEditor
                  content={content as JSONContent | null}
                  onChange={(json) => setContent(json)}
                  placeholder="Start writing your blog post..."
                />
              </div>

              {/* Category + Author + ReadTime row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Technology" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Author</label>
                  <select value={authorId} onChange={(e) => setAuthorId(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40">
                    <option value="">Select author</option>
                    {authors.map((a) => (<option key={a.id} value={a.id}>{a.fullName}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Read Time</label>
                  <input type="text" value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="e.g. 8 min read" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40" />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Excerpt</label>
                <textarea rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary shown in blog cards..." className="mt-1 w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40" />
              </div>

              {/* Tags */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Tags</label>
                {tags.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {tags.map((tag, i) => (
                      <span key={i} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                        {tag}
                        <button type="button" onClick={() => setTags(tags.filter((_, idx) => idx !== i))} className="text-indigo-400 hover:text-indigo-700">×</button>
                      </span>
                    ))}
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Type a tag and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val && !tags.includes(val)) {
                        setTags([...tags, val]);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
                />
              </div>

              {/* Thumbnail */}
              <ImageUploader
                label="Thumbnail"
                value={thumbnail}
                onChange={(url) => setThumbnail(url || "")}
              />

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Published" | "Draft")}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>
          </div>

          {/* Buttons - sticky */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4 sm:px-8">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditing ? "Saving..." : "Creating..."
                : isEditing ? "Save Changes" : "Add Blog"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
