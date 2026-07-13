import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  BookOpen,
  Code2,
  Layers,
  Pencil,
  Search,
  Send,
} from "lucide-react";
import { getPublicServices } from "@/app/actions/services";
import { DigitalServicesStrip, ServicesWeProvide } from "./ServicesSection";

// ─── Static Data ─────────────────────────────────────────────────────────────

const PROCESS_STEPS = [
  { num: "01", icon: Search, label: "Discovery" },
  { num: "02", icon: BookOpen, label: "Planning" },
  { num: "03", icon: Pencil, label: "Design" },
  { num: "04", icon: Code2, label: "Development" },
  { num: "05", icon: CheckCircle, label: "Testing" },
  { num: "06", icon: Send, label: "Delivery" },
];

// ─── Section: Hero ───────────────────────────────────────────────────────────

function HeroSection({ totalServices }: { totalServices: number }) {
  const HERO_STATS = [
    { icon: Layers, value: `${totalServices}+`, label: "TOTAL SERVICES" },
    { icon: CheckCircle, value: "150+", label: "PROJECTS COMPLETED" },
    { icon: Layers, value: "80+", label: "HAPPY CLIENTS" },
    { icon: BookOpen, value: "6+", label: "YEARS EXPERIENCE" },
  ];

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left */}
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
                href="/home#contact"
                className="inline-flex items-center rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right */}
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
          {HERO_STATS.map(({ icon: Icon, value, label }) => (
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

// ─── Section: CTA ─────────────────────────────────────────────────────────────

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
              <a
                href="/home#contact"
                className="inline-flex items-center rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-bold text-zinc-900 transition-colors hover:bg-amber-500"
              >
                Get a Free Quote
              </a>
              <Link
                href="/home#contact"
                className="inline-flex items-center rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
            <Image
              src="/Rectangle.png"
              alt="Web development hologram"
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
      <HeroSection totalServices={services.length} />
      <DigitalServicesStrip services={services} />
      <ServicesWeProvide services={services} />
      <DevelopmentProcess />
      <CTASection />
    </>
  );
}
