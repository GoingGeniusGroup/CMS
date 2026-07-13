"use client";
import { useState } from "react";
import Image from "next/image";

import Link from "next/link";
import {
  Briefcase,
  Users,
  Clock,
  UserCheck,
  Sparkles,
  Compass,
  Heart,
  TrendingUp,
  Scale,
  Gift,
  Plus,
  Minus,
  Mail,
  Phone,
  Send,
  ArrowRight,
} from "lucide-react";

/* ─── Data ───────────────────────────────────────────────── */
const stats = [
  { icon: Briefcase, value: "250+", label: "Projects Completed" },
  { icon: Users, value: "120+", label: "Happy Clients" },
  { icon: Clock, value: "8+", label: "Years of Experience" },
  { icon: UserCheck, value: "35+", label: "Team Members" },
];

const team = [
  { name: "Fatima Doe", role: "Founder & CEO" },
  { name: "John Doe", role: "Senior Developer" },
  { name: "John Doe", role: "Chief Marketer" },
  { name: "John Doe", role: "Key Manager" },
];

const cultureItems = [
  { icon: Sparkles, title: "Great Culture", desc: "Collaborative teammates who genuinely enjoy the work." },
  { icon: TrendingUp, title: "Learning & Growth", desc: "Ongoing mentorship and room to grow your craft." },
  { icon: Scale, title: "Work Life Balance", desc: "Flexible hours that respect your time." },
  { icon: Gift, title: "Competitive Benefits", desc: "Health, equity and perks that reward good work." },
];

const openPositions = [
  { icon: Compass, title: "Senior Full Stack Developer" },
  { icon: Sparkles, title: "UI/UX Designer" },
  { icon: TrendingUp, title: "Digital Marketing Specialist" },
];

const faqs = [
  { q: "What services does Going Genius provide?", a: "We design and build digital products end to end — from strategy and UX to full-stack engineering and ongoing support." },
  { q: "What is your development process?", a: "We work in short, transparent sprints: discovery, design, build, and review, with you looped in at every stage." },
  { q: "How long does a typical project take?", a: "Most projects run 6–12 weeks depending on scope, with clear milestones agreed upfront." },
  { q: "Do you provide post-launch support?", a: "Yes — every engagement includes a support window, and we offer ongoing retainers after that." },
  { q: "Do you work with startups only?", a: "No, we partner with startups and established companies alike, tailoring our process to team size." },
  { q: "How much does a project cost?", a: "Pricing depends on scope and timeline. Share your goals and we'll send a tailored estimate." },
];

/* ─── Logo mark ──────────────────────────────────────────── */
function GeniusMark() {
  return (
    <img src="/logo.png" alt="Going Genius Logo" className="h-100 w-100 rounded-full object-cover"/>
  );
}

/* ─── Brand icons (lucide-react dropped these) ──────────── */
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <span className={`flex items-center justify-center rounded-md bg-[#0A66C2] text-white ${className}`}>
      <svg viewBox="0 0 24 24" className="h-[65%] w-[65%]" fill="currentColor" aria-hidden>
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.55 4.78 5.86V21h-4v-5.6c0-1.34-.02-3.07-1.88-3.07-1.88 0-2.17 1.46-2.17 2.97V21h-4V9Z" />
      </svg>
    </span>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#1DA1F2" aria-hidden>
      <path d="M23 4.9c-.8.36-1.66.6-2.56.72a4.48 4.48 0 0 0 1.96-2.48c-.86.5-1.82.87-2.84 1.07a4.47 4.47 0 0 0-7.62 4.08A12.7 12.7 0 0 1 2.9 3.6a4.47 4.47 0 0 0 1.38 5.97c-.73-.02-1.42-.22-2.02-.56v.06a4.47 4.47 0 0 0 3.58 4.38c-.34.1-.7.14-1.07.14-.26 0-.51-.02-.76-.07a4.48 4.48 0 0 0 4.17 3.1A8.97 8.97 0 0 1 1 18.58a12.66 12.66 0 0 0 6.86 2c8.23 0 12.73-6.82 12.73-12.74 0-.19 0-.39-.02-.58A9.1 9.1 0 0 0 23 4.9Z" />
    </svg>
  );
}

/* ─── Section heading ────────────────────────────────────── */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-widest text-[#5457E5]">{children}</p>;
}

function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h2>
      </div>
      {action && (
        <a href="#" className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-[#5457E5] hover:text-[#4143c9] sm:flex">
          {action} <ArrowRight className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

/* ─── FAQ item ───────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((o) => !o)}
      className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-[#5457E5]/30"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-gray-800">{q}</span>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5457E5]/10 text-[#5457E5]">
          {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </span>
      </div>
      {open && <p className="mt-3 text-sm leading-relaxed text-gray-500">{a}</p>}
    </button>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              Innovating the Future with{" "}
              <span className="text-[#5457E5]">Going Genius</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-gray-500">
              We are a team of passionate innovators, designers, and developers building digital
              solutions that help businesses grow, scale, and succeed in an ever-changing world.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/work" className="rounded-full bg-[#5457E5] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4143c9]">
                Explore Our Work →
              </Link>
              <Link href="/about" className="rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#5457E5]/50">
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
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5457E5]/10 text-[#5457E5]">
                    <Compass className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Our Mission</p>
                    <p className="text-xs text-gray-500">To empower businesses with creative, right-sized digital solutions that grow with them.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5457E5]/10 text-[#5457E5]">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Our Vision</p>
                    <p className="text-xs text-gray-500">To be a studio people know and trust for turning bold ideas into working products.</p>
                  </div>
                </div>
              </div>

              <button className="mt-7 rounded-full bg-[#5457E5] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-[#4143c9]">
                More About Our Story →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col justify-center rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#5457E5]/10 text-[#5457E5]">
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

      {/* ── Team ─────────────────────────────────────────── */}
      <section className="border-t border-gray-100">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Our Team" title="Meet The Geniuses" action="View All Team" />
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {team.map((member, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">
                <div className="relative mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full bg-[#5457E5]/10">
                  <Image src="/bgpic.png" alt={member.name} fill sizes="80px" className="object-cover" />
                </div>
                <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-500">{member.role}</p>
                <div className="mt-3 flex justify-center items-center gap-2">
                  <LinkedinIcon className="h-5 w-5" />
                  <TwitterIcon className="h-4 w-4" />
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Careers ──────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50/60">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Eyebrow>Careers</Eyebrow>
          <div className="mt-2 grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Join Our Team</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500">
                We're always looking for talented and motivated individuals to pursue an
                extraordinary journey. Be a part of a team that values creativity, growth and
                respect.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
                {cultureItems.map((item) => (
                  <div key={item.title} className="flex gap-2.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5457E5]/10 text-[#5457E5]">
                      <item.icon className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{item.title}</p>
                      <p className="text-[11px] leading-snug text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-7 rounded-full bg-[#5457E5] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-[#4143c9]">
                View All Openings →
              </button>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-gray-900">Open Positions</p>
              <div className="mt-4 flex flex-col gap-3">
                {openPositions.map((pos) => (
                  <div key={pos.title} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5457E5]/10 text-[#5457E5]">
                        <pos.icon className="h-4 w-4" />
                      </span>
                      <p className="text-xs font-semibold text-gray-800">{pos.title}</p>
                    </div>
                    <button className="shrink-0 rounded-full border border-[#5457E5]/30 px-3 py-1.5 text-[11px] font-semibold text-[#5457E5] hover:bg-[#5457E5]/10">
                      Apply Now →
                    </button>
                  </div>
                ))}
              </div>
              <a href="#" className="mt-4 block text-center text-xs font-semibold text-[#5457E5] hover:text-[#4143c9]">
                View All Openings →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="border-t border-gray-100">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="FAQ" title="Frequently Asked Questions" action="View All FAQs" />
          <div className="grid gap-4 sm:grid-cols-2">
            {faqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ──────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50/60">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 rounded-3xl bg-white p-8 shadow-md sm:p-10 md:grid-cols-[280px_1fr_auto] md:gap-12">
            <div className="relative h-52 w-full overflow-hidden rounded-2xl md:h-48">
              <Image src="/rect.png" alt="Contact us" fill className="object-cover" />
            </div>

            <div>
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#5457E5] text-white shadow-sm">
                  <Send className="h-7 w-7" />
                </span>
                <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                  Have Questions?
                  <br />
                  Let's Work Together.
                </h2>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
                We'd love to hear about your project and explore how we can help you achieve your
                goals.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 md:items-end">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Mail className="h-4 w-4 text-[#5457E5]" /> goingenius2021@gmail.com
              </span>
              <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Phone className="h-4 w-4 text-[#5457E5]" /> 9845632107
              </span>
              <Link href="/contact" className="mt-1 flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#5457E5] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4143c9]">
                Go to Contact Page <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}