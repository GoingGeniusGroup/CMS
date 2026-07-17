"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import { ImageUploader } from "@/components/ImageUploader";
import { createProject, updateProject, type ProjectInput } from "@/app/actions/projects";

type SelectOption = { id: string; label: string };

type Project = {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  overview: string | null;
  category: string | null;
  liveUrl: string | null;
  customerId: string | null;
  teamId: string | null;
  serviceId: string | null;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  budget: number | null;
  thumbnail: string | null;
  gallery: string[];
  highlights: string[];
  challenges: string[];
  solutions: string[];
  technologies: string[];
  features: unknown;
  results: unknown;
};

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function ProjectModal({
  open,
  onClose,
  onSuccess,
  project,
  customers = [],
  services = [],
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project?: Project | null;
  customers?: SelectOption[];
  services?: SelectOption[];
}) {
  const isEditing = !!project;

  // Basic fields
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [overview, setOverview] = useState(project?.overview ?? "");
  const [category, setCategory] = useState(project?.category ?? "");
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl ?? "");
  const [customerId, setCustomerId] = useState(project?.customerId ?? "");
  const [serviceId, setServiceId] = useState(project?.serviceId ?? "");
  const [status, setStatus] = useState<"Published" | "Draft">(
    (project?.status as "Published" | "Draft") ?? "Draft"
  );
  const [startDate, setStartDate] = useState(
    project?.startDate ? new Date(project.startDate).toISOString().split("T")[0] : ""
  );
  const [endDate, setEndDate] = useState(
    project?.endDate ? new Date(project.endDate).toISOString().split("T")[0] : ""
  );
  const [budget, setBudget] = useState(project?.budget?.toString() ?? "");
  const [thumbnail, setThumbnail] = useState(project?.thumbnail ?? "");

  // Array fields
  const [highlights, setHighlights] = useState<string[]>(project?.highlights ?? []);
  const [challenges, setChallenges] = useState<string[]>(project?.challenges ?? []);
  const [solutions, setSolutions] = useState<string[]>(project?.solutions ?? []);
  const [technologies, setTechnologies] = useState<string[]>(project?.technologies ?? []);
  const [gallery, setGallery] = useState<string[]>(project?.gallery ?? []);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

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

    const data: ProjectInput = {
      title,
      slug: slug || undefined,
      description: description || undefined,
      overview: overview || undefined,
      category: category || undefined,
      liveUrl: liveUrl || undefined,
      customerId: customerId || undefined,
      serviceId: serviceId || undefined,
      status,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      budget: budget ? parseFloat(budget) : undefined,
      thumbnail: thumbnail || null,
      gallery: gallery.filter(Boolean),
      highlights: highlights.filter(Boolean),
      challenges: challenges.filter(Boolean),
      solutions: solutions.filter(Boolean),
      technologies: technologies.filter(Boolean),
    };

    const result = isEditing
      ? await updateProject(project!.id, data)
      : await createProject(data);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || "Something went wrong");
      return;
    }

    onSuccess();
    onClose();
  }

  const inputCls = "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40";
  const labelCls = "block text-sm font-medium text-gray-700";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8"
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

        <h2 className="text-xl font-bold text-gray-900">
          {isEditing ? "Edit Project" : "Add Project"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* ─── Basic Info ─── */}
          <fieldset className="space-y-4 rounded-xl border border-zinc-200 p-4">
            <legend className="px-2 text-sm font-bold text-zinc-700">Basic Info</legend>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Title <span className="text-red-500">*</span></label>
                <input type="text" required value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Project title" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Slug</label>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="project-slug" className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Short Description</label>
              <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief project description..." className={inputCls + " resize-none"} />
            </div>

            <div>
              <label className={labelCls}>Detailed Overview</label>
              <textarea rows={3} value={overview} onChange={(e) => setOverview(e.target.value)} placeholder="Detailed project overview for the case study page..." className={inputCls + " resize-none"} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className={labelCls}>Category</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Web Development" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Live URL</label>
                <input type="url" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://..." className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Status <span className="text-red-500">*</span></label>
                <select value={status} onChange={(e) => setStatus(e.target.value as "Published" | "Draft")} className={inputCls}>
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Customer</label>
                <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className={inputCls}>
                  <option value="">Select customer</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Service</label>
                <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className={inputCls}>
                  <option value="">Select service</option>
                  {services.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className={labelCls}>Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Budget</label>
                <input type="number" step="0.01" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="0.00" className={inputCls} />
              </div>
            </div>

            <ImageUploader label="Thumbnail" value={thumbnail} onChange={(url) => setThumbnail(url || "")} />
          </fieldset>

          {/* ─── Project Details ─── */}
          <fieldset className="space-y-4 rounded-xl border border-zinc-200 p-4">
            <legend className="px-2 text-sm font-bold text-zinc-700">Project Details</legend>

            <ListEditor label="Highlights" items={highlights} onChange={setHighlights} placeholder="e.g. Modern UI/UX design" />
            <ListEditor label="Key Challenges" items={challenges} onChange={setChallenges} placeholder="e.g. Handling high traffic" />
            <ListEditor label="Solutions" items={solutions} onChange={setSolutions} placeholder="e.g. Auto-scaling infrastructure" />
            <ListEditor label="Technologies" items={technologies} onChange={setTechnologies} placeholder="e.g. React, Node.js" />
          </fieldset>

          {/* ─── Gallery ─── */}
          <fieldset className="space-y-3 rounded-xl border border-zinc-200 p-4">
            <legend className="px-2 text-sm font-bold text-zinc-700">Gallery Images</legend>
            <GalleryEditor images={gallery} onChange={setGallery} />
          </fieldset>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (isEditing ? "Saving..." : "Creating...") : (isEditing ? "Save Changes" : "Add Project")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── List Editor Component ───────────────────────────────────────────────────

function ListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [newItem, setNewItem] = useState("");

  function add() {
    if (!newItem.trim()) return;
    onChange([...items, newItem.trim()]);
    setNewItem("");
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      {items.length > 0 && (
        <ul className="mb-2 space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
              <span className="flex-1">{item}</span>
              <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
        />
        <button type="button" onClick={add} className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200">
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Gallery Editor Component ────────────────────────────────────────────────

function GalleryEditor({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  return (
    <div>
      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-4 gap-2">
          {images.map((url, i) => (
            <div key={i} className="group relative rounded-lg border border-zinc-200 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Gallery ${i + 1}`} className="h-16 w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(images.filter((_, idx) => idx !== i))}
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <ImageUploader
        label="Add Gallery Image"
        value={null}
        onChange={(url) => {
          if (url) onChange([...images, url]);
        }}
      />
    </div>
  );
}
