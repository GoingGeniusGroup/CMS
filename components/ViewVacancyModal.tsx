"use client";

import { X, Briefcase, MapPin, Clock, DollarSign, Calendar, Sparkles, CheckCircle2, Users, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { JobVacancyRow } from "./EditVacancyModal";

interface ViewVacancyModalProps {
  vacancy: JobVacancyRow | null;
  isOpen: boolean;
  onClose: () => void;
  onViewApplicants?: (vacancyId: string) => void;
}

export function ViewVacancyModal({ vacancy, isOpen, onClose, onViewApplicants }: ViewVacancyModalProps) {
  if (!isOpen || !vacancy) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active (Published)</span>;
      case "Draft":
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Draft</span>;
      case "Closed":
        return <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800">Closed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon / Banner */}
        <div className="relative bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 p-6 sm:p-8 text-white rounded-t-3xl overflow-hidden">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-md bg-indigo-500/30 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-200 border border-indigo-400/30">
              {vacancy.department}
            </span>
            {vacancy.isFeatured && (
              <span className="flex items-center gap-1 rounded-md bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-300 border border-amber-400/30">
                <Sparkles className="h-3.5 w-3.5" /> Featured
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{vacancy.title}</h1>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-indigo-200 font-medium">
            <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-indigo-400" />{vacancy.type}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-indigo-400" />{vacancy.mode} ({vacancy.location})</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-indigo-400" />Exp: {vacancy.experience}</span>
            <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4 text-indigo-400" />{vacancy.salaryRange}</span>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 rounded-2xl bg-gray-50 p-4 border border-gray-100">
            <div>
              <span className="text-[11px] font-semibold uppercase text-gray-400">Status</span>
              <div className="mt-1">{getStatusBadge(vacancy.isActive ? "Active" : "Closed")}</div>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-gray-400">Applicants</span>
              <p className="mt-1 text-lg font-bold text-gray-900 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-indigo-600" /> {vacancy.applicantsCount}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-gray-400">Vacancies</span>
              <p className="mt-1 text-lg font-bold text-gray-900">{vacancy.vacanciesCount} Positions</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-gray-400">Deadline</span>
              <p className="mt-1 text-sm font-semibold text-gray-900 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-gray-500" /> {vacancy.deadline}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-2">Job Summary</h3>
            <p className="text-sm leading-relaxed text-gray-600 bg-white">{vacancy.description}</p>
          </div>

          {/* Responsibilities */}
          {vacancy.responsibilities && vacancy.responsibilities.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">Key Responsibilities</h3>
              <ul className="space-y-2">
                {vacancy.responsibilities.map((resp: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {vacancy.requirements && vacancy.requirements.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">Requirements & Skills</h3>
              <ul className="space-y-2">
                {vacancy.requirements.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack / Tags */}
          {vacancy.tags && vacancy.tags.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Required Tech Stack / Skills</h3>
              <div className="flex flex-wrap gap-2">
                {vacancy.tags.map((tag: string) => (
                  <span key={tag} className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-gray-100">
            <Link
              href="/career"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View on User Career Page <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <div className="flex items-center gap-3">
              {onViewApplicants && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewApplicants(vacancy.id);
                  }}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition flex items-center gap-2"
                >
                  <Users className="h-4 w-4" /> View Applicants ({vacancy.applicantsCount})
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
