"use client";

import {
  X,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Send,
  Code2,
  Users,
} from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGlobe,
} from "react-icons/fa";

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
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  website?: string | null;
};

type TeamMemberModalProps = {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function TeamMemberModal({ member, isOpen, onClose }: TeamMemberModalProps) {
  if (!isOpen || !member) return null;

  const firstName = member.fullName.split(" ")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition shadow-sm border border-gray-200"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* ── Left Sidebar ─────────────────────────────── */}
          <div className="w-full md:w-80 shrink-0 bg-gradient-to-b from-indigo-50 via-white to-white p-8 flex flex-col items-center md:rounded-l-3xl">
            {/* Profile Image - Beautiful presentation */}
            <div className="relative mb-6">
              {/* Decorative ring */}
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 opacity-20 blur-sm" />
              <div className="relative w-52 h-52 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                {member.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.image}
                    alt={member.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200">
                    <span className="text-6xl font-extrabold text-indigo-400">
                      {member.fullName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              {/* Status dot */}
              <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-emerald-400 border-3 border-white shadow-sm" />
            </div>

            {/* Name & Role under image */}
            <h3 className="text-lg font-bold text-gray-900 text-center">{member.fullName}</h3>
            {member.role && (
              <p className="text-sm text-indigo-600 font-medium text-center">{member.role}</p>
            )}
            {member.department && (
              <span className="mt-2 inline-block rounded-full bg-indigo-100 px-3 py-1 text-[11px] font-semibold text-indigo-700">
                {member.department}
              </span>
            )}

            {/* Social / Web Links */}
            {(member.facebook || member.twitter || member.instagram || member.linkedin || member.website) && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {member.facebook && (
                  <a
                    href={member.facebook.startsWith('http') ? member.facebook : `https://${member.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:text-blue-600 hover:shadow-md hover:z-10"
                    title="Facebook"
                  >
                    <FaFacebookF size={14} />
                  </a>
                )}
                {member.twitter && (
                  <a
                    href={member.twitter.startsWith('http') ? member.twitter : `https://${member.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-300 hover:text-sky-500 hover:shadow-md hover:z-10"
                    title="Twitter / X"
                  >
                    <FaTwitter size={14} />
                  </a>
                )}
                {member.instagram && (
                  <a
                    href={member.instagram.startsWith('http') ? member.instagram : `https://${member.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-pink-300 hover:text-pink-500 hover:shadow-md hover:z-10"
                    title="Instagram"
                  >
                    <FaInstagram size={14} />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md hover:z-10"
                    title="LinkedIn"
                  >
                    <FaLinkedinIn size={14} />
                  </a>
                )}
                {member.website && (
                  <a
                    href={member.website.startsWith('http') ? member.website : `https://${member.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-violet-300 hover:text-violet-600 hover:shadow-md hover:z-10"
                    title="Website"
                  >
                    <FaGlobe size={14} />
                  </a>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="w-full h-px bg-gray-200 my-5" />

            {/* Info Items */}
            <div className="w-full space-y-4">
              {member.experience && (
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                    <Briefcase className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Experience</p>
                    <p className="text-sm font-semibold text-gray-800">{member.experience}</p>
                  </div>
                </div>
              )}

              {member.location && (
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Location</p>
                    <p className="text-sm font-semibold text-gray-800">{member.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Email</p>
                  <p className="text-sm font-semibold text-gray-800 break-all">{member.email}</p>
                </div>
              </div>

              {member.phone && (
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                    <Phone className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Phone</p>
                    <p className="text-sm font-semibold text-gray-800">{member.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Button */}
            <a
              href={`mailto:${member.email}`}
              className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:shadow-lg"
            >
              Contact {firstName} <Send className="h-4 w-4" />
            </a>
          </div>

          {/* ── Right Content ────────────────────────────── */}
          <div className="flex-1 p-6 md:p-8">
            {/* Header */}
            {member.role && (
              <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-indigo-600">
                {member.role}
              </span>
            )}
            <h2 className="mt-3 text-3xl font-extrabold text-gray-900">{member.fullName}</h2>
            {member.department && (
              <p className="mt-1 text-sm text-gray-500">
                {member.department} Department
              </p>
            )}

            {/* Bio */}
            {member.bio && (
              <div className="mt-5 rounded-xl bg-gray-50 p-4 border border-gray-100">
                <h4 className="text-sm font-bold text-gray-800 mb-2">About {firstName}</h4>
                <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">
                  {member.bio}
                </p>
              </div>
            )}

            {/* Quick Info Cards */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {member.experience && (
                <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <Briefcase className="h-5 w-5 text-indigo-500 mb-2" />
                  <p className="text-base font-bold text-gray-900">{member.experience}</p>
                  <p className="text-[11px] text-gray-500">Experience</p>
                </div>
              )}
              <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <Code2 className="h-5 w-5 text-indigo-500 mb-2" />
                <p className="text-base font-bold text-gray-900">{member.skills.length}</p>
                <p className="text-[11px] text-gray-500">Skills</p>
              </div>
              {member.department && (
                <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <Users className="h-5 w-5 text-indigo-500 mb-2" />
                  <p className="text-base font-bold text-gray-900">{member.department}</p>
                  <p className="text-[11px] text-gray-500">Team</p>
                </div>
              )}
            </div>

            {/* Skills */}
            {member.skills.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-bold text-gray-800 mb-3">Skills & Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 border border-indigo-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Details */}
            <div className="mt-6">
              <h4 className="text-sm font-bold text-gray-800 mb-3">Contact Information</h4>
              <div className="space-y-2">
                <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition">
                  <Mail className="h-4 w-4 text-indigo-500" /> {member.email}
                </a>
                {member.phone && (
                  <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition">
                    <Phone className="h-4 w-4 text-indigo-500" /> {member.phone}
                  </a>
                )}
                {member.website && (
                  <a
                    href={member.website.startsWith('http') ? member.website : `https://${member.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition"
                  >
                    <FaGlobe className="h-4 w-4 text-indigo-500" /> {member.website.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                )}
                {member.location && (
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-indigo-500" /> {member.location}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
