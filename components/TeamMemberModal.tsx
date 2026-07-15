"use client";

import { useState } from "react";
import {
  X,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Send,
  Users,
  Share2,
  Image as ImageIcon,
  Globe,
  Star,
  Code2,
  ClipboardList,
} from "lucide-react";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: string;
};

type TeamMemberModalProps = {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
};

const tabs = ["Overview", "Skills", "Projects", "Experience", "Education"];

const skills = [
  { name: "React.js", percent: 95 },
  { name: "JavaScript", percent: 95 },
  { name: "Next.js", percent: 90 },
  { name: "Tailwind CSS", percent: 90 },
  { name: "TypeScript", percent: 85 },
  { name: "UI/UX Principles", percent: 85 },
];

const stats = [
  { icon: ClipboardList, value: "20+", label: "Projects Completed" },
  { icon: Star, value: "4.9", label: "Client Rating" },
  { icon: Code2, value: "7+", label: "Technologies" },
  { icon: Users, value: "10+", label: "Team Members" },
];

export default function TeamMemberModal({ member, isOpen, onClose }: TeamMemberModalProps) {
  const [activeTab, setActiveTab] = useState("Overview");

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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Alex.png"
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Items */}
            <div className="w-full space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                  <Briefcase className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Experience</p>
                  <p className="text-sm font-semibold text-gray-800">6+ Years</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Location</p>
                  <p className="text-sm font-semibold text-gray-800">Kathmandu, Nepal</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Email</p>
                  <p className="text-sm font-semibold text-gray-800">john.doe@goinggenius.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Phone</p>
                  <p className="text-sm font-semibold text-gray-800">+977 9801234567</p>
                </div>
              </div>
            </div>

            {/* Contact Button */}
            <button className="mt-6 w-full flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
              Contact John <Send className="h-4 w-4" />
            </button>

            {/* Social Icons */}
            <div className="mt-4 flex items-center gap-3">
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-indigo-600 hover:text-indigo-600 transition">
                <Users className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-indigo-600 hover:text-indigo-600 transition">
                <Share2 className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-indigo-600 hover:text-indigo-600 transition">
                <ImageIcon className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-indigo-600 hover:text-indigo-600 transition">
                <Globe className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── Right Content ────────────────────────────── */}
          <div className="flex-1 p-6 md:p-8">
            {/* Header */}
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Senior Frontend Developer
            </p>
            <h2 className="mt-1 text-3xl font-extrabold text-gray-900">{member.name}</h2>
            <p className="mt-1 text-base italic text-gray-500">
              Building beautiful, fast and accessible web experiences.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              John is a passionate frontend developer with over 6 years of experience in building
              responsive and user-friendly web applications. He specializes in React, Next.js and
              modern JavaScript frameworks.
            </p>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center rounded-xl border border-gray-200 p-3"
                >
                  <stat.icon className="h-5 w-5 text-gray-400 mb-1" />
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  <p className="text-[11px] text-gray-500 text-center">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="mt-6 flex gap-6 border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-medium transition ${
                    activeTab === tab
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === "Overview" && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900">About John</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    John loves turning ideas into reality through clean code and intuitive design. He is
                    always eager to learn new technologies and solve challenging problems.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    When he&apos;s not coding, he enjoys exploring new places and photography.
                  </p>

                  {/* Core Skills */}
                  <h3 className="mt-8 text-lg font-bold text-gray-900">Core Skills</h3>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {skills.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                          <span className="text-sm font-bold text-indigo-600">{skill.percent}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-100">
                          <div
                            className="h-1.5 rounded-full bg-indigo-600"
                            style={{ width: `${skill.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Skills" && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Technical Skills</h3>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {skills.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                          <span className="text-sm font-bold text-indigo-600">{skill.percent}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-100">
                          <div
                            className="h-1.5 rounded-full bg-indigo-600"
                            style={{ width: `${skill.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Projects" && (
                <p className="text-sm text-gray-500">Projects information coming soon.</p>
              )}

              {activeTab === "Experience" && (
                <p className="text-sm text-gray-500">Experience details coming soon.</p>
              )}

              {activeTab === "Education" && (
                <p className="text-sm text-gray-500">Education details coming soon.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
