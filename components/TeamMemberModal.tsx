"use client";

import {
  X,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Send,
  Code2,
  Star,
  Users,
  ClipboardList,
} from "lucide-react";

type TeamMember = {
  id: string;
  fullName: string;
  role: string | null;
  department: string | null;
  image: string | null;
  bio: string | null;
  location: string | null;
  experience: string | null;
  skills: string[];
  email: string;
  phone: string | null;
};

type TeamMemberModalProps = {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function TeamMemberModal({ member, isOpen, onClose }: TeamMemberModalProps) {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* ── Left Sidebar ─────────────────────────────── */}
          <div className="w-full md:w-72 shrink-0 border-b md:border-b-0 md:border-r border-gray-100 p-6 flex flex-col items-center">
            {/* Profile Image */}
            <div className="w-48 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 mb-6">
              {member.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.image}
                  alt={member.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-5xl font-extrabold text-indigo-200">
                    {member.fullName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Info Items */}
            <div className="w-full space-y-4">
              {member.experience && (
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                    <Briefcase className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Experience</p>
                    <p className="text-sm font-semibold text-gray-800">{member.experience}</p>
                  </div>
                </div>
              )}

              {member.location && (
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Location</p>
                    <p className="text-sm font-semibold text-gray-800">{member.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Email</p>
                  <p className="text-sm font-semibold text-gray-800 break-all">{member.email}</p>
                </div>
              </div>

              {member.phone && (
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                    <Phone className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Phone</p>
                    <p className="text-sm font-semibold text-gray-800">{member.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Button */}
            <a
              href={`mailto:${member.email}`}
              className="mt-6 w-full flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Contact {member.fullName.split(" ")[0]} <Send className="h-4 w-4" />
            </a>
          </div>

          {/* ── Right Content ────────────────────────────── */}
          <div className="flex-1 p-6 md:p-8">
            {/* Header */}
            {member.role && (
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                {member.role}
              </p>
            )}
            <h2 className="mt-1 text-3xl font-extrabold text-gray-900">{member.fullName}</h2>
            {member.department && (
              <p className="mt-1 text-base italic text-gray-500">
                {member.department} Team
              </p>
            )}

            {/* Bio */}
            {member.bio && (
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                {member.bio}
              </p>
            )}

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex flex-col items-center rounded-xl border border-gray-200 p-3">
                <ClipboardList className="h-5 w-5 text-gray-400 mb-1" />
                <p className="text-lg font-bold text-gray-900">{member.skills.length}</p>
                <p className="text-[11px] text-gray-500 text-center">Skills</p>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-gray-200 p-3">
                <Star className="h-5 w-5 text-gray-400 mb-1" />
                <p className="text-lg font-bold text-gray-900">4.9</p>
                <p className="text-[11px] text-gray-500 text-center">Rating</p>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-gray-200 p-3">
                <Code2 className="h-5 w-5 text-gray-400 mb-1" />
                <p className="text-lg font-bold text-gray-900">{member.experience || "N/A"}</p>
                <p className="text-[11px] text-gray-500 text-center">Experience</p>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-gray-200 p-3">
                <Users className="h-5 w-5 text-gray-400 mb-1" />
                <p className="text-lg font-bold text-gray-900">{member.department || "—"}</p>
                <p className="text-[11px] text-gray-500 text-center">Department</p>
              </div>
            </div>

            {/* Skills */}
            {member.skills.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900">Core Skills</h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {member.skills.map((skill, i) => {
                    // Generate a pseudo skill percentage based on position
                    const percent = Math.max(70, 95 - i * 5);
                    return (
                      <div key={skill}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{skill}</span>
                          <span className="text-sm font-bold text-indigo-600">{percent}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-100">
                          <div
                            className="h-1.5 rounded-full bg-indigo-600"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
