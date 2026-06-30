"use client";

import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { AddDesignationModal } from "@/components/AddDesignationModal";

export function AddMemberModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [showAddDesignation, setShowAddDesignation] = useState(false);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
        <div className="my-auto w-full max-w-2xl rounded-xl bg-white p-5 shadow-2xl">
          <h2 className="mb-4 text-lg font-bold">Add Member</h2>

          <div className="flex flex-col gap-4 md:flex-row">
            {/* Upload photo */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full cursor-pointer flex-col items-center gap-2.5 self-start rounded-xl bg-zinc-50 p-6 md:w-60"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photo}
                  alt="Selected"
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-lg text-indigo-500">
                  <Camera className="h-7 w-7" />
                </span>
              )}
              <div className="text-lg font-semibold">Upload Photo</div>
              <div className="text-center text-xs leading-tight text-zinc-400">
                Best Resolution
                <br />
                500px * 400px
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="rounded-md border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600"
              >
                Choose File
              </button>
            </div>

            {/* Fields */}
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Full Name"
                    className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm text-zinc-500 outline-none focus:border-indigo-400">
                    <option>Select Designation</option>
                    <option>UI/UX Designer</option>
                    <option>Web Developer</option>
                    <option>Content Writer</option>
                    <option>Project Manager</option>
                  </select>
                  <div className="mt-1.5 flex justify-end">
                    <button
                      onClick={() => setShowAddDesignation(true)}
                      className="rounded-lg border border-indigo-200 px-2.5 py-1 text-xs font-semibold text-indigo-600"
                    >
                      + Add Designation
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium">Department</label>
                <select className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm text-zinc-500 outline-none focus:border-indigo-400">
                  <option>Select Department</option>
                  <option>Design</option>
                  <option>Development</option>
                  <option>Content</option>
                  <option>Management</option>
                  <option>Marketing</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium">Description</label>
                <textarea
                  rows={3}
                  maxLength={160}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description about team member......."
                  className="w-full resize-none rounded-lg border border-black/15 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400"
                />
                <div className="mt-0.5 text-right text-xs text-zinc-400">
                  {description.length}/160
                </div>
              </div>
            </div>
          </div>

          {/* Social fields */}
          <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-3">
            {["Facebook", "Twitter URL", "Instagram URL", "LinkedIn URL", "Domain", "Phone"].map(
              (label) => (
                <div key={label}>
                  <label className="mb-1 block text-xs font-bold">{label}</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-black/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  />
                </div>
              )
            )}
          </div>

          {/* Actions */}
          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-black/15 px-4 py-2 text-sm font-medium text-zinc-700"
            >
              Cancel
            </button>
            <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
              Add Member
            </button>
          </div>
        </div>
      </div>

      <AddDesignationModal
        open={showAddDesignation}
        onClose={() => setShowAddDesignation(false)}
      />
    </>
  );
}
