"use client";

import { X } from "lucide-react";
import Image from "next/image";

interface ServiceDetailModalProps {
  open: boolean;
  service: {
    serviceName: string;
    description: string | null;
    category: string | null;
    thumbnailUrl: string | null;
  } | null;
  onClose: () => void;
}

export function ServiceDetailModal({ open, service, onClose }: ServiceDetailModalProps) {
  if (!open || !service) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-0 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-zinc-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-zinc-900"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Thumbnail */}
        {service.thumbnailUrl && (
          <div className="relative h-56 w-full overflow-hidden rounded-t-2xl">
            <Image
              src={service.thumbnailUrl}
              alt={service.serviceName}
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Category badge */}
          {service.category && (
            <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              {service.category}
            </span>
          )}

          {/* Title */}
          <h2 className="mt-3 text-xl font-extrabold text-zinc-900 sm:text-2xl">
            {service.serviceName}
          </h2>

          {/* Description */}
          <p className="mt-4 text-sm leading-relaxed text-zinc-600 whitespace-pre-line">
            {service.description || "No additional details available for this service."}
          </p>

          {/* CTA */}
          <div className="mt-6">
            <a
              href="/home#contact"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
