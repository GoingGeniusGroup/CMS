"use client";

import { useState, useEffect, useRef } from "react";
import { AddDesignationModal } from "@/components/AddDesignationModal";
import { AddDepartmentModal } from "@/components/AddDepartmentModal";
import { ImageUploader } from "@/components/ImageUploader";
import { CustomFieldRenderer, type CustomValues } from "@/components/CustomFieldRenderer";
import { useStatusOptions } from "@/components/ConfigProvider";
import { getDepartments, createDepartment } from "@/app/actions/team";

export interface MemberFormData {
  name: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  status: string;
  gender: "male" | "female";
  image: string | null;
  description: string;
  location: string;
  experience: string;
  skills: string[];
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  website: string;
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
      location: editMember.location ?? "",
      experience: editMember.experience ?? "",
      skills: editMember.skills ?? [],
      facebook: editMember.facebook ?? "",
      twitter: editMember.twitter ?? "",
      instagram: editMember.instagram ?? "",
      linkedin: editMember.linkedin ?? "",
      website: editMember.website ?? "",
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
    location: "",
    experience: "",
    skills: [],
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    website: "",
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
  onSubmit?: (data: MemberFormData, customValues?: CustomValues) => void;
  editMember?: MemberRecord | null;
}) {
  const isEditMode = Boolean(editMember);
  const statusOptions = useStatusOptions("team");
  const statusDefault = statusOptions.find((s) => s.isDefault)?.statusValue ?? statusOptions[0]?.statusValue ?? "Active";

  // State is initialised once per mount (controlled via `key` from parent).
  const [showAddDesignation, setShowAddDesignation] = useState(false);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [form, setForm] = useState<MemberFormData>(() => buildInitialForm(editMember));
  const [errors, setErrors] = useState<FormErrors>({});
  // Custom designations added via the "+ Add Designation" button this session
  const [customDesignations, setCustomDesignations] = useState<string[]>([]);
  // Departments — loaded from DB, persisted via createDepartment
  const [departments, setDepartments] = useState<string[]>([]);

  // Ref guard prevents React StrictMode's double effect invocation in dev
  // from firing getDepartments twice per mount.
  const deptsLoaded = useRef(false);
  useEffect(() => {
    if (deptsLoaded.current) return;
    deptsLoaded.current = true;
    getDepartments().then((rows) => setDepartments(rows.map((d) => d.name)));
  }, []);

  const handleAddDepartment = async (name: string) => {
    const result = await createDepartment(name);
    if (result.success) {
      setDepartments((prev) => (prev.includes(name) ? prev : [...prev, name]));
      setForm((prev) => ({ ...prev, department: name }));
      if (errors.department) setErrors((prev) => ({ ...prev, department: undefined }));
    } else {
      alert(result.error || "Failed to add department");
    }
  };

  const handleAddDesignation = (title: string) => {
    setCustomDesignations((prev) =>
      prev.includes(title) ? prev : [...prev, title]
    );
    // Auto-select the new designation
    setForm((prev) => ({ ...prev, designation: title }));
    if (errors.designation) setErrors((prev) => ({ ...prev, designation: undefined }));
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
    onSubmit?.(form, customValues);
  };

  const [customValues, setCustomValues] = useState<CustomValues>({});

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="relative flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl max-h-[95vh]">
          <div className="shrink-0 border-b border-gray-200 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-bold text-zinc-900">
              {isEditMode ? "Edit Member" : "Add Member"}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-4 md:flex-row">
              {/* Upload photo via Uploadcare */}
              <div className="w-full md:w-60 self-start">
                <ImageUploader
                  label="Member Photo"
                  value={form.image}
                  onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
                />
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
                      <option>Full Stack Developer</option>
                      <option>QA Tester</option>
                      <option>UI/UX Designer</option>
                      {customDesignations.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
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
                    {departments.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="mt-0.5 text-xs text-red-500">
                      {errors.department}
                    </p>
                  )}
                  <div className="mt-1.5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddDepartment(true)}
                      className="rounded-lg border border-indigo-200 px-2.5 py-1 text-xs font-semibold text-indigo-600"
                    >
                      + Add Department
                    </button>
                  </div>
                </div>

                {/* Status + Gender */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      value={form.status || statusDefault}
                      onChange={handleField}
                      className={`w-full rounded-lg border px-3 py-2 text-sm text-zinc-500 outline-none focus:border-indigo-400 ${
                        errors.status ? "border-red-400" : "border-black/15"
                      }`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s.statusValue} value={s.statusValue}>{s.label}</option>
                      ))}
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
                  <label className="mb-1 block text-xs font-medium">Bio / Description</label>
                  <textarea
                    rows={3}
                    name="description"
                    maxLength={500}
                    value={form.description}
                    onChange={handleField}
                    placeholder="Enter description about team member......."
                    className="w-full resize-none rounded-lg border border-black/15 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400"
                  />
                  <div className="mt-0.5 text-right text-xs text-zinc-400">
                    {form.description.length}/500
                  </div>
                </div>

                {/* Location + Experience */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleField}
                      placeholder="e.g. Kathmandu, Nepal"
                      className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium">Experience</label>
                    <input
                      type="text"
                      name="experience"
                      value={form.experience}
                      onChange={handleField}
                      placeholder="e.g. 5+ Years"
                      className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="mb-1 block text-xs font-medium">Skills</label>
                  {form.skills.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {form.skills.map((skill, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                          {skill}
                          <button type="button" onClick={() => setForm(prev => ({ ...prev, skills: prev.skills.filter((_, idx) => idx !== i) }))} className="text-indigo-400 hover:text-indigo-700">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Type a skill and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (val && !form.skills.includes(val)) {
                          setForm(prev => ({ ...prev, skills: [...prev.skills, val] }));
                          (e.target as HTMLInputElement).value = "";
                        }
                      }
                    }}
                    className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400"
                  />
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
                  { label: "Website URL", name: "website" },
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

            {/* Custom Fields */}
            <CustomFieldRenderer
              moduleKey="team"
              recordId={editMember?.id}
              onValuesChange={setCustomValues}
            />
          </div>

          {/* Actions - always visible */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-200 px-5 py-4 sm:px-6">
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
        onAdd={handleAddDesignation}
      />

      <AddDepartmentModal
        open={showAddDepartment}
        onClose={() => setShowAddDepartment(false)}
        onAdd={handleAddDepartment}
      />
    </>
  );
}
