"use client";

import { useState } from "react";
import { X, Users, Mail, Phone, FileText, ExternalLink, Search } from "lucide-react";
import type { JobVacancyRow } from "./EditVacancyModal";
import { StatusBadge } from "@/components/StatusBadge";
import { useStatusOptions } from "@/components/ConfigProvider";

export type Applicant = {
  id: string;
  vacancyId: string;
  jobTitle: string;
  candidateName: string;
  email: string;
  phone: string;
  experienceYears: string;
  currentCompany?: string;
  portfolioUrl?: string;
  resumeName: string;
  status: string;
  appliedDate: string;
  coverNote?: string;
};

interface ViewApplicantsModalProps {
  vacancy: JobVacancyRow | null;
  applicants: Applicant[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (applicantId: string, newStatus: string) => void;
}

export function ViewApplicantsModal({
  vacancy,
  applicants,
  isOpen,
  onClose,
  onUpdateStatus,
}: ViewApplicantsModalProps) {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const statusOptions = useStatusOptions("applicant");

  if (!isOpen || !vacancy) return null;

  const vacancyApplicants = applicants.filter((a) => a.vacancyId === vacancy.id);

  const filteredApplicants = vacancyApplicants.filter((applicant) => {
    const matchesSearch =
      applicant.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      applicant.email.toLowerCase().includes(search.toLowerCase()) ||
      (applicant.currentCompany && applicant.currentCompany.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = selectedStatus === "All" || applicant.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Applicants for {vacancy.title}
              </h2>
              <p className="text-xs text-gray-500">
                {vacancyApplicants.length} candidate applications received for this vacancy
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-700 transition shadow-sm border border-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-gray-100 bg-white">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search candidate name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3.5 py-2 text-xs text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Filter Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-800 font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              {statusOptions.map((s) => (
                <option key={s.statusValue} value={s.statusValue}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Applicants List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredApplicants.length > 0 ? (
            filteredApplicants.map((applicant) => (
              <div
                key={applicant.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-indigo-200 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-sm">
                      {applicant.candidateName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900">{applicant.candidateName}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-0.5">
                        <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-gray-400" /> {applicant.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-gray-400" /> {applicant.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge moduleKey="applicant" value={applicant.status} />
                    <select
                      value={applicant.status}
                      onChange={(e) => onUpdateStatus(applicant.id, e.target.value)}
                      className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      {statusOptions.map((s) => (
                        <option key={s.statusValue} value={s.statusValue}>Mark {s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Candidate Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
                  <div>
                    <span className="font-semibold text-gray-400">Experience:</span> {applicant.experienceYears}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-400">Current Company:</span> {applicant.currentCompany || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-400">Applied On:</span> {applicant.appliedDate}
                  </div>
                </div>

                {/* Cover Note */}
                {applicant.coverNote && (
                  <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600 italic">
                    &quot;{applicant.coverNote}&quot;
                  </div>
                )}

                {/* Resume Attachment & Links */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                      <FileText className="h-3.5 w-3.5" /> {applicant.resumeName}
                    </span>
                    {applicant.portfolioUrl && (
                      <a
                        href={applicant.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-gray-600 hover:text-indigo-600"
                      >
                        Portfolio <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-400 flex flex-col items-center gap-2">
              <Users className="h-10 w-10 text-gray-300" />
              <p className="text-sm font-medium">No candidates match your search filter.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
