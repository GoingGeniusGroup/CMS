"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Smartphone,
  Zap,
  Search,
  ShieldCheck,
  RefreshCw,
  Puzzle,
  Code2,
  Palette,
  Cloud,
  Megaphone,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
} from "lucide-react";

/* ─── Data ───────────────────────────────────────────────── */
const heroChecks = ["Custom Solutions", "Modern Technologies", "Scalable & Secure", "SEO Friendly"];

const missionStats = [
  { value: "250+", label: "Projects Completed" },
  { value: "180+", label: "Happy Clients" },
  { value: "25+", label: "Expert Developers" },
  { value: "98%", label: "Client Satisfaction" },
];

const features = [
  { icon: Smartphone, title: "Responsive Design", desc: "Perfectly responsive websites that look great on all devices, from desktop to mobile." },
  { icon: Zap, title: "High Performance", desc: "Optimized for speed and performance to ensure the best user experience and engagement." },
  { icon: Search, title: "SEO Friendly", desc: "Clean code and best SEO practices to help your website rank higher on search engines." },
  { icon: ShieldCheck, title: "Secure & Reliable", desc: "We follow best security practices to keep your website and user data safe and secure." },
  { icon: RefreshCw, title: "Scalable Solutions", desc: "Our solutions grow with your business and adapt to your future technology needs." },
  { icon: Puzzle, title: "Custom Development", desc: "Tailored solutions built specifically for your unique business requirements." },
];

const processSteps = [
  { num: "01", label: "Discovery", desc: "Understanding your requirements" },
  { num: "02", label: "Planning", desc: "Strategy and project planning" },
  { num: "03", label: "Design", desc: "UI/UX design and prototyping" },
  { num: "04", label: "Development", desc: "Building with clean code" },
  { num: "05", label: "Testing", desc: "Quality assurance and testing" },
  { num: "06", label: "Deployment", desc: "Launching and ongoing support" },
];

const services = [
  { icon: Code2, title: "Web Development", desc: "Modern, responsive, and scalable websites built with the latest technologies to ensure peak performance and SEO visibility." },
  { icon: Smartphone, title: "Mobile App Development", desc: "High-performance native and cross-platform mobile apps for iOS and Android that provide seamless user experiences." },
  { icon: Palette, title: "UI/UX Design", desc: "User-centric designs that are visually stunning and intuitive, ensuring high engagement and conversion rates for your brand." },
  { icon: Code2, title: "Software Development", desc: "Custom enterprise software solutions built to solve unique business challenges and streamline complex workflows." },
  { icon: Megaphone, title: "Digital Marketing", desc: "Data-driven growth strategies including SEO, PPC, and Content Marketing to amplify your brand's digital presence." },
  { icon: Cloud, title: "Cloud Solutions", desc: "Secure, scalable, and resilient cloud architecture and migration services using AWS, Azure, and Google Cloud." },
];

/* ─── Hero ───────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <span className="inline-block rounded-md bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-600">
            Web Development
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
            Web Development
            <br />
            <span className="text-indigo-600">Solutions</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500">
            We build fast, secure, and scalable websites that help your business grow. Our expert
            team leverages modern tech to deliver high-end digital experiences.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
              Get a Free Consultation
            </Link>
            <Link href="/our-projects" className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-indigo-600 transition hover:border-indigo-300">
              View Our Work
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 sm:flex sm:flex-wrap sm:gap-5">
            {heroChecks.map((c) => (
              <span key={c} className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                <Check className="h-3.5 w-3.5 text-indigo-600" /> {c}
              </span>
            ))}
          </div>
        </div>

        <div className="relative h-64 w-full overflow-hidden rounded-lg border border-gray-200 sm:h-80">
          <Image src="/webdev.png" alt="Web development team" fill className="object-cover" />
        </div>
      </div>
    </section>
  );
}

/* ─── Mission / stats ────────────────────────────────────── */
function Mission() {
  return (
    <section className="border-t border-gray-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative h-72 w-full sm:h-96">
            <Image src="/mission.png" alt="Designer at work" fill className="object-contain" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Overview</p>
            <h2 className="mt-2 text-3xl font-extrabold leading-snug text-gray-900">
              Delivering High-Performance Web Solutions
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              At Going Genius, we create responsive, user-friendly, and high-performance websites
              tailored to your business needs. From simple business websites to complex web
              applications, we ensure the perfect blend of design, functionality, and performance.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {missionStats.map((s) => (
                <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <p className="text-2xl font-extrabold text-indigo-600">{s.value}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase leading-tight tracking-wide text-gray-400">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Features ───────────────────────────────────────────── */
function Features() {
  return (
    <section className="border-t border-gray-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-indigo-600">
          Key Features
        </p>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Excellence in Every Detail
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-gray-200 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-gray-900">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Process ─────────────────────────────────────────────── */
function Process() {
  return (
    <section className="border-t border-gray-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-indigo-600">
          Our Development Process
        </p>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          How We Bring Your Ideas To Life
        </h2>

        <div className="relative mt-16">
          <div className="absolute left-[8%] right-[8%] top-6 hidden border-t-2 border-dashed border-gray-200 sm:block" />
          <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {processSteps.map((step, i) => {
              const isLast = i === processSteps.length - 1;
              return (
                <div key={step.num} className="relative flex flex-col items-center text-center">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${
                      isLast ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-indigo-50 text-indigo-600"
                    }`}
                  >
                    {step.num}
                  </span>
                  <p className="mt-3 text-sm font-bold text-gray-900">{step.label}</p>
                  <p className="mt-1 max-w-[110px] text-[11px] leading-snug text-gray-400">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Services ───────────────────────────────────────────── */
function Services() {
  const [page, setPage] = useState(1);

  return (
    <section className="border-t border-gray-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Our Services</h2>
            <p className="mt-1 text-sm text-gray-400">Our Services</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Services..."
                className="w-56 rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-600 outline-none focus:border-indigo-300"
              />
            </div>
            <button className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:border-indigo-300">
              All Categories
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="rounded-xl border border-gray-200 p-6 transition hover:shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-gray-900">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{s.desc}</p>
              <a href="#" className="mt-4 flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                Learn More <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-1.5">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition ${
                page === p ? "bg-indigo-600 text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}
          <span className="px-1 text-sm text-gray-400">...</span>
          <button
            onClick={() => setPage(6)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition ${
              page === 6 ? "bg-indigo-600 text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            6
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA banner ─────────────────────────────────────────── */
function CtaBanner() {
  return (
    <section className="border-t border-gray-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-xl border border-gray-200 px-6 py-8 sm:px-10">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Lightbulb className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                Ready to build your dream website?
              </h2>
              <p className="mt-1.5 max-w-md text-sm text-gray-500">
                Let's discuss your project and bring your ideas to life with our expert team.
              </p>
            </div>
          </div>
          <Link href="/contact" className="flex shrink-0 items-center gap-1.5 rounded-lg bg-gray-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-gray-900">
            Get a Free Consultation <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function ServiceDetailPage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Mission />
      <Features />
      <Process />
      <Services />
      <CtaBanner />
    </div>
  );
}