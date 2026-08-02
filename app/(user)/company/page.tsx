"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

import Link from "next/link";
import {
  Briefcase,
  Users,
  Clock,
  UserCheck,
  Sparkles,
  Compass,
  TrendingUp,
  Scale,
  Gift,
  Mail,
  Phone,
  Send,
  ArrowRight,
} from "lucide-react";
import { LandingTeamSection } from "@/components/LandingTeamSection";
import { FaqSection } from "@/components/FaqSection";
import { getPublicJobs, type JobRow } from "@/app/actions/jobs";

/* ─── Data ───────────────────────────────────────────────── */
const stats = [
  { icon: Briefcase, value: "250+", label: "Projects Completed" },
  { icon: Users, value: "120+", label: "Happy Clients" },
  { icon: Clock, value: "8+", label: "Years of Experience" },
  { icon: UserCheck, value: "35+", label: "Team Members" },
];

const cultureItems = [
  { icon: Sparkles, title: "Great Culture", desc: "Collaborative teammates who genuinely enjoy the work." },
  { icon: TrendingUp, title: "Learning & Growth", desc: "Ongoing mentorship and room to grow your craft." },
  { icon: Scale, title: "Work Life Balance", desc: "Flexible hours that respect your time." },
  { icon: Gift, title: "Competitive Benefits", desc: "Health, equity and perks that reward good work." },
];

/* ─── Logo mark ──────────────────────────────────────────── */
function GeniusMark() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo.png" alt="Going Genius Logo" className="h-100 w-100 rounded-full object-cover"/>
  );
}

/* ─── Section heading ────────────────────────────────────── */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">{children}</p>;
}

/* ─── Page ───────────────────────────────────────────────── */
export default function CompanyPage() {
  const [jobs, setJobs] = useState<JobRow[]>([]);

  useEffect(() => {
    getPublicJobs().then((data) => setJobs(data.slice(0, 3)));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              Innovating the Future with{" "}
              <span className="text-indigo-600">Going Genius</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-gray-500">
              We are a team of passionate innovators, designers, and developers building digital
              solutions that help businesses grow, scale, and succeed in an ever-changing world.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/our-projects" className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                Explore Our Work →
              </Link>
              <Link href="/about" className="rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-indigo-600/50">
                Learn More About Us
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <GeniusMark />
          </div>
        </div>
      </section>

      {/* ── About ────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50/60">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Eyebrow>About Us</Eyebrow>
          <div className="mt-6 grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
                Building digital solutions that make a difference.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-500">
                For over a decade, Going Genius has been a trusted partner for innovative
                experiences that solve real problems, delight users, and stay one step ahead of a
                constantly changing world.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <Compass className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Our Mission</p>
                    <p className="text-xs text-gray-500">To empower businesses with creative, right-sized digital solutions that grow with them.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Our Vision</p>
                    <p className="text-xs text-gray-500">To be a studio people know and trust for turning bold ideas into working products.</p>
                  </div>
                </div>
              </div>
              <Link href="/blogs">
              <button className="mt-7 rounded-full bg-indigo-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-indigo-700">
                More About Our Story →
              </button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col justify-center rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <s.icon className="h-4.5 w-4.5" />
                  </span>
                  <p className="text-xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LandingTeamSection />

      {/* ── Careers ──────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50/60">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Eyebrow>Careers</Eyebrow>
          <div className="mt-2 grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Join Our Team</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500">
                We&apos;re always looking for talented and motivated individuals to pursue an
                extraordinary journey. Be a part of a team that values creativity, growth and
                respect.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
                {cultureItems.map((item) => (
                  <div key={item.title} className="flex gap-2.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                      <item.icon className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{item.title}</p>
                      <p className="text-[11px] leading-snug text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-7 rounded-full bg-indigo-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-indigo-700">
                View All Openings →
              </button>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-gray-900">Open Positions</p>
              <div className="mt-4 flex flex-col gap-3">
                {jobs.length > 0 ? jobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                        <Briefcase className="h-4 w-4" />
                      </span>
                      <p className="text-xs font-semibold text-gray-800">{job.title}</p>
                    </div>
                    <Link
                      href={`/career/apply?jobId=${job.id}`}
                      className="shrink-0 rounded-full border border-indigo-600/30 px-3 py-1.5 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-100"
                    >
                      Apply Now →
                    </Link>
                  </div>
                )) : (
                  <p className="text-xs text-gray-400 text-center py-4">No open positions right now.</p>
                )}
              </div>
              <Link href="/career" className="mt-4 block text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                View All Openings →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <FaqSection />

      {/* ── Contact CTA ──────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50/60">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 rounded-3xl bg-white p-8 shadow-md sm:p-10 md:grid-cols-[280px_1fr_auto] md:gap-12">
            <div className="relative h-52 w-full overflow-hidden rounded-2xl md:h-48">
              <Image src="/rect.png" alt="Contact us" fill sizes="100vw" className="object-cover" />
            </div>

            <div>
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
                  <Send className="h-7 w-7" />
                </span>
                <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                  Have Questions?
                  <br />
                  Let&apos;s Work Together.
                </h2>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
                We&apos;d love to hear about your project and explore how we can help you achieve your
                goals.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 md:items-end">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Mail className="h-4 w-4 text-indigo-600" /> goingenius2021@gmail.com
              </span>
              <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Phone className="h-4 w-4 text-indigo-600" /> 9845632107
              </span>
              <Link href="/contact" className="mt-1 flex items-center gap-1.5 whitespace-nowrap rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                Go to Contact Page <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}