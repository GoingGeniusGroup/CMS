"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import { getJobById, type JobRow } from "@/app/actions/jobs";
import { getPublicContactSettings } from "@/app/actions/contact-settings";
import { submitJobApplication } from "@/app/actions/job-applications";
import { useModuleDisabled } from "@/components/content/PublicModuleVisibilityProvider";
import { ModuleDisabledPage } from "@/components/content/ModuleDisabledPage";

/* ─── Loading skeleton ───────────────────────────────────── */
function Skeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="mt-3 h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="mt-3 flex gap-4">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

/* ─── Not found ──────────────────────────────────────────── */
function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Briefcase className="h-12 w-12 text-gray-300" />
      <p className="text-lg font-semibold text-gray-700">Job not found</p>
      <Link href="/career" className="text-sm text-indigo-600 hover:underline">
        &larr; Back to Careers
      </Link>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function ApplyPage() {
  const moduleHidden = useModuleDisabled("job");
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [job, setJob] = useState<JobRow | null | undefined>(undefined);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [location, setLocation] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [totalExperience, setTotalExperience] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [skills, setSkills] = useState("");

  useEffect(() => {
    if (!jobId) return;
    getJobById(jobId).then(setJob);
    getPublicContactSettings().then((data) => {
      if (data?.email1) setContactEmail(data.email1);
      if (data?.phone1) setContactPhone(data.phone1);
    });
  }, [jobId]);

  if (moduleHidden) return <ModuleDisabledPage moduleLabel="Careers" />;
  if (!jobId) return <NotFound />;
  if (job === undefined) return <Skeleton />;
  if (job === null) return <NotFound />;

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-5">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Application Submitted!</h1>
          <p className="mt-3 text-sm text-gray-500">
            Thank you for applying for <span className="font-semibold">{job.title}</span>. We&apos;ll review your application and get back to you soon.
          </p>
          <Link href="/career" className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
            <ArrowLeft className="h-4 w-4" /> Back to Careers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {submitError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Apply For
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {job.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" /> {job.department}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" /> {job.type}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {job.mode}
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
                  <p className="text-sm font-bold text-gray-900">{job.title}</p>
                </div>
              </div>
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
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
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
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter your location"
                      className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    />
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
                    value={totalExperience}
                    onChange={(e) => setTotalExperience(e.target.value)}
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
                    value={currentPosition}
                    onChange={(e) => setCurrentPosition(e.target.value)}
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
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
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
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
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
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
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
                disabled={!confirmed || isSubmitting}
                onClick={async () => {
                  if (!confirmed || !jobId) return;
                  setSubmitError(null);
                  setIsSubmitting(true);
                  const result = await submitJobApplication({
                    jobId,
                    fullName,
                    email,
                    phone,
                    location,
                    experienceLevel,
                    totalExperience,
                    currentPosition,
                    expectedSalary,
                    coverLetter,
                    skills,
                  });
                  setIsSubmitting(false);
                  if (result.success) {
                    setSubmitted(true);
                  } else {
                    setSubmitError(result.error || "Failed to submit");
                  }
                }}
                className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"} <ArrowRight className="h-4 w-4" />
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
                  <span className="font-semibold text-gray-900">{job.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Department</span>
                  <span className="font-semibold text-gray-900">{job.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Employment Type</span>
                  <span className="font-semibold text-gray-900">{job.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Work Mode</span>
                  <span className="font-semibold text-gray-900">{job.mode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Posted On</span>
                  <span className="font-semibold text-gray-900">{job.createdAt}</span>
                </div>
                {job.location && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Location</span>
                    <span className="font-semibold text-gray-900">{job.location}</span>
                  </div>
                )}
                {job.salaryRange && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Salary</span>
                    <span className="font-semibold text-gray-900">{job.salaryRange}</span>
                  </div>
                )}
                {job.experience && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Experience</span>
                    <span className="font-semibold text-gray-900">{job.experience}</span>
                  </div>
                )}
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
                {job.responsibilities.length > 0
                  ? job.responsibilities.map((r, i) => (
                      <div key={i} className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
                        <p className="text-xs leading-relaxed text-gray-600">{r}</p>
                      </div>
                    ))
                  : (
                      <div className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
                        <p className="text-xs leading-relaxed text-gray-600">
                          Build responsive and interactive user interfaces using modern frameworks.
                        </p>
                      </div>
                    )}
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
                {job.tags.length > 0
                  ? job.tags.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700"
                      >
                        {skill}
                      </span>
                    ))
                  : (
                      <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700">
                        React
                      </span>
                    )}
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
                  {contactEmail || "goinggenius2021@gmail.com"}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <Phone className="h-3.5 w-3.5 text-indigo-500" />
                  {contactPhone || "+977 980-1234567"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
