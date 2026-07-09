"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { images } from "@/lib/images";

// ΓöÇΓöÇΓöÇ Data ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const techStack = [
  { name: "PHP", src: images.php, w: 60, h: 30 },
  { name: "Supabase", src: images.supabase, w: 110, h: 26 },
  { name: ".NET", src: images.dotnet, w: 60, h: 28 },
  { name: "Flutter", src: images.flutter, w: 80, h: 28 },
  { name: "Prisma", src: images.prisma, w: 100, h: 28 },
];

const services = [
  { title: "Web Development", desc: "Custom websites built for speed, scale, and conversion.", image: images.web },
  { title: "Mobile Apps", desc: "iOS and Android apps designed around real user needs.", image: images.omniscaleAnalytics },
  { title: "UI/UX Design", desc: "Interfaces that feel obvious in hindsight and delightful in use.", image: images.component49 },
  { title: "Digital Marketing", desc: "Campaigns that turn attention into measurable growth.", image: images.background },
];

const projects = [
  {
    src: images.background,
    title: "E-Commerce Websites",
    desc: "Scalable online shopping platform with secure payments, inventory management, responsive design, and an intuitive customer experience.",
    tags: ["Web Development", "E-Commerce"],
  },
  {
    src: images.omniscaleAnalytics,
    title: "Business Dashboard",
    desc: "Modern dashboard with analytics and reporting.",
    tags: ["Dashboard", "UI/UX"],
  },
];

const posts = [
  {
    src: images.container1,
    tag: "Web Development",
    date: "Jan 15, 2026",
    title: "Top 10 Web Design Trends",
    desc: "Exploring modern web technologies.",
  },
  {
    src: images.container2,
    tag: "Design",
    date: "Feb 02, 2026",
    title: "Choosing the Right UI/UX",
    desc: "Creating better user experiences.",
  },
];

const team = [
  { name: "John Doe", role: "Developer", src: images.alex },
  { name: "John Doe", role: "Design Director", src: images.girl },
];

const faqs = [
  {
    q: "Why Going Genius?",
    a: "We have the best and the most experienced Agile team who work together as a business team to manage your business with Going Genius Group. We have a Genius Team for expert advice, and we believe Genius Work brings more value than Hard Work.",
  },
  {
    q: "Why Us?",
    a: "We combine a dedicated project manager, transparent pricing, and an in-house team on every engagement, so you always know who's accountable and what's next.",
  },
  {
    q: "What are our company strengths?",
    a: "Twelve-plus years of delivery experience, a 98% client satisfaction rate, and post-launch support included with every package.",
  },
];

// ΓöÇΓöÇΓöÇ Hero ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

function Hero() {
  return (
    <section id="home" className="border-b border-zinc-100 bg-[#f6f4f3] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 rounded-3xl border-2 border-indigo-500/70 bg-white p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-5xl">
              Think Bigger,
              <br />
              <span className="text-indigo-600">Build Smarter</span>,
              <br />
              Scale Faster
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-500">
              Going Genius turns your ideas into something bigger, smarter, and
              more impactful. Let&apos;s connect and bring your vision to life ΓÇö
              better than you imagined.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Get Started
              </a>
              <a
                href="#services"
                className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400"
              >
                Learn More
              </a>
            </div>

            <div className="mt-8">
              <p className="mb-2 text-xs font-semibold text-zinc-500">Our Top Products</p>
              <Image
                src={images.frame1}
                alt="Our top products"
                width={300}
                height={60}
                className="h-12 w-auto"
              />
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={images.picture1}
              alt="Developer building a digital product"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ΓöÇΓöÇΓöÇ Partners ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

function Partners() {
  return (
    <section className="bg-zinc-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-zinc-400">
          Our Partners
        </p>
        <div className="flex items-center justify-center">
          <Image
            src={images.frame2}
            alt="Our partners"
            width={900}
            height={60}
            className="h-10 w-auto object-contain sm:h-12"
          />
        </div>
      </div>
    </section>
  );
}

// ΓöÇΓöÇΓöÇ Tech Stack ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

function TechStack() {
  return (
    <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <p className="mb-8 text-sm font-bold text-zinc-900">Technologies We Use</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {techStack.map((t) => (
            <Image
              key={t.name}
              src={t.src}
              alt={t.name}
              width={t.w}
              height={t.h}
              className="h-7 w-auto object-contain"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ΓöÇΓöÇΓöÇ Services ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

function Services() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="services" className="bg-[#f6f4f3] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-600">
            Our Services
          </p>
          <h2 className="text-2xl font-extrabold text-zinc-900 sm:text-3xl">
            What We Do Best
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-500">
            End-to-end digital solutions to help your business grow and scale.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={s.title}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="group cursor-pointer rounded-2xl border border-zinc-200 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-200"
              >
                <div className="mx-auto mb-5 h-32 w-full overflow-hidden rounded-xl">
                  <Image
                    src={s.image}
                    alt={s.title}
                    width={280}
                    height={128}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-base font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">{s.title}</h3>
                <p className={`mt-3 text-sm leading-relaxed text-zinc-500 transition-all duration-300 ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                  {s.desc}
                </p>
                <div className="mt-4 flex items-center justify-center">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 text-zinc-400 transition-all group-hover:border-indigo-300 group-hover:text-indigo-500 ${isOpen ? "rotate-180" : ""}`}>
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ΓöÇΓöÇΓöÇ Featured Works ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

function FeaturedWorks() {
  return (
    <section id="portfolio" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Featured Works</p>
            <h2 className="mt-2 text-2xl font-extrabold text-zinc-900">Recent Success Stories</h2>
          </div>
          <Link href="/portfolio" className="text-sm font-semibold text-indigo-600 hover:underline">
            View All Projects
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((p, i) => (
            <div key={i} className="rounded-2xl border border-zinc-200 p-6 shadow-sm">
              <h3 className="text-base font-bold text-zinc-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{p.desc}</p>
              <div className="mt-4 flex gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-xl bg-zinc-50">
                <Image src={p.src} alt={p.title} fill className="object-contain" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Products() {
  return (
    <section id="products" className="bg-[#f6f4f3] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Products</p>
            <h2 className="mt-2 text-2xl font-extrabold text-zinc-900">Products and Solutions</h2>
          </div>
          <a href="#contact" className="text-sm font-semibold text-indigo-600 hover:underline">
            Contact Sales
          </a>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Growth Analytics",
              desc: "Live dashboards and reporting for business performance and customer insights.",
            },
            {
              title: "Campaign Automation",
              desc: "Automated workflows that convert leads and keep customers engaged.",
            },
            {
              title: "Customer Portal",
              desc: "Secure, branded portals for customers to manage accounts and requests.",
            },
          ].map((product) => (
            <div key={product.title} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-zinc-900">{product.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">{product.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ΓöÇΓöÇΓöÇ Blog / Insights ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

function Insights() {
  return (
    <section id="blog" className="bg-[#f6f4f3] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Insights</p>
            <h2 className="mt-2 text-2xl font-extrabold text-zinc-900">Industry Perspectives</h2>
          </div>
          <Link
            href="/blog"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:border-zinc-400"
          >
            Read Blog
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <div key={post.title} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="relative aspect-[16/9]">
                <Image src={post.src} alt={post.title} fill className="object-cover" />
                <span className="absolute left-4 top-4 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                  {post.tag}
                </span>
              </div>
              <div className="p-5">
                <p className="text-xs font-medium text-zinc-400">{post.date}</p>
                <h3 className="mt-1 text-base font-bold text-zinc-900">{post.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{post.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ΓöÇΓöÇΓöÇ Team ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

function Team() {
  return (
    <section id="company" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-indigo-600">Our Team</p>
        <h2 className="mt-2 text-center text-2xl font-extrabold text-zinc-900">Meet the Geniuses</h2>

        <div className="mx-auto mt-10 grid max-w-2xl gap-6 sm:grid-cols-2">
          {team.map((member, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm">
              <div className="relative aspect-[4/3] bg-zinc-50">
                <Image src={member.src} alt={member.name} fill className="object-contain" />
              </div>
              <div className="p-4">
                <p className="text-sm font-bold text-zinc-900">{member.name}</p>
                <p className="text-xs text-zinc-500">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ΓöÇΓöÇΓöÇ FAQ ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-[#f6f4f3] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-indigo-600">Support</p>
        <h2 className="mt-2 text-center text-2xl font-extrabold text-zinc-900">Frequently Asked Questions</h2>

        <div className="mt-8 space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold text-zinc-900"
                >
                  {item.q}
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-indigo-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-400" />
                  )}
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 text-sm leading-relaxed text-zinc-500">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ΓöÇΓöÇΓöÇ Page ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export default function Page() {
  return (
    <>
      <Hero />
      <Partners />
      <TechStack />
      <Services />
      <Products />
      <FeaturedWorks />
      <Insights />
      <Team />
      <FAQ />
    </>
  );
}