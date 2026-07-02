"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/Button";
import { createProject, updateProject, type ProjectInput } from "@/app/actions/projects";

type SelectOption = { id: string; label: string };

type Project = {
  id: string;
  title: string;
  description: string | null;
  customerId: string | null;
  teamId: string | null;
  serviceId: string | null;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  budget: number | null;
};

export function ProjectModal({
  open,
  onClose,
  onSuccess,
  project,
  customers = [],
  teams = [],
  services = [],
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project?: Project | null;
  customers?: SelectOption[];
  teams?: SelectOption[];
  services?: SelectOption[];
}) {
  const isEditing = !!project;

  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [customerId, setCustomerId] = useState(project?.customerId ?? "");
  const [teamId, setTeamId] = useState(project?.teamId ?? "");
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
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const data: ProjectInput = {
      title,
      description: description || undefined,
      customerId: customerId || undefined,
      teamId: teamId || undefined,
      serviceId: serviceId || undefined,
      status,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      budget: budget ? parseFloat(budget) : undefined,
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8"
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project title"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description..."
              className="mt-1 w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Customer</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
            >
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Team</label>
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
            >
              <option value="">Select team member</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Service</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
            >
              <option value="">Select service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Budget</label>
            <input
              type="number"
              step="0.01"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="0.00"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
            />
          </div>

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

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditing ? "Saving…" : "Creating…"
                : isEditing ? "Save Changes" : "Add Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
