"use client";

import { useState } from "react";

export function AddDepartmentModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  /** Called with the new department name when the form is submitted. */
  onAdd?: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Department name is required");
      return;
    }
    setError("");
    setIsSubmitting(true);
    await onAdd?.(name.trim());
    setIsSubmitting(false);
    setName("");
    onClose();
  };

  const handleClose = () => {
    setName("");
    setError("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <div className="my-auto w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="mb-5 text-lg font-bold">Add Department</h2>

        <div>
          <label className="mb-1 block text-sm font-semibold">
            Department Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            placeholder="e.g. Marketing"
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400 ${
              error ? "border-red-400" : "border-black/15"
            }`}
          />
          {error && <p className="mt-0.5 text-xs text-red-500">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-black/15 px-4 py-2 text-sm font-medium text-zinc-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Department"}
          </button>
        </div>
      </div>
    </div>
  );
}
