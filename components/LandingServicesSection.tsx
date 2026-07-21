"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
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

export function LandingServicesSection() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);

  useEffect(() => {
    getPublicServices().then((data) => setServices(data));
  }, []);

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
            {services.slice(0, 4).map((service, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={service.id}
                  className="group cursor-pointer rounded-2xl border border-zinc-200 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-200"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  {service.thumbnailUrl ? (
                    <div className="mx-auto mb-5 h-32 w-full overflow-hidden rounded-xl relative">
                      <Image
                        src={service.thumbnailUrl}
                        alt={service.serviceName}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="mx-auto mb-5 flex h-32 w-full items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100">
                      <span className="text-3xl font-extrabold text-indigo-300">
                        {service.serviceName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <h3 className="text-base font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                    {service.serviceName}
                  </h3>
                  <p
                    className={`mt-3 text-sm leading-relaxed text-zinc-500 transition-all duration-300 ${
                      isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    {service.description || "Professional service tailored to your needs."}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedService(service);
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      View Details
                    </button>
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 text-zinc-400 transition-all group-hover:border-indigo-300 group-hover:text-indigo-500 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View all link */}
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
