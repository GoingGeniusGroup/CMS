"use client";

import { useRef, useState } from "react";
import { ChevronDown, Plus, UploadCloud, X } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const CATEGORIES = [
  "Web Development",
  "Web Design",
  "Mobile App",
  "Branding",
  "SEO",
  "UI/UX Design",
  "Digital Marketing",
];

export function AddProjectModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const fileInputRef                  = useRef<HTMLInputElement>(null);
  const [preview, setPreview]         = useState<string | null>(null);
  const [fileName, setFileName]       = useState<string | null>(null);
  const [techs, setTechs]             = useState<string[]>(["React", "React", "React", "React", "React"]);
  const [newTech, setNewTech]         = useState("");
  const [status, setStatus]           = useState<"Published" | "Draft">("Published");
  const [url, setUrl]                 = useState("");

  if (!open) return null;

  function handleFile(file: File | undefined) {
    if (!file) return;
    setFileName(file.name);
    const objectUrl = URL.createObjectURL(file);
    setPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return objectUrl; });
  }

  function addTech() {
    const t = newTech.trim();
    if (t) { setTechs((prev) => [...prev, t]); setNewTech(""); }
  }

  function removeTech(i: number) {
    setTechs((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Sticky header: title + X ── */}
        <div className="flex items-start justify-between px-6 pt-6 pb-2">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Add Projects</h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              Create a new project and add its key details.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-4 mt-0.5 shrink-0 rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div
          className="overflow-y-auto px-6 pb-6"
          style={{ maxHeight: "calc(100vh - 8rem)" }}
        >
          <form className="flex flex-col gap-5 pt-4" onSubmit={handleSubmit}>

            {/* Status */}
            <div className="flex flex-col items-end gap-1.5">
              <label className="text-sm font-bold text-zinc-900">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="relative w-44">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <span className={`h-2.5 w-2.5 rounded-full ${status === "Published" ? "bg-emerald-500" : "bg-zinc-400"}`} />
                </span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Published" | "Draft")}
                  className="h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-white pl-8 pr-8 text-sm text-zinc-700 outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              </div>
            </div>

            {/* Image upload */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }}
              className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white text-center transition-colors hover:bg-zinc-50"
              aria-label="Upload project image"
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt={fileName ?? "preview"} className="h-full w-full rounded-xl object-contain p-2" />
              ) : (
                <>
                  <UploadCloud className="h-8 w-8 text-zinc-700" />
                  <span className="text-sm font-medium text-zinc-700">Upload Image</span>
                  <span className="text-xs text-zinc-400">PNG, JPG or SVG</span>
                  <span className="text-xs text-zinc-400">Max 2MB</span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {/* Project Title + Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-zinc-900">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-700 outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-zinc-900">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    defaultValue=""
                    className="h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 pr-8 text-sm text-zinc-500 outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value="" disabled>Select Category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                </div>
              </div>
            </div>

            {/* Short Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-zinc-900">
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Write a short description"
                className="w-full resize-none rounded-xl border border-zinc-200 p-4 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            {/* Full Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-zinc-900">
                Full Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Write a Full description of projects"
                className="w-full resize-none rounded-xl border border-zinc-200 p-4 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            {/* Technology Used */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-zinc-900">
                Technology Used <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {techs.map((tech, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTech(i)}
                      className="ml-0.5 text-zinc-400 hover:text-zinc-700"
                      aria-label={`Remove ${tech}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }}
                    placeholder="Tech"
                    className="h-9 w-20 rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-zinc-200 px-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Add Button (GitHub URL) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-zinc-900">Add Button</label>
              <div className="flex h-11 items-center gap-3 rounded-xl border border-zinc-200 px-4">
                <FaGithub className="h-5 w-5 shrink-0 text-zinc-700" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://"
                  className="flex-1 bg-transparent text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-zinc-200 bg-white px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Save Project
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
