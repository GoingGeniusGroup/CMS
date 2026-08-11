"use client";

import { useState, useRef, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import { ImageUploader } from "@/components/ImageUploader";
import { CustomFieldRenderer, type CustomValues } from "@/components/CustomFieldRenderer";
import { useEntityLabel, useStatusOptions } from "@/components/ConfigProvider";
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
  const projectLabel = useEntityLabel("project");
  const projectStatusOptions = useStatusOptions("project");
  const defaultStatus =
    projectStatusOptions.find((o) => o.isDefault)?.statusValue ?? "Draft";

  // Basic fields
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [overview, setOverview] = useState(project?.overview ?? "");
  const [category, setCategory] = useState(project?.category ?? "");
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl ?? "");
  const [customerId, setCustomerId] = useState(project?.customerId ?? "");
  const [serviceId, setServiceId] = useState(project?.serviceId ?? "");
  const [status, setStatus] = useState<string>(project?.status ?? defaultStatus);
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
  const [customValues, setCustomValues] = useState<CustomValues>({});

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

    if (!title.trim()) {
      setError("Project title is required");
      return;
    }

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
      ? await updateProject(project!.id, data, customValues)
      : await createProject(data, customValues);

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
        className="relative flex max-h-[95vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl"
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
            {isEditing ? `Edit ${projectLabel}` : `Add ${projectLabel}`}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 sm:px-8">
            <div className="space-y-5 pt-5">
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
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
                      {projectStatusOptions.map((o) => (
                        <option key={o.statusValue} value={o.statusValue}>{o.label}</option>
                      ))}
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

              {/* ─── Project Details (Optional Case Study Section) ─── */}
              <fieldset className="space-y-4 rounded-xl border border-zinc-200 p-4">
                <legend className="px-2 text-sm font-bold text-zinc-700">
                  Project Details 
                  <span className="ml-2 text-xs font-normal text-zinc-500">(Optional - for portfolio/case studies)</span>
                </legend>

                <ListEditor label="Highlights" items={highlights} onChange={setHighlights} placeholder="e.g. Modern UI/UX design" />
                <ListEditor label="Key Challenges" items={challenges} onChange={setChallenges} placeholder="e.g. Handling high traffic" />
                <ListEditor label="Solutions" items={solutions} onChange={setSolutions} placeholder="e.g. Auto-scaling infrastructure" />
              </fieldset>

              {/* ─── Tags / Technologies ─── */}
              <fieldset className="space-y-4 rounded-xl border border-zinc-200 p-4">
                <legend className="px-2 text-sm font-bold text-zinc-700">Tags / Technologies</legend>
                <ListEditor 
                  label="Tags" 
                  items={technologies} 
                  onChange={setTechnologies} 
                  placeholder="e.g. React, Node.js, Healthcare, Mobile-Friendly" 
                />
                <p className="text-xs text-zinc-500">Add relevant tags, technologies, or attributes for this project</p>
              </fieldset>

              {/* ─── Gallery ─── */}
              <fieldset className="space-y-3 rounded-xl border border-zinc-200 p-4">
                <legend className="px-2 text-sm font-bold text-zinc-700">Gallery Images</legend>
                <GalleryEditor images={gallery} onChange={setGallery} />
              </fieldset>

              {/* ─── Custom Fields ─── */}
              <CustomFieldRenderer
                moduleKey="project"
                recordId={project?.id}
                onValuesChange={setCustomValues}
              />
            </div>
          </div>

          {/* Submit - sticky */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4 sm:px-8">
            <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (isEditing ? "Saving..." : "Creating...") : (isEditing ? "Save Changes" : `Add ${projectLabel}`)}
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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const handleAddImage = (url: string) => {
    const updated = [...imagesRef.current, url];
    onChange(updated);
    imagesRef.current = updated;
  };

  const handleReplaceImage = (url: string) => {
    if (editingIndex === null) return;
    setEditingIndex(null);
    const updated = [...imagesRef.current];
    updated[editingIndex] = url;
    onChange(updated);
    imagesRef.current = updated;
  };

  return (
    <div>
      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-4 gap-2">
          {images.map((url, i) => (
            <div key={i} className="group relative rounded-lg border border-zinc-200 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Gallery ${i + 1}`} className="h-16 w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setEditingIndex(i)}
                  className="flex items-center gap-1 rounded bg-white/20 px-2 py-1 text-xs hover:bg-white/30"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const updated = imagesRef.current.filter((_, idx) => idx !== i);
                    onChange(updated);
                    imagesRef.current = updated;
                  }}
                  className="flex items-center gap-1 rounded bg-white/20 px-2 py-1 text-xs hover:bg-white/30"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingIndex !== null ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-amber-700">
              Replacing image {editingIndex + 1}
            </p>
            <button
              type="button"
              onClick={() => setEditingIndex(null)}
              className="text-xs text-amber-600 hover:text-amber-800"
            >
              Cancel
            </button>
          </div>
          <ImageUploader
            value={images[editingIndex]}
            onChange={(url) => {
              if (url) handleReplaceImage(url);
            }}
          />
        </div>
      ) : (
        <ImageUploader
          label="Add Gallery Image"
          value={null}
          multiple
          onChange={(url) => {
            if (url) handleAddImage(url);
          }}
        />
      )}
    </div>
  );
}
