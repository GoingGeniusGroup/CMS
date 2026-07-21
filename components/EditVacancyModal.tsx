"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/Button";
import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";

export interface JobVacancyRow {
  id: string;
  title: string;
  department: string;
  type: string;
  mode: string;
  location: string;
  salaryRange: string;
  experience: string;
  vacanciesCount: number;
  deadline: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  applicantsCount: number;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
}

interface EditVacancyModalProps {
  open: boolean;
  vacancy: JobVacancyRow | null;
  onClose: () => void;
  onSuccess: (updated: JobVacancyRow) => void;
}

export function EditVacancyModal({
  open,
  vacancy,
  onClose,
  onSuccess,
}: EditVacancyModalProps) {
  const [form, setForm] = useState({
    title: "",
    department: "Developer",
    type: "Full-time",
    mode: "Remote",
    location: "",
    salaryRange: "",
    experience: "",
    vacanciesCount: 1,
    deadline: "",
    isActive: true,
    isFeatured: false,
    tags: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    if (vacancy) {
      setForm({
        title: vacancy.title || "",
        department: vacancy.department || "Developer",
        type: vacancy.type || "Full-time",
        mode: vacancy.mode || "Remote",
        location: vacancy.location || "",
        salaryRange: vacancy.salaryRange || "",
        experience: vacancy.experience || "",
        vacanciesCount: vacancy.vacanciesCount || 1,
        deadline: vacancy.deadline || "",
        isActive: vacancy.isActive ?? true,
        isFeatured: vacancy.isFeatured ?? false,
        tags: Array.isArray(vacancy.tags) ? vacancy.tags.join(", ") : "",
        description: vacancy.description || "",
      });
      setThumbnailUrl(vacancy.thumbnailUrl || null);
      setFileName(null);
      setError(null);
    }
  }, [vacancy]);

  if (!open || !vacancy) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setForm((prev) => ({ ...prev, [name]: parseInt(value) || 1 }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.title.trim()) {
      setError("Job Title is required");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const updatedItem: JobVacancyRow = {
        ...vacancy,
        title: form.title,
        department: form.department,
        type: form.type,
        mode: form.mode,
        location: form.location,
        salaryRange: form.salaryRange,
        experience: form.experience,
        vacanciesCount: form.vacanciesCount,
        deadline: form.deadline,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        description: form.description,
        thumbnailUrl: thumbnailUrl || undefined,
        updatedAt: new Date().toISOString().split("T")[0],
      };

      onSuccess(updatedItem);
      setIsLoading(false);
      onClose();
    }, 200);
  };

  const inputCls =
    "w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-200";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl"
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

        <div className="shrink-0 px-8 pt-8">
          <h2 className="text-2xl font-bold text-zinc-900">Edit Vacancy</h2>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="flex-1 overflow-y-auto px-8">
            <div className="space-y-5 pt-5">
              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              {/* Title */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-800">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className={inputCls}
                />
              </div>

              {/* Department & Type */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-800">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    <option value="Developer">Developer</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-800">
                    Employment Type
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              {/* Work Mode & Experience */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-800">
                    Work Mode
                  </label>
                  <select
                    name="mode"
                    value={form.mode}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-800">
                    Experience
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Location & Salary */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-800">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-800">
                    Salary / Compensation
                  </label>
                  <input
                    type="text"
                    name="salaryRange"
                    value={form.salaryRange}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Deadline & Vacancies Count */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-800">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-800">
                    Open Vacancies
                  </label>
                  <input
                    type="number"
                    name="vacanciesCount"
                    min={1}
                    value={form.vacanciesCount}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-800">
                  Tags / Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>

              {/* Status Checkbox & Featured */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Active Status
                </label>

                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={form.isFeatured}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Featured Vacancy
                </label>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-800">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-black/15 bg-white p-4 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              {/* Thumbnail — Uploadcare */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-800">
                  Thumbnail
                </label>
                <FileUploaderRegular
                  pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!}
                  maxLocalFileSizeBytes={2_000_000}
                  imgOnly
                  onFileUploadSuccess={(file) => {
                    setThumbnailUrl(file.cdnUrl ?? null);
                    setFileName(file.name ?? null);
                  }}
                  onFileRemoved={() => {
                    setThumbnailUrl(null);
                    setFileName(null);
                  }}
                  className="w-full"
                />
                {fileName && thumbnailUrl && (
                  <p className="text-xs text-emerald-600">
                    ✓ Uploaded: {fileName}
                  </p>
                )}
                {!fileName && thumbnailUrl && (
                  <p className="text-xs text-emerald-600">
                    ✓ Has existing thumbnail
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions - sticky */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-zinc-200 px-8 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
