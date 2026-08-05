"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ExternalLink,
  PlayCircle,
  Shield,
  Zap,
  Users,
  Server,
  Check,
  Download,
  SmilePlus,
  TrendingUp,
  Building2,
  Calendar,
  Clock,
  User,
  Briefcase,
  Edit3,
  Search,
  Home,
  Palette,
  Code2,
  TestTube,
  Rocket,
} from "lucide-react";
import { images } from "@/lib/images";
import { useModuleDisabled } from "@/components/content/PublicModuleVisibilityProvider";
import { ModuleDisabledPage } from "@/components/content/ModuleDisabledPage";

// ─── Static Data (replace with dynamic data later) ───────────────────────────

const PROJECT = {
  category: "MOBILE APP DEVELOPMENT",
  title: "Secure. Simple.\nSmart.\nMobile Banking App",
  highlight: "Banking App",
  description:
    "A next-generation mobile banking solution designed to make banking effortless, secure and accessible anytime, anywhere.",
  liveUrl: "#",
  heroImage: images.container3,
};

const FEATURES = [
  { icon: Shield, title: "Secure", description: "Bank-level security with 2FA & encryption" },
  { icon: Zap, title: "Fast", description: "Instant transactions and real-time alerts" },
  { icon: Users, title: "User-Friendly", description: "Clean interface for seamless experience" },
  { icon: Server, title: "Reliable", description: "99.99% uptime with robust infrastructure" },
];

const HIGHLIGHTS = [
  "Modern and intuitive UI/UX design",
  "Secure authentication with biometrics & 2FA",
  "Real-time balance updates and notifications",
  "Seamless fund transfer and bill payments",
  "Card management and transaction history",
  "Multi-language and dark mode support",
];

const TABS = [
  "Overview",
  "Features",
  "Process",
  "Technologies",
  "Results",
  "Gallery",
  "Related Projects",
  "Testimonial",
];

const PROJECT_SUMMARY = {
  client: "abc",
  industry: "Banking & Finance",
  duration: "5 Months",
  teamSize: "8 Members",
  completionDate: "April 2024",
  services: "UI/UX Design, Mobile App Development, Backend Development, QA Testing",
};

const KEY_CHALLENGES = [
  "Ensuring top-notch security for user data",
  "Real-time balance updates and notifications",
  "Seamless fund transfers and bill payments",
  "Support for multiple banks and cards",
  "Scalability for future growth",
];

const SOLUTION_POINTS = [
  "Secure login with biometrics & 2FA",
  "Real-time transaction processing",
  "Intuitive UI for all user types",
  "Multi-bank support",
  "Instant notifications & alerts",
  "Scalable and future-ready architecture",
];

const PROCESS_STEPS = [
  { icon: Search, step: "01", title: "Discovery", description: "We analyze requirements and business goals." },
  { icon: Home, step: "02", title: "Planning", description: "We create a detailed plan and define the roadmap." },
  { icon: Palette, step: "03", title: "UI/UX Design", description: "We design intuitive and user-friendly interfaces." },
  { icon: Code2, step: "04", title: "Development", description: "We build scalable, secure and high-performance apps." },
  { icon: TestTube, step: "05", title: "Testing", description: "We test thoroughly to ensure quality and security." },
  { icon: Rocket, step: "06", title: "Deployment", description: "We deploy and provide ongoing support." },
];

const RESULTS = [
  { icon: Download, value: "120K+", label: "DOWNLOADS" },
  { icon: SmilePlus, value: "95%", label: "CUSTOMER SATISFACTION" },
  { icon: TrendingUp, value: "60%", label: "INCREASE IN DIGITAL TRANSACTIONS" },
  { icon: Building2, value: "40%", label: "REDUCTION IN BRANCH VISITS" },
];

const GALLERY_IMAGES = [
  images.container3,
  images.container1,
  images.container2,
  images.projectHero,
];

const RELATED_PROJECTS = [
  {
    title: "E-Commerce Platform",
    category: "WEB DEVELOPMENT",
    description: "A complete e-commerce solution with admin dashboard.",
    image: images.component49,
  },
  {
    title: "E-Commerce Platform",
    category: "MOBILE APP",
    description: "A complete e-commerce solution with admin dashboard.",
    image: images.component49,
  },
  {
    title: "E-Commerce Platform",
    category: "WEB APPLICATION",
    description: "A complete e-commerce solution with admin dashboard.",
    image: images.component49,
  },
];

// ─── Hero Section ────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left */}
          <div>
            <span className="inline-block rounded-full bg-indigo-600 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
              {PROJECT.category}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-zinc-900 sm:text-5xl lg:text-[3.5rem]">
              Secure. Simple.
              <br />
              Smart.
              <br />
              Mobile <span className="text-indigo-600">Banking App</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-500">
              {PROJECT.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={PROJECT.liveUrl}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Visit Live App
                <ExternalLink className="h-4 w-4" />
              </a>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400"
              >
                See How We Work
                <PlayCircle className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={PROJECT.heroImage}
              alt={PROJECT.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Project Overview ────────────────────────────────────────────────────────

function ProjectOverview() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          {/* Left Content */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              PROJECT OVERVIEW
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600">
              The Mobile Banking App is a secure and feature-rich mobile application that allows
              users to manage their finances seamlessly. It offers a wide range of banking
              features including fund transfers, bill payments, account management, card
              management, and more – all in one place.
            </p>

            {/* Feature Cards */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex flex-col items-center rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-center"
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                    <Icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900">{title}</h4>
                  <p className="mt-1 text-[11px] text-zinc-500">{description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Project Highlights */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900">Project Highlights</h3>
            <ul className="mt-4 space-y-3">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                  <span className="text-sm text-zinc-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Tabs Navigation ─────────────────────────────────────────────────────────

function TabsNavigation({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  return (
    <div className="border-b border-zinc-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav className="flex gap-6 overflow-x-auto" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

// ─── Challenge Section ───────────────────────────────────────────────────────

function ChallengeSection() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-indigo-600" />
              <h2 className="text-2xl font-extrabold italic text-zinc-900">The Challenge</h2>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_1.2fr]">
              <p className="text-sm leading-relaxed text-zinc-600">
                Our client needed a secure, reliable, and easy-to-use
                mobile banking solution that could handle thousands of
                transactions securely while providing a seamless user
                experience.
              </p>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
                <h4 className="mb-3 text-sm font-bold text-zinc-900">Key Challenges</h4>
                <ul className="space-y-2.5">
                  {KEY_CHALLENGES.map((challenge) => (
                    <li key={challenge} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                      <span className="text-sm text-zinc-600">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right - Project Summary */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900">Project Summary</h3>
            <div className="mt-5 space-y-5">
              <SummaryItem icon={User} label="CLIENT" value={PROJECT_SUMMARY.client} />
              <SummaryItem icon={Briefcase} label="INDUSTRY" value={PROJECT_SUMMARY.industry} />
              <SummaryItem icon={Clock} label="DURATION" value={PROJECT_SUMMARY.duration} />
              <SummaryItem icon={Users} label="TEAM SIZE" value={PROJECT_SUMMARY.teamSize} />
              <SummaryItem icon={Calendar} label="COMPLETION DATE" value={PROJECT_SUMMARY.completionDate} />
              <SummaryItem icon={Edit3} label="SERVICES" value={PROJECT_SUMMARY.services} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
        <Icon className="h-4 w-4 text-indigo-600" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{label}</p>
        <p className="text-sm font-semibold text-zinc-900">{value}</p>
      </div>
    </div>
  );
}

// ─── Our Solution Section ────────────────────────────────────────────────────

function SolutionSection() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-indigo-600" />
              <h2 className="text-2xl font-extrabold italic text-zinc-900">Our Solution</h2>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600">
              We built a modern and scalable mobile banking app with advanced security, real-time processing, and a beautifully designed
              user interface.
            </p>

            {/* Solution points grid */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SOLUTION_POINTS.map((point) => (
                <div key={point} className="flex items-center gap-2.5">
                  <Edit3 className="h-4 w-4 shrink-0 text-indigo-600" />
                  <span className="text-sm text-zinc-700">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - CTA Card */}
          <div className="flex items-start justify-end">
            <div className="rounded-2xl bg-[#2d2d3f] p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600">
                <Rocket className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-lg font-bold text-white">
                Have a similar project in mi...
              </h4>
              <p className="mt-2 text-sm text-zinc-400">
                Let&apos;s build something amazing toget...
              </p>
              <a
                href="#"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Start Your Project →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── See How We Work (Process) ───────────────────────────────────────────────

function ProcessSection() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <div className="h-6 w-1 rounded-full bg-indigo-600" />
          <h2 className="text-2xl font-extrabold italic text-zinc-900">See How We Work</h2>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {PROCESS_STEPS.map(({ icon: Icon, step, title, description }) => (
            <div key={step} className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm">
                <Icon className="h-6 w-6 text-indigo-600" />
              </div>
              <p className="text-[10px] font-bold text-zinc-400">{step}</p>
              <h4 className="mt-1 text-sm font-bold text-zinc-900">{title}</h4>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Results Section ─────────────────────────────────────────────────────────

function ResultsSection() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <div className="h-6 w-1 rounded-full bg-indigo-600" />
          <h2 className="text-2xl font-extrabold italic text-zinc-900">The Results</h2>
        </div>

        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1fr_2fr]">
          <p className="text-sm leading-relaxed text-zinc-600">
            The app has transformed the way customers bank, reducing branch visits and improving customer
            satisfaction significantly.
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {RESULTS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-5 text-center shadow-sm"
              >
                <Icon className="mb-2 h-6 w-6 text-indigo-600" />
                <p className="text-2xl font-extrabold text-indigo-600">{value}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Gallery Section ─────────────────────────────────────────────────────────

function GallerySection() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <div className="h-6 w-1 rounded-full bg-indigo-600" />
          <h2 className="text-2xl font-extrabold italic text-zinc-900">Project Gallery</h2>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {GALLERY_IMAGES.map((img, idx) => (
            <div key={idx} className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-100">
              <Image
                src={img}
                alt={`Gallery ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-indigo-600 px-6 py-2.5 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
          >
            View Full Gallery
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Related Projects Section ────────────────────────────────────────────────

function RelatedProjectsSection() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 rounded-full bg-indigo-600" />
            <h2 className="text-2xl font-extrabold text-zinc-900">Related Projects</h2>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline"
          >
            View All Projects →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RELATED_PROJECTS.map((project, idx) => (
            <div key={idx} className="group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  {project.category}
                </p>
                <h3 className="mt-1 text-base font-bold text-zinc-900">{project.title}</h3>
                <p className="mt-1 text-sm text-zinc-500">{project.description}</p>
                <Link
                  href="#"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:gap-2.5 transition-all"
                >
                  View Case Study
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function ProjectDetailsPage() {
  const moduleHidden = useModuleDisabled("project");
  const [activeTab, setActiveTab] = useState("Overview");

  if (moduleHidden) return <ModuleDisabledPage moduleLabel="Projects" />;

  return (
    <div className="bg-white">
      <HeroSection />
      <ProjectOverview />
      <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <ChallengeSection />
      <SolutionSection />
      <ProcessSection />
      <ResultsSection />
      <GallerySection />
      <RelatedProjectsSection />
    </div>
  );
}
