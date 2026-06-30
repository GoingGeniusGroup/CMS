"use client";

export function AddDesignationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
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
              placeholder="Enter designation title"
              className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Department <span className="text-red-500">*</span>
            </label>
            <select className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm text-zinc-500 outline-none focus:border-indigo-400">
              <option>Select Department</option>
              <option>Design</option>
              <option>Development</option>
              <option>Content</option>
              <option>Management</option>
              <option>Marketing</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">Description</label>
            <textarea
              rows={4}
              placeholder="Enter description about the designation......."
              className="w-full resize-none rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-black/15 px-4 py-2 text-sm font-medium text-zinc-700"
          >
            Cancel
          </button>
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
            Add Designation
          </button>
        </div>
      </div>
    </div>
  );
}
