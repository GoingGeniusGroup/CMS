import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Megaphone,
  PenTool,
  Search,
  ShieldCheck,
  Smartphone,
  Star,
  TrendingUp,
  Users,
  Zap,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Globe,
  ChevronRight,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const services = [
  {
    icon: Code2,
    title: "Web Development",
    description:
      "Custom, high-performance websites and web applications built with modern technologies.",
    color: "bg-orange-50 text-[#e8821a]",
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description:
      "Native and cross-platform mobile applications for iOS and Android that users love.",
    color: "bg-yellow-50 text-[#f0b90b]",
  },
  {
    icon: PenTool,
    title: "UI/UX Design",
    description:
      "Beautiful, intuitive interfaces designed to convert visitors into loyal customers.",
    color: "bg-sky-50 text-sky-500",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description:
      "Data-driven campaigns across all channels to grow your brand and reach.",
    color: "bg-emerald-50 text-emerald-500",
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description:
      "Rank higher on search engines and drive qualified organic traffic to your business.",
    color: "bg-purple-50 text-purple-500",
  },
  {
    icon: ShieldCheck,
    title: "IT Consulting",
    description:
      "Strategic technology guidance to help your business scale securely and efficiently.",
    color: "bg-rose-50 text-rose-500",
  },
];

const stats = [
  { value: "350+", label: "Happy Clients" },
  { value: "75+", label: "Active Projects" },
  { value: "12+", label: "Years Experience" },
  { value: "98%", label: "Client Satisfaction" },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechStart",
    text: "Going Genius transformed our digital presence completely. Their team delivered beyond our expectations — on time and on budget.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Founder, GrowthLab",
    text: "The best agency we've worked with. Professional, creative, and genuinely invested in our success.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Marketing Director, NovaCorp",
    text: "Our organic traffic tripled in 6 months after their SEO work. Incredible results and great communication throughout.",
    rating: 5,
  },
];

const whyUs = [
  "Dedicated project manager for every client",
  "Transparent pricing with no hidden fees",
  "Agile delivery with weekly progress updates",
  "Post-launch support included in every package",
  "In-house team — no outsourcing",
  "NDA & IP protection guaranteed",
];

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0b]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2.5">
          <Image
            src="/logo2.png"
            alt="Going Genius"
            width={36}
            height={40}
            className="h-9 w-8 object-contain"
            priority
          />
          <div className="leading-tight">
            <p className="text-[15px] font-bold text-white">
              Going <span className="text-[#f0b90b]">Genius</span>
            </p>
            <p className="text-[10px] font-medium text-zinc-400">
              Group of <span className="text-[#f0b90b]">Companies</span>
            </p>
          </div>
        </Link>

        {/* Nav links — hidden on mobile */}
        <nav className="hidden items-center gap-7 md:flex">
          {["Services", "About", "Work", "Testimonials", "Contact"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                {item}
              </a>
            )
          )}
        </nav>

        {/* CTA */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-lg bg-[#e8821a] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#d4741a]"
        >
          Admin Login
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0b] px-4 pb-24 pt-20 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#e8821a]/10 blur-[120px]" />
        <div className="absolute -bottom-20 right-0 h-[400px] w-[400px] rounded-full bg-[#f0b90b]/8 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e8821a]/30 bg-[#e8821a]/10 px-4 py-1.5">
          <Zap className="h-3.5 w-3.5 text-[#e8821a]" />
          <span className="text-xs font-semibold text-[#e8821a]">
            Trusted by 350+ businesses worldwide
          </span>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left */}
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              We Build{" "}
              <span className="text-[#e8821a]">Digital Products</span>{" "}
              That Drive{" "}
              <span className="text-[#f0b90b]">Real Growth</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              Going Genius is a full-service digital agency helping businesses
              transform their ideas into powerful digital experiences — from
              web development to marketing.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl bg-[#e8821a] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#e8821a]/25 transition-all hover:bg-[#d4741a] hover:shadow-[#e8821a]/40"
              >
                Start Your Project
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-bold text-white transition-colors hover:border-white/30 hover:bg-white/5"
              >
                Explore Services
              </a>
            </div>

            {/* Trust row */}
            <div className="mt-10 flex flex-wrap items-center gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-extrabold text-white">
                    {s.value}
                  </p>
                  <p className="text-xs text-zinc-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — visual card stack */}
          <div className="relative hidden lg:block">
            <div className="relative mx-auto w-full max-w-md">
              {/* Card 1 — back */}
              <div className="absolute -right-4 -top-4 h-full w-full rounded-3xl border border-white/5 bg-white/3" />
              {/* Card 2 — main */}
              <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8821a]/20">
                    <TrendingUp className="h-6 w-6 text-[#e8821a]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Revenue Growth
                    </p>
                    <p className="text-xs text-zinc-500">Last 12 months</p>
                  </div>
                </div>
                <p className="text-4xl font-extrabold text-white">+247%</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Average client revenue increase
                </p>

                <div className="mt-6 space-y-3">
                  {["Web Traffic", "Conversions", "Brand Reach"].map(
                    (label, i) => {
                      const widths = ["w-4/5", "w-3/5", "w-11/12"];
                      const colors = [
                        "bg-[#e8821a]",
                        "bg-[#f0b90b]",
                        "bg-sky-500",
                      ];
                      return (
                        <div key={label}>
                          <div className="mb-1 flex justify-between text-xs text-zinc-400">
                            <span>{label}</span>
                            <span className="text-white font-medium">
                              {["80%", "60%", "92%"][i]}
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-white/10">
                            <div
                              className={`h-1.5 rounded-full ${widths[i]} ${colors[i]}`}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0a0a0b] px-4 py-2.5 shadow-xl">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      Project Delivered
                    </p>
                    <p className="text-[10px] text-zinc-500">On time, always</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────

function Services() {
  return (
    <section id="services" className="bg-[#f5f3f3] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full bg-[#e8821a]/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#e8821a]">
            What We Do
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            Services Built for Growth
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-zinc-500">
            From strategy to execution, we cover every aspect of your digital
            journey.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${s.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-base font-bold text-zinc-900">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-500">
                  {s.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#e8821a] opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Stats Banner ─────────────────────────────────────────────────────────────

function StatsBanner() {
  return (
    <section className="bg-[#0a0a0b] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-extrabold text-[#e8821a]">
                {s.value}
              </p>
              <p className="mt-1 text-sm font-medium text-zinc-400">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why Us ───────────────────────────────────────────────────────────────────

function WhyUs() {
  return (
    <section id="about" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left */}
          <div>
            <span className="inline-block rounded-full bg-[#f0b90b]/15 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#f0b90b]">
              Why Going Genius
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
              A Partner You Can{" "}
              <span className="text-[#e8821a]">Actually Trust</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-500">
              We don&apos;t just deliver projects — we build long-term
              partnerships. Our team is committed to your success at every
              stage.
            </p>

            <ul className="mt-8 space-y-3">
              {whyUs.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#e8821a]" />
                  <span className="text-sm text-zinc-700">{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#0a0a0b] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
            >
              Get in Touch
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Right — team visual */}
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: Users,
                label: "Expert Team",
                sub: "50+ specialists",
                bg: "bg-[#0a0a0b]",
                iconBg: "bg-[#e8821a]/20",
                iconColor: "text-[#e8821a]",
              },
              {
                icon: Globe,
                label: "Global Reach",
                sub: "20+ countries",
                bg: "bg-[#e8821a]",
                iconBg: "bg-white/20",
                iconColor: "text-white",
              },
              {
                icon: Zap,
                label: "Fast Delivery",
                sub: "Avg. 4-week launch",
                bg: "bg-[#f0b90b]",
                iconBg: "bg-black/10",
                iconColor: "text-black",
              },
              {
                icon: ShieldCheck,
                label: "Secure & Reliable",
                sub: "99.9% uptime SLA",
                bg: "bg-zinc-100",
                iconBg: "bg-[#e8821a]/10",
                iconColor: "text-[#e8821a]",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className={`rounded-2xl p-6 ${card.bg}`}
                >
                  <div
                    className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg}`}
                  >
                    <Icon className={`h-5 w-5 ${card.iconColor}`} />
                  </div>
                  <p
                    className={`text-sm font-bold ${
                      card.bg === "bg-zinc-100" ? "text-zinc-900" : "text-white"
                    } ${card.bg === "bg-[#f0b90b]" ? "text-black" : ""}`}
                  >
                    {card.label}
                  </p>
                  <p
                    className={`mt-0.5 text-xs ${
                      card.bg === "bg-zinc-100"
                        ? "text-zinc-500"
                        : card.bg === "bg-[#f0b90b]"
                        ? "text-black/60"
                        : "text-white/60"
                    }`}
                  >
                    {card.sub}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  return (
    <section
      id="testimonials"
      className="bg-[#f5f3f3] px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full bg-[#e8821a]/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#e8821a]">
            Testimonials
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            What Our Clients Say
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-[#f0b90b] text-[#f0b90b]"
                  />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-zinc-600">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8821a]/10 text-sm font-bold text-[#e8821a]">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact / CTA ────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section id="contact" className="bg-[#0a0a0b] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Left */}
          <div>
            <span className="inline-block rounded-full bg-[#e8821a]/15 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#e8821a]">
              Contact Us
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to Start Your{" "}
              <span className="text-[#e8821a]">Next Project?</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-400">
              Tell us about your project and we&apos;ll get back to you within
              24 hours with a free consultation.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { icon: Mail, label: "hello@goinggenius.com" },
                { icon: Phone, label: "+1 (555) 000-0000" },
                { icon: MapPin, label: "Available worldwide, remote-first" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                    <Icon className="h-4 w-4 text-[#e8821a]" />
                  </div>
                  <span className="text-sm text-zinc-400">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-[#e8821a]/50 focus:ring-1 focus:ring-[#e8821a]/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-400">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@company.com"
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-[#e8821a]/50 focus:ring-1 focus:ring-[#e8821a]/30"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-400">
                  Service Needed
                </label>
                <select className="h-11 w-full rounded-xl border border-white/10 bg-[#0a0a0b] px-4 text-sm text-zinc-400 outline-none focus:border-[#e8821a]/50 focus:ring-1 focus:ring-[#e8821a]/30">
                  <option value="">Select a service...</option>
                  {services.map((s) => (
                    <option key={s.title} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-400">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your project..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-[#e8821a]/50 focus:ring-1 focus:ring-[#e8821a]/30"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-[#e8821a] py-3 text-sm font-bold text-white transition-colors hover:bg-[#d4741a]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0b] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <Image
            src="/logo2.png"
            alt="Going Genius"
            width={28}
            height={32}
            className="h-8 w-7 object-contain"
          />
          <span className="text-sm font-bold text-white">
            Going <span className="text-[#f0b90b]">Genius</span>
          </span>
        </div>
        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} Going Genius Group of Companies. All
          rights reserved.
        </p>
        <Link
          href="/login"
          className="text-xs font-medium text-zinc-500 transition-colors hover:text-[#e8821a]"
        >
          Admin Portal →
        </Link>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <StatsBanner />
      <WhyUs />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}
