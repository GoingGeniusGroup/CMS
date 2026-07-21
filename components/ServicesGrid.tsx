"use client";

import { useState } from "react";
import { ArrowRight, ChevronRight, Globe } from "lucide-react";
import { ServiceDetailModal } from "@/components/ServiceDetailModal";

type ServiceData = {
  id: string;
  serviceName: string;
  description: string | null;
  category: string | null;
  thumbnailUrl: string | null;
  isFeatured: boolean;
};

export function ServicesGrid({ services }: { services: ServiceData[] }) {
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [flippedIds, setFlippedIds] = useState<Set<string>>(new Set());

  const toggleFlip = (id: string) => {
    setFlippedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <section id="services-we-provide" className="bg-white px-4 py-20 sm:px-6 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
              SERVICES WE PROVIDE
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = CATEGORY_ICONS[service.category || ""] || Globe;
              const isFlipped = flippedIds.has(service.id);
              return (
                <div
                  key={service.id}
                  className="group perspective-[1000px] sm:h-[360px]"
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] sm:group-hover:[transform:rotateY(180deg)] ${
                      isFlipped ? "[transform:rotateY(180deg)]" : ""
                    }`}
                  >
                    {/* Front */}
                    <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col overflow-hidden">
                      {service.thumbnailUrl ? (
                        <div className="mb-4 aspect-video w-full overflow-hidden rounded-xl relative bg-zinc-50 border border-zinc-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={service.thumbnailUrl}
                            alt={service.serviceName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="mb-4 flex aspect-video w-full items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100">
                          <Icon className="h-10 w-10 text-indigo-300" strokeWidth={1.5} />
                        </div>
                      )}
                      <h3 className="text-base font-bold text-zinc-900">
                        {service.serviceName}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-500 line-clamp-2">
                        {service.description || "Professional service tailored to your business needs."}
                      </p>
                      <div className="mt-auto flex pt-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFlip(service.id);
                          }}
                          className="sm:hidden flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-400 transition-colors hover:border-indigo-300 hover:text-indigo-500"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <span className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-400">
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center gap-4">
                      <h3 className="text-base font-bold text-zinc-900 text-center">
                        {service.serviceName}
                      </h3>
                      <p className="text-sm text-zinc-500 text-center line-clamp-4 px-2">
                        {service.description || "Professional service tailored to your business needs."}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedService(service);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                      >
                        Learn More
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {services.length === 0 && (
            <p className="text-center text-sm text-zinc-400 py-10">
              No services available yet. Check back soon!
            </p>
          )}
        </div>
      </section>

      <ServiceDetailModal
        open={!!selectedService}
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </>
  );
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Development: ({ className, strokeWidth }) => (
    <svg className={className} strokeWidth={strokeWidth} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  Design: ({ className, strokeWidth }) => (
    <svg className={className} strokeWidth={strokeWidth} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
  Marketing: ({ className, strokeWidth }) => (
    <svg className={className} strokeWidth={strokeWidth} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  ),
  Infrastructure: ({ className, strokeWidth }) => (
    <svg className={className} strokeWidth={strokeWidth} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  ),
  Mobile: ({ className, strokeWidth }) => (
    <svg className={className} strokeWidth={strokeWidth} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
};
