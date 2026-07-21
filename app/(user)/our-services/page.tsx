import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  BookOpen,
  Code2,
  Globe,
  Layers,
  Megaphone,
  Pencil,
  Search,
  Send,
  Cloud,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { getPublicServices } from "@/app/actions/services";

// ─── Icon map for service categories ─────────────────────────────────────────

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Development: Code2,
  Design: Pencil,
  Marketing: Megaphone,
  Infrastructure: Cloud,
  Mobile: Smartphone,
  default: Globe,
};

function getIcon(category?: string | null): LucideIcon {
  if (!category) return CATEGORY_ICONS.default;
  return CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
}

// ─── Static process steps ────────────────────────────────────────────────────

const PROCESS_STEPS = [
  { num: "01", icon: Search, label: "Discovery" },
  { num: "02", icon: BookOpen, label: "Planning" },
  { num: "03", icon: Pencil, label: "Design" },
  { num: "04", icon: Code2, label: "Development" },
  { num: "05", icon: CheckCircle, label: "Testing" },
  { num: "06", icon: Send, label: "Delivery" },
];

// ─── Section: Hero ───────────────────────────────────────────────────────────

function HeroSection({ serviceCount }: { serviceCount: number }) {
  const stats = [
    { icon: Layers, value: `${serviceCount}+`, label: "TOTAL SERVICES" },
    { icon: CheckCircle, value: "150+", label: "PROJECTS COMPLETED" },
    { icon: Layers, value: "80+", label: "HAPPY CLIENTS" },
    { icon: BookOpen, value: "6+", label: "YEARS EXPERIENCE" },
  ];

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              Digital Solutions
              <br />
              <span className="text-indigo-600">For Your Business</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-500">
              Transforming ideas into powerful digital solutions that inspire
              growth, innovation, and lasting business success.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#services-we-provide"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Explore Services
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/TechOffice.png"
              alt="Digital globe on monitor"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm"
            >
              <Icon className="h-7 w-7 text-indigo-500" strokeWidth={1.5} />
              <p className="text-3xl font-extrabold text-zinc-900">{value}</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Featured Services Strip ────────────────────────────────────────

type ServiceData = {
  id: string;
  serviceName: string;
  description: string | null;
  category: string | null;
  thumbnailUrl: string | null;
  isFeatured: boolean;
};

function FeaturedServicesStrip({ services }: { services: ServiceData[] }) {
  const featured = services.filter((s) => s.isFeatured);

  if (featured.length === 0) return null;

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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((svc) => {
            const Icon = getIcon(svc.category);
            return (
              <div key={svc.id} className="group h-64 w-full [perspective:1000px]">
                <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front */}
                  <div className="absolute inset-0 flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm [backface-visibility:hidden]">
                    {svc.thumbnailUrl ? (
                      <div className="relative h-20 w-full overflow-hidden rounded-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={svc.thumbnailUrl} alt={svc.serviceName} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                        <Icon className="h-6 w-6 text-indigo-500" strokeWidth={1.5} />
                      </div>
                    )}
                    <h3 className="text-sm font-bold text-zinc-900">{svc.serviceName}</h3>
                    <p className="text-xs leading-relaxed text-zinc-500 line-clamp-2">
                      {svc.description || "Professional service tailored to your needs."}
                    </p>
                    <div className="mt-auto">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 text-zinc-400">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-indigo-600 p-6 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                      <Icon className="h-6 w-6 text-white" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-sm font-bold text-white">{svc.serviceName}</h3>
                    <p className="text-xs leading-relaxed text-indigo-100 line-clamp-3">
                      {svc.description || "Professional service tailored to your needs."}
                    </p>
                    <div className="mt-auto pt-3">
                      <Link href="/servicedetail" className="rounded-full bg-white px-5 py-2 text-xs font-semibold text-indigo-600 transition-transform hover:scale-105">
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Section: All Services Grid ──────────────────────────────────────────────

function AllServicesGrid({ services }: { services: ServiceData[] }) {
  return (
    <section id="services-we-provide" className="bg-white px-4 py-20 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
            SERVICES WE PROVIDE
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((svc) => {
            const Icon = getIcon(svc.category);
            return (
              <div key={svc.id} className="group h-72 w-full [perspective:1000px]">
                <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front */}
                  <div className="absolute inset-0 flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm [backface-visibility:hidden]">
                    {svc.thumbnailUrl ? (
                      <div className="relative h-24 w-full overflow-hidden rounded-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={svc.thumbnailUrl}
                          alt={svc.serviceName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                        <Icon className="h-6 w-6 text-indigo-500" strokeWidth={1.5} />
                      </div>
                    )}
                    <h3 className="text-base font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                      {svc.serviceName}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-500 line-clamp-2">
                      {svc.description || "Professional service tailored to your business needs."}
                    </p>
                    <div className="mt-auto">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 text-zinc-400">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-indigo-600 p-8 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                      <Icon className="h-7 w-7 text-white" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-base font-bold text-white">{svc.serviceName}</h3>
                    <p className="text-sm leading-relaxed text-indigo-100 line-clamp-4">
                      {svc.description || "Professional service tailored to your business needs."}
                    </p>
                    <div className="mt-auto pt-4">
                      <Link href="/servicedetail" className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm transition-transform hover:scale-105">
                        Learn More
                      </Link>
                    </div>
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
  );
}

// ─── Section: Development Process ────────────────────────────────────────────

function DevelopmentProcess() {
  return (
    <section className="bg-[#f8f9ff] px-4 py-20 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-extrabold text-zinc-900 sm:text-3xl">
            Development Process
          </h2>
          <div className="mx-auto mt-3 h-0.5 w-24 rounded-full bg-zinc-300" />
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {PROCESS_STEPS.map(({ num, icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-indigo-200 bg-white shadow-sm">
                <Icon className="h-7 w-7 text-indigo-400" strokeWidth={1.5} />
              </div>
              <p className="text-[10px] font-bold text-zinc-400">{num}</p>
              <p className="text-xs font-semibold text-zinc-700">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: CTA ────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              <span className="text-amber-500">Ready to Start</span>
              <br />
              <span className="text-zinc-900">Your Project?</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-500">
              Let&apos;s build something amazing together. Get in touch with our
              team today.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
              >
                Get a Free Quote
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
            <Image
              src="/Rectangle.png"
              alt="Web development"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ServicesPublicPage() {
  const services = await getPublicServices();

  return (
    <>
      <HeroSection serviceCount={services.length} />
      <FeaturedServicesStrip services={services} />
      <AllServicesGrid services={services} />
      <DevelopmentProcess />
      <CTASection />
    </>
  );
}
