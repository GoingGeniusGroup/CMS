"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { getPublicServices } from "@/app/actions/services";
import { ServiceDetailModal } from "@/components/ServiceDetailModal";

type ServiceData = {
  id: string;
  serviceName: string;
  description: string | null;
  category: string | null;
  thumbnailUrl: string | null;
  isFeatured: boolean;
};

export function LandingServicesSection({ initialServices }: { initialServices?: ServiceData[] }) {
  const [services, setServices] = useState<ServiceData[]>(initialServices ?? []);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [flippedIds, setFlippedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!initialServices) {
      getPublicServices().then((data) => setServices(data));
    }
  }, []);

  const toggleFlip = (id: string) => {
    setFlippedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (services.length === 0) return null;

  return (
    <>
      <section id="services" className="bg-[#f6f4f3] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-600">
              Our Services
            </p>
            <h2 className="text-2xl font-extrabold text-zinc-900 sm:text-3xl">
              What We Do Best
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-500">
              End-to-end digital solutions to help your business grow and scale.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.slice(0, 4).map((service) => {
              const isFlipped = flippedIds.has(service.id);
              return (
                <div
                  key={service.id}
                  className="group perspective-[1000px] sm:h-[340px]"
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] sm:group-hover:[transform:rotateY(180deg)] ${
                      isFlipped ? "[transform:rotateY(180deg)]" : ""
                    }`}
                  >
                    {/* Front */}
                    <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col overflow-hidden">
                      {service.thumbnailUrl ? (
                        <div className="mb-4 aspect-square w-full overflow-hidden rounded-xl relative bg-zinc-50 border border-zinc-100">
                          <Image
                            src={service.thumbnailUrl}
                            alt={service.serviceName}
                            fill
                            sizes="(max-width: 768px) 100vw, 25vw"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="mb-4 flex aspect-square w-full items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100">
                          <span className="text-3xl font-extrabold text-indigo-300">
                            {service.serviceName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <h3 className="text-base font-bold text-zinc-900 text-center">
                        {service.serviceName}
                      </h3>
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
                      <p className="text-sm text-zinc-500 text-center line-clamp-3">
                        {service.description || "Professional service tailored to your needs."}
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

          <div className="mt-10 text-center">
            <Link
              href="/our-services"
              className="inline-flex items-center rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-indigo-400 hover:text-indigo-600"
            >
              View All Services
            </Link>
          </div>
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
