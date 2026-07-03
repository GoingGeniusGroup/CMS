"use client";

import { useState } from "react";

export function AddDesignationModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  /** Called with the new designation title when the form is submitted. */
  onAdd?: (title: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState("");
  const [deptError, setDeptError] = useState("");

  const handleSubmit = () => {
    let valid = true;
    if (!title.trim()) {
      setTitleError("Title is required");
      valid = false;
    } else {
      setTitleError("");
    }
    if (!department || department === "Select Department") {
      setDeptError("Department is required");
      valid = false;
    } else {
      setDeptError("");
    }
    if (!valid) return;

    onAdd?.(title.trim());
    // Reset form
    setTitle("");
    setDepartment("");
    setDescription("");
    setTitleError("");
    setDeptError("");
    onClose();
  };

  const handleClose = () => {
    setTitle("");
    setDepartment("");
    setDescription("");
    setTitleError("");
    setDeptError("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <div className="my-auto w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="mb-5 text-lg font-bold">Add Designation</h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError("");
              }}
              placeholder="Enter designation title"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400 ${
                titleError ? "border-red-400" : "border-black/15"
              }`}
            />
            {titleError && (
              <p className="mt-0.5 text-xs text-red-500">{titleError}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                if (deptError) setDeptError("");
              }}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm text-zinc-500 outline-none focus:border-indigo-400 ${
                deptError ? "border-red-400" : "border-black/15"
              }`}
            >
              <option value="">Select Department</option>
              <option>Design</option>
              <option>Development</option>
              <option>Content</option>
              <option>Management</option>
              <option>Marketing</option>
            </select>
            {deptError && (
              <p className="mt-0.5 text-xs text-red-500">{deptError}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description about the designation......."
              className="w-full resize-none rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400"
            />
          </div>
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
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            Add Designation
          </button>
        </div>
      </div>
    </div>
  );
}
