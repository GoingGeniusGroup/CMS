"use client";

import { X } from "lucide-react";

type DetailField = {
  label: string;
  value: string | number | boolean | null | undefined;
};

interface ViewDetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: DetailField[];
  imageUrl?: string | null;
}

export function ViewDetailModal({ open, onClose, title, fields, imageUrl }: ViewDetailModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 pr-8">{title}</h2>

        {imageUrl && (
          <div className="mt-4 overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={title} className="h-48 w-full object-cover" />
          </div>
        )}

        <div className="mt-5 divide-y divide-gray-100">
          {fields.map((field) => {
            if (field.value === null || field.value === undefined || field.value === "") return null;
            return (
              <div key={field.label} className="flex flex-col gap-0.5 py-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  {field.label}
                </span>
                <span className="text-sm text-gray-800 whitespace-pre-line">
                  {typeof field.value === "boolean" ? (field.value ? "Yes" : "No") : String(field.value)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
