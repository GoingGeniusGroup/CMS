"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

interface AddPageModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddPageModal({ open, onClose }: AddPageModalProps) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-zinc-900">Add New Page</h2>
          <p className="mt-1 text-sm text-zinc-500">Create a new page for your website.</p>
        </div>

        {/* Page Content card */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-700">
            <FileText className="h-4 w-4 text-zinc-500" />
            Page Content
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="mb-0.5 block text-sm font-bold text-zinc-800">
                Title <span className="text-red-500">*</span>
              </label>
              <p className="mb-1.5 text-xs text-zinc-400">Enter page title</p>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. About Us"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-3 text-sm text-zinc-600 outline-none placeholder:text-zinc-400 focus:border-indigo-400"
              />
            </div>

            {/* Link */}
            <div>
              <label className="mb-0.5 block text-sm font-bold text-zinc-800">
                Link <span className="text-red-500">*</span>
              </label>
              <p className="mb-1.5 text-xs text-zinc-400">Enter page link</p>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="e.g. About-us"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-3 text-sm text-zinc-600 outline-none placeholder:text-zinc-400 focus:border-indigo-400"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="mb-0.5 block text-sm font-bold text-zinc-800">Slug</label>
              <p className="mb-1.5 text-xs text-zinc-400">URL friendly version of the link</p>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. About Us"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-3 text-sm text-zinc-600 outline-none placeholder:text-zinc-400 focus:border-indigo-400"
              />
            </div>

            {/* Add Content */}
            <div>
              <label className="mb-0.5 block text-sm font-bold text-zinc-800">
                Add Content <span className="text-red-500">*</span>
              </label>
              <p className="mb-1.5 text-xs text-zinc-400">Write or add the content of the page</p>
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-b-0 border-zinc-300 bg-zinc-50 px-2 py-1.5">
                {[
                  { label: "B", cls: "font-bold" },
                  { label: "I", cls: "italic" },
                  { label: "U", cls: "underline" },
                  { label: "⊞", cls: "" },
                  { label: "A·", cls: "" },
                  { label: "≡L", cls: "" },
                  { label: "≡C", cls: "" },
                  { label: "≡R", cls: "" },
                  { label: "≡J", cls: "" },
                  { label: "<>", cls: "" },
                ].map((t, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`rounded px-1.5 py-0.5 text-xs text-zinc-600 hover:bg-zinc-200 ${t.cls}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <textarea
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing...."
                className="w-full resize-none rounded-b-lg border border-zinc-300 bg-white px-3 py-3 text-sm text-zinc-600 outline-none placeholder:text-zinc-400 focus:border-indigo-400"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
