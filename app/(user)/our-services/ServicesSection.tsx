"use client";

import Image from "next/image";
import {
  ArrowRight,
  Briefcase,
  Cloud,
  Code2,
  Globe,
  Layers,
  Megaphone,
  Pencil,
  Smartphone,
} from "lucide-react";

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

function getIcon(category: string | null): React.ElementType {
  if (!category) return Briefcase;
  return CATEGORY_ICON_MAP[category.toLowerCase().trim()] || Briefcase;
}

// ─── Flip Card (small — for DigitalServicesStrip) ────────────────────────────

function FlipCardSmall({ service }: { service: ServiceData }) {
  const Icon = getIcon(service.category);
  const desc =
    service.description || "Professional service tailored to your needs.";

  return (
    /*
     * [perspective] on the wrapper enables 3-D space.
     * The inner div rotates 180° on hover via CSS group-hover.
     * Front and back are stacked with backface-visibility:hidden.
     */
    <div className="group h-52 w-full [perspective:1000px]">
      <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

        {/* ── Front ── */}
        <div className="absolute inset-0 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm [backface-visibility:hidden]">
          {service.thumbnailUrl ? (
            <div className="relative h-20 w-full overflow-hidden rounded-xl">
              <Image
                src={service.thumbnailUrl}
                alt={service.serviceName}
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
              <Icon className="h-5 w-5 text-indigo-500" strokeWidth={1.5} />
            </div>
          )}
          <h3 className="text-sm font-bold text-zinc-900 line-clamp-1">
            {service.serviceName}
          </h3>
          <p className="text-xs text-zinc-400 line-clamp-2">{desc}</p>
          <div className="mt-auto">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 text-zinc-400">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

        {/* ── Back ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-indigo-600 p-6 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
            <Icon className="h-5 w-5 text-white" strokeWidth={1.5} />
          </div>
          <h3 className="text-sm font-bold text-white">{service.serviceName}</h3>
          <p className="text-xs leading-relaxed text-indigo-100 line-clamp-4">{desc}</p>
        </div>

      </div>
    </div>
  );
}

// ─── Flip Card (large — for ServicesWeProvide) ────────────────────────────────

function FlipCardLarge({ service }: { service: ServiceData }) {
  const Icon = getIcon(service.category);
  const desc =
    service.description || "Professional service tailored to your needs.";

  return (
    <div className="group h-72 w-full [perspective:1000px]">
      <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

        {/* ── Front ── */}
        <div className="absolute inset-0 flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm [backface-visibility:hidden]">
          {service.thumbnailUrl ? (
            <div className="relative h-28 w-full overflow-hidden rounded-xl">
              <Image
                src={service.thumbnailUrl}
                alt={service.serviceName}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
              <Icon className="h-6 w-6 text-indigo-500" strokeWidth={1.5} />
            </div>
          )}
          <h3 className="text-base font-bold text-zinc-900">
            {service.serviceName}
          </h3>
          <p className="text-sm leading-relaxed text-zinc-500 line-clamp-2">
            {desc}
          </p>
          <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
            Learn More
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>

        {/* ── Back ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-indigo-600 p-8 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
            <Icon className="h-7 w-7 text-white" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-bold text-white">{service.serviceName}</h3>
          <p className="text-sm leading-relaxed text-indigo-100 line-clamp-5">{desc}</p>
        </div>

      </div>
    </div>
  );
}

// ─── Featured Services Strip ─────────────────────────────────────────────────

export function DigitalServicesStrip({ services }: { services: ServiceData[] }) {
  const featuredServices = services.filter((s) => s.isFeatured);
  if (featuredServices.length === 0) return null;

  return (
    <section className="bg-[#f8f9ff] px-4 py-20 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {featuredServices.map((service) => (
            <FlipCardSmall key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Services We Provide Grid ────────────────────────────────────────────────

export function ServicesWeProvide({ services }: { services: ServiceData[] }) {
  const regularServices = services.filter((s) => !s.isFeatured);

  return (
    <section
      id="services-we-provide"
      className="bg-white px-4 py-20 sm:px-6 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
            SERVICES WE PROVIDE
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regularServices.map((service) => (
            <FlipCardLarge key={service.id} service={service} />
          ))}
        </div>

        {regularServices.length === 0 && (
          <div className="py-12 text-center">
            <Layers className="mx-auto h-12 w-12 text-zinc-300" />
            <p className="mt-4 text-sm text-zinc-500">
              No services available at the moment. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
