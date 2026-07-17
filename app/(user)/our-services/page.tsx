import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Cloud,
  Code2,
  CheckCircle,
  BookOpen,
  Globe,
  Layers,
  Megaphone,
  Pencil,
  Search,
  Smartphone,
  Send,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const HERO_STATS = [
  { icon: Layers,       value: "12+",  label: "TOTAL SERVICES"      },
  { icon: CheckCircle,  value: "150+", label: "PROJECTS COMPLETED"  },
  { icon: Layers,       value: "80+",  label: "HAPPY CLIENTS"       },
  { icon: BookOpen,     value: "6+",   label: "YEARS EXPERIENCE"    },
];

const DIGITAL_SERVICES = [
  { icon: Globe,      title: "Web Development",    desc: "Modern, responsive and scalable websites."                     },
  { icon: Smartphone, title: "Mobile Development", desc: "High performance mobile apps for iOS & Android."              },
  { icon: Pencil,     title: "UI/UX Design",       desc: "Beautiful & intuitive user experiences."                      },
  { icon: Megaphone,  title: "Digital Marketing",  desc: "Data-driven marketing strategies that work."                  },
  { icon: Cloud,      title: "Cloud Solutions",    desc: "Secure & scalable cloud services."                            },
];

const SERVICES_WE_PROVIDE = [
  {
    icon: Code2,
    title: "Web Development",
    desc: "Modern, responsive, and scalable websites built with the latest technologies to ensure peak performance and SEO visibility.",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    desc: "High-performance native and cross-platform mobile apps for iOS and Android that provide seamless user experiences.",
  },
  {
    icon: Pencil,
    title: "UI/UX Design",
    desc: "User-centric designs that are visually stunning and intuitive, ensuring high engagement and conversion rates for your brand.",
  },
  {
    icon: Layers,
    title: "Software Development",
    desc: "Custom enterprise software solutions built to solve unique business challenges and streamline complex workflows.",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    desc: "Data-driven growth strategies including SEO, PPC, and Content Marketing to amplify your brand's digital presence.",
  },
  {
    icon: Cloud,
    title: "Cloud Solutions",
    desc: "Secure, scalable, and resilient cloud architecture and migration services using AWS, Azure, and Google Cloud.",
  },
];

const PROCESS_STEPS = [
  { num: "01", icon: Search,       label: "Discovery"    },
  { num: "02", icon: BookOpen,     label: "Planning"     },
  { num: "03", icon: Pencil,       label: "Design"       },
  { num: "04", icon: Code2,        label: "Development"  },
  { num: "05", icon: CheckCircle,  label: "Testing"      },
  { num: "06", icon: Send,         label: "Delivery"     },
];

// ─── Section: Hero ───────────────────────────────────────────────────────────

function HeroSection() {
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

          {/* Right — Rectangle.png (globe on monitor) */}
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

// ─── Section: Our Digital Services (5-col strip) ─────────────────────────────

function DigitalServicesStrip() {
  return (
    <section className="bg-[#f8f9ff] px-4 py-20 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
            WHAT WE DO
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-zinc-900">
            Our{" "}
            <span className="text-indigo-600">Digital Services</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-500">
            We build digital products and services that help you grow, scale and
            succeed in the digital world.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {DIGITAL_SERVICES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                <Icon className="h-6 w-6 text-indigo-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-bold text-zinc-900">{title}</h3>
              <p className="text-xs leading-relaxed text-zinc-500">{desc}</p>
              <div className="mt-auto">
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Services We Provide (3-col grid) ───────────────────────────────

function ServicesWeProvide() {
  return (
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
          {SERVICES_WE_PROVIDE.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              {/* Icon box */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                <Icon className="h-6 w-6 text-indigo-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500">{desc}</p>
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
          {/* Decorative underline */}
          <div className="mx-auto mt-3 h-0.5 w-24 rounded-full bg-zinc-300" />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {PROCESS_STEPS.map(({ num, icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-indigo-200 bg-white shadow-sm">
                <Icon className="h-7 w-7 text-indigo-400" strokeWidth={1.5} />
              </div>
              <p className="text-[10px] font-bold text-zinc-400">{num}</p>
              <p className="text-xs font-semibold text-zinc-700">{label}</p>
              {/* Connector bar — hidden on last */}
              <div className="hidden lg:block absolute" />
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
          {/* Left */}
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

          {/* Right — TechOffice.png (web development hand/hologram) */}
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

export default function ServicesPublicPage() {
  return (
    <>
      <HeroSection />
      <DigitalServicesStrip />
      <ServicesWeProvide />
      <DevelopmentProcess />
      <CTASection />
    </>
  );
}
