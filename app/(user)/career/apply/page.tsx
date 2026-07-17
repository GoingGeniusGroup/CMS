"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Upload,
  FileText,
  User,
  MapPin,
  Mail,
  Phone,
  CheckSquare,
  Code2,
  CheckCircle2,
} from "lucide-react";

/* ─── Page ───────────────────────────────────────────────── */
export default function ApplyPage() {
  const [experienceLevel, setExperienceLevel] = useState("");
  const [location, setLocation] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Apply For
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frontend Developer
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" /> Developer
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" /> Full-time
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> Remote
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* ── Left: Form ───────────────────────────────── */}
          <div>
            {/* Position Info */}
            <div className="mb-8 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Briefcase className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-gray-500">You are applying for:</p>
                  <p className="text-sm font-bold text-gray-900">Frontend Developer</p>
                </div>
              </div>
              <Link
                href="/career"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                ✏️ Change Position
              </Link>
            </div>

            {/* Personal Information */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <User className="h-4 w-4" />
                </span>
                <h2 className="text-base font-bold text-gray-900">Personal Information</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-8 text-sm text-gray-700 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    >
                      <option value="">Select your location</option>
                      <option value="kathmandu">Kathmandu, Nepal</option>
                      <option value="pokhara">Pokhara, Nepal</option>
                      <option value="remote">Remote</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Briefcase className="h-4 w-4" />
                </span>
                <h2 className="text-base font-bold text-gray-900">Professional Details</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Experience Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-700 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  >
                    <option value="">Select your experience</option>
                    <option value="fresher">Fresher</option>
                    <option value="junior">Junior (1-2 years)</option>
                    <option value="mid">Mid-level (3-5 years)</option>
                    <option value="senior">Senior (5+ years)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Total Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="write experience in years"
                    className="w-full rounded-lg border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Current Position
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your current position"
                    className="w-full rounded-lg border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Expected Salary (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your expected salary"
                    className="w-full rounded-lg border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <FileText className="h-4 w-4" />
                </span>
                <h2 className="text-base font-bold text-gray-900">Application Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Why do you want to join us? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us why you're a great fit for this role..."
                    className="w-full rounded-lg border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 resize-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Skills & Technologies <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Code2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. React, TypeScript, Next.js, Tailwind CSS"
                      className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Documents */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Upload className="h-4 w-4" />
                </span>
                <h2 className="text-base font-bold text-gray-900">Upload Documents</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Upload Resume <span className="text-red-500">*</span>
                      </p>
                      <p className="text-[11px] text-gray-500">PDF, DOC, DOCX (Max. 5MB)</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-indigo-600 px-4 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition"
                  >
                    Browse File
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Cover Letter (Optional)</p>
                      <p className="text-[11px] text-gray-500">PDF, DOC, DOCX (Max. 5MB)</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-indigo-600 px-4 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition"
                  >
                    Browse File
                  </button>
                </div>
              </div>
            </div>

            {/* Confirmation */}
            <div className="mb-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <span className="text-sm text-gray-600">
                  I confirm that the information provided is true and correct.
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Link
                href="/career"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Careers
              </Link>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Submit Application <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── Right: Sidebar ───────────────────────────── */}
          <div className="space-y-5">
            {/* Job Summary */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Briefcase className="h-3.5 w-3.5" />
                </span>
                <h3 className="text-sm font-bold text-gray-900">Job Summary</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Position</span>
                  <span className="font-semibold text-gray-900">Frontend Developer</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Department</span>
                  <span className="font-semibold text-gray-900">Development</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Employment Type</span>
                  <span className="font-semibold text-gray-900">Full-time</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Work Mode</span>
                  <span className="font-semibold text-gray-900">Remote</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Posted On</span>
                  <span className="font-semibold text-gray-900">May 25, 2024</span>
                </div>
              </div>
            </div>

            {/* What You'll Do */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <CheckSquare className="h-3.5 w-3.5" />
                </span>
                <h3 className="text-sm font-bold text-gray-900">What You&apos;ll Do</h3>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
                  <p className="text-xs leading-relaxed text-gray-600">
                    Build responsive and interactive user interfaces using modern frameworks.
                  </p>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
                  <p className="text-xs leading-relaxed text-gray-600">
                    Collaborate with designers and backend developers to bridge technology and design.
                  </p>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
                  <p className="text-xs leading-relaxed text-gray-600">
                    Optimize applications for maximum speed, scalability and cross-browser compatibility.
                  </p>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
                  <p className="text-xs leading-relaxed text-gray-600">
                    Write clean, reusable, and efficient code following industry best practices.
                  </p>
                </div>
              </div>
            </div>

            {/* Required Skills */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Code2 className="h-3.5 w-3.5" />
                </span>
                <h3 className="text-sm font-bold text-gray-900">Required Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "Next.js", "Tailwind CSS", "HTML", "CSS", "JavaScript", "Git"].map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Need Help */}
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Mail className="h-3.5 w-3.5" />
                </span>
                <h3 className="text-sm font-bold text-gray-900">Need Help?</h3>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                If you have any questions about this position or the application process.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <Mail className="h-3.5 w-3.5 text-indigo-500" />
                  goinggenius2021@gmail.com
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <Phone className="h-3.5 w-3.5 text-indigo-500" />
                  +977 980-1234567
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
