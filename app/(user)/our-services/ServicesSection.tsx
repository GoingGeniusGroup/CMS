"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Cloud,
  Code2,
  Globe,
  Layers,
  Megaphone,
  Pencil,
  Smartphone,
  Briefcase,
} from "lucide-react";
import { ServiceDetailModal } from "@/components/ServiceDetailModal";

// ─── Types ───────────────────────────────────────────────────────────────────

type ServiceData = {
  id: string;
  serviceName: string;
  description: string | null;
  category: string | null;
  thumbnailUrl: string | null;
  isFeatured: boolean;
};

// ─── Icon mapping ────────────────────────────────────────────────────────────

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  "web development": Globe,
  "mobile development": Smartphone,
  "mobile app development": Smartphone,
  "mobile apps": Smartphone,
  "ui/ux design": Pencil,
  "ui/ux": Pencil,
  design: Pencil,
  "digital marketing": Megaphone,
  marketing: Megaphone,
  "cloud solutions": Cloud,
  cloud: Cloud,
  "software development": Code2,
  development: Code2,
};

function getIconForService(category: string | null): React.ElementType {
  if (!category) return Briefcase;
  const key = category.toLowerCase().trim();
  return CATEGORY_ICON_MAP[key] || Briefcase;
}

// ─── Featured Services Strip ─────────────────────────────────────────────────

export function DigitalServicesStrip({ services }: { services: ServiceData[] }) {
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const featuredServices = services.filter((s) => s.isFeatured);

  if (featuredServices.length === 0) return null;

  return (
    <>
      <section className="bg-[#f8f9ff] px-4 py-20 sm:px-6 lg:px-16">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
              WHAT WE DO
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-zinc-900">
              Our <span className="text-indigo-600">Digital Services</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-500">
              We build digital products and services that help you grow, scale and
              succeed in the digital world.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {featuredServices.map((service) => {
              const Icon = getIconForService(service.category);
              return (
                <div
                  key={service.id}
                  className="group flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  {service.thumbnailUrl ? (
                    <div className="relative h-28 w-full overflow-hidden rounded-xl">
                      <Image
                        src={service.thumbnailUrl}
                        alt={service.serviceName}
                        fill
                        sizes="(max-width: 768px) 100vw, 20vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                      <Icon
                        className="h-6 w-6 text-indigo-500"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                  <h3 className="text-sm font-bold text-zinc-900">
                    {service.serviceName}
                  </h3>
                  <p className="text-xs leading-relaxed text-zinc-500 line-clamp-2">
                    {service.description || "Professional service tailored to your needs."}
                  </p>
                  <div className="mt-auto">
                    <button
                      type="button"
                      onClick={() => setSelectedService(service)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 text-zinc-400 transition-colors hover:border-indigo-400 hover:text-indigo-600"
                      aria-label={`View details about ${service.serviceName}`}
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
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

// ─── Services We Provide Grid ────────────────────────────────────────────────

export function ServicesWeProvide({ services }: { services: ServiceData[] }) {
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const regularServices = services.filter((s) => !s.isFeatured);

  return (
    <>
      <section
        id="services-we-provide"
        className="bg-white px-4 py-20 sm:px-6 lg:px-16"
      >
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
              SERVICES WE PROVIDE
            </p>
          </div>

          {/* 3-col grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regularServices.map((service) => {
              const Icon = getIconForService(service.category);
              return (
                <div
                  key={service.id}
                  className="group flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Thumbnail or Icon */}
                  {service.thumbnailUrl ? (
                    <div className="relative h-40 w-full overflow-hidden rounded-xl">
                      <Image
                        src={service.thumbnailUrl}
                        alt={service.serviceName}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                      <Icon
                        className="h-6 w-6 text-indigo-500"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                  <h3 className="text-base font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                    {service.serviceName}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-500 line-clamp-3">
                    {service.description || "Professional service tailored to your needs."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedService(service)}
                    className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:gap-2.5 transition-all"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {regularServices.length === 0 && (
            <div className="text-center py-12">
              <Layers className="mx-auto h-12 w-12 text-zinc-300" />
              <p className="mt-4 text-sm text-zinc-500">
                No services available at the moment. Check back soon!
              </p>
            </div>
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
