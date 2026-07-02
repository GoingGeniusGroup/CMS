"use client";

import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { AddDesignationModal } from "@/components/AddDesignationModal";

export interface MemberFormData {
  name: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  status: "Active" | "On Leave";
  gender: "male" | "female";
  image: string | null;
  description: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  domain: string;
}

export interface MemberRecord extends MemberFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface FormErrors {
  name?: string;
  designation?: string;
  department?: string;
  phone?: string;
  email?: string;
  status?: string;
}

function validateForm(data: MemberFormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Name is required";
  if (!data.designation || data.designation === "Select Designation")
    errors.designation = "Designation is required";
  if (!data.department || data.department === "Select Department")
    errors.department = "Department is required";
  if (!data.phone.trim()) errors.phone = "Phone is required";
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Enter a valid email address";
  }
  if (!data.status) errors.status = "Status is required";
  return errors;
}

function buildInitialForm(editMember?: MemberRecord | null): MemberFormData {
  if (editMember) {
    return {
      name: editMember.name,
      designation: editMember.designation,
      department: editMember.department,
      phone: editMember.phone,
      email: editMember.email,
      status: editMember.status,
      gender: editMember.gender,
      image: editMember.image,
      description: editMember.description ?? "",
      facebook: editMember.facebook ?? "",
      twitter: editMember.twitter ?? "",
      instagram: editMember.instagram ?? "",
      linkedin: editMember.linkedin ?? "",
      domain: editMember.domain ?? "",
    };
  }
  return {
    name: "",
    designation: "",
    department: "",
    phone: "",
    email: "",
    status: "Active",
    gender: "male",
    image: null,
    description: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    domain: "",
  };
}

/**
 * AddMemberModal
 *
 * Pass a unique `key` from the parent (e.g. `key={modalKey}`) so React
 * remounts this component cleanly each time the modal opens or the target
 * member changes. This avoids stale state without needing a useEffect.
 */
export function AddMemberModal({
  open,
  onClose,
  onSubmit,
  editMember,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: MemberFormData) => void;
  editMember?: MemberRecord | null;
}) {
  const isEditMode = Boolean(editMember);

  // State is initialised once per mount (controlled via `key` from parent).
  const [showAddDesignation, setShowAddDesignation] = useState(false);
  const [form, setForm] = useState<MemberFormData>(() => buildInitialForm(editMember));
  const [photo, setPhoto] = useState<string | null>(editMember?.image ?? null);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
      setForm((prev) => ({ ...prev, image: url }));
    }
  };

  const handleField = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = () => {
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit?.(form);
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
        <div className="my-auto w-full max-w-2xl rounded-xl bg-white p-5 shadow-2xl">
          <h2 className="mb-4 text-lg font-bold">
            {isEditMode ? "Edit Member" : "Add Member"}
          </h2>

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
                {/* Name */}
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleField}
                    placeholder="Enter Full Name"
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400 ${
                      errors.name ? "border-red-400" : "border-black/15"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-0.5 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Designation */}
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="designation"
                    value={form.designation}
                    onChange={handleField}
                    className={`w-full rounded-lg border px-3 py-2 text-sm text-zinc-500 outline-none focus:border-indigo-400 ${
                      errors.designation ? "border-red-400" : "border-black/15"
                    }`}
                  >
                    <option value="">Select Designation</option>
                    <option>UI/UX Designer</option>
                    <option>Web Developer</option>
                    <option>Content Writer</option>
                    <option>Project Manager</option>
                    <option>Marketing Manager</option>
                  </select>
                  {errors.designation && (
                    <p className="mt-0.5 text-xs text-red-500">
                      {errors.designation}
                    </p>
                  )}
                  <div className="mt-1.5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddDesignation(true)}
                      className="rounded-lg border border-indigo-200 px-2.5 py-1 text-xs font-semibold text-indigo-600"
                    >
                      + Add Designation
                    </button>
                  </div>
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="mb-1 block text-xs font-medium">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleField}
                  className={`w-full rounded-lg border px-3 py-2 text-sm text-zinc-500 outline-none focus:border-indigo-400 ${
                    errors.department ? "border-red-400" : "border-black/15"
                  }`}
                >
                  <option value="">Select Department</option>
                  <option>Design</option>
                  <option>Development</option>
                  <option>Content</option>
                  <option>Management</option>
                  <option>Marketing</option>
                </select>
                {errors.department && (
                  <p className="mt-0.5 text-xs text-red-500">
                    {errors.department}
                  </p>
                )}
              </div>

              {/* Status + Gender */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleField}
                    className={`w-full rounded-lg border px-3 py-2 text-sm text-zinc-500 outline-none focus:border-indigo-400 ${
                      errors.status ? "border-red-400" : "border-black/15"
                    }`}
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                  {errors.status && (
                    <p className="mt-0.5 text-xs text-red-500">
                      {errors.status}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Gender</label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleField}
                    className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm text-zinc-500 outline-none focus:border-indigo-400"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-xs font-medium">Description</label>
                <textarea
                  rows={3}
                  name="description"
                  maxLength={160}
                  value={form.description}
                  onChange={handleField}
                  placeholder="Enter description about team member......."
                  className="w-full resize-none rounded-lg border border-black/15 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400"
                />
                <div className="mt-0.5 text-right text-xs text-zinc-400">
                  {form.description.length}/160
                </div>
              </div>
            </div>
          </div>

          {/* Social / contact fields */}
          <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-3">
            {(
              [
                { label: "Facebook", name: "facebook" },
                { label: "Twitter URL", name: "twitter" },
                { label: "Instagram URL", name: "instagram" },
                { label: "LinkedIn URL", name: "linkedin" },
                { label: "Domain", name: "domain" },
                { label: "Phone", name: "phone", required: true },
              ] as { label: string; name: keyof MemberFormData; required?: boolean }[]
            ).map(({ label, name, required }) => (
              <div key={label}>
                <label className="mb-1 block text-xs font-bold">
                  {label}
                  {required && <span className="text-red-500"> *</span>}
                </label>
                <input
                  type="text"
                  name={name}
                  value={(form[name] as string) ?? ""}
                  onChange={handleField}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-400 ${
                    name === "phone" && errors.phone
                      ? "border-red-400"
                      : "border-black/40"
                  }`}
                />
                {name === "phone" && errors.phone && (
                  <p className="mt-0.5 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>
            ))}
          </div>

          {/* Email field */}
          <div className="mt-3">
            <label className="mb-1 block text-xs font-bold">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleField}
              placeholder="Enter email address"
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-400 ${
                errors.email ? "border-red-400" : "border-black/40"
              }`}
            />
            {errors.email && (
              <p className="mt-0.5 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-black/15 px-4 py-2 text-sm font-medium text-zinc-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
            >
              {isEditMode ? "Save Changes" : "Add Member"}
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
