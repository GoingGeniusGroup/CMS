"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Headphones,
  Mail,
  MapPin,
  Phone,
  Send,
  Users,
  User,
  Zap,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type ContactSettings = {
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
  address: string;
  contactMail: string;
  officeHours: string;
  googleMapEmbed: string;
};

// ─── FAQ Data ────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "How quickly can I expect a response?",
    a: "Our typical response time is under 24 hours during business days. For urgent inquiries, we recommend giving us a call directly.",
  },
  {
    q: "What services does Going Genius provide?",
    a: "We provide web development, mobile app development, UI/UX design, digital marketing, software development, and cloud solutions.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes, we work with clients globally. Our team is experienced in collaborating across time zones and cultures.",
  },
  {
    q: "How can I start a project with you?",
    a: "Simply fill out the contact form or give us a call. We'll schedule a free consultation to understand your needs and provide a proposal.",
  },
];

const FEATURES = [
  { icon: Zap, title: "Quick Response", desc: "We respond to all inquiries within 24 hours." },
  { icon: Headphones, title: "Expert Support", desc: "Get help from our experienced and friendly team." },
  { icon: Clock, title: "24/7 Availability", desc: "We are available round the clock for you." },
  { icon: Users, title: "Trusted by Clients", desc: "Hundreds of businesses trust our services." },
];

// ─── Section: Contact Form + Info ─────────────────────────────────────────────

function ContactSection({ settings }: { settings: ContactSettings }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <section className="bg-[#fdf5f5] px-4 py-20 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-extrabold text-zinc-900">
              Get In <span className="text-indigo-600">Touch</span>
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Have a project in mind or need expert advice? We&apos;d love to
              hear from you. Fill out the form and our team will get back to you
              shortly.
            </p>

            <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Name + Email */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Your Name
                  </label>
                  <div className="flex h-11 items-center gap-2 rounded-lg border border-zinc-200 px-3">
                    <User className="h-4 w-4 shrink-0 text-zinc-400" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      className="flex-1 bg-transparent text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Email Address
                  </label>
                  <div className="flex h-11 items-center gap-2 rounded-lg border border-zinc-200 px-3">
                    <Mail className="h-4 w-4 shrink-0 text-zinc-400" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="flex-1 bg-transparent text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Subject
                </label>
                <div className="flex h-11 items-center gap-2 rounded-lg border border-zinc-200 px-3">
                  <Send className="h-4 w-4 shrink-0 text-zinc-400" />
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What are you interested in?"
                    className="flex-1 bg-transparent text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Message
                </label>
                <div className="flex gap-2 rounded-lg border border-zinc-200 p-3">
                  <Send className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="How can we help you?"
                    required
                    className="flex-1 resize-none bg-transparent text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                {sent ? "Message Sent ✓" : "Send Message"}
                {!sent && <Send className="h-4 w-4" />}
              </button>
            </form>
          </div>

          {/* Contact info cards — dynamic from DB */}
          <div className="flex flex-col gap-4">
            {/* Phone */}
            <div className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50">
                <Phone className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900">Phone Number</p>
                <p className="mt-1 text-sm text-zinc-600">
                  {settings.phone1 || "Not set"}
                </p>
                {settings.phone2 && (
                  <p className="text-sm text-zinc-600">{settings.phone2}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50">
                <Mail className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900">Email Address</p>
                <p className="mt-1 text-sm text-zinc-600">
                  {settings.email1 || "Not set"}
                </p>
                {settings.email2 && (
                  <p className="text-sm text-zinc-600">{settings.email2}</p>
                )}
                {settings.contactMail && settings.contactMail !== settings.email1 && (
                  <p className="mt-1 text-xs text-zinc-400">
                    Contact form: {settings.contactMail}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50">
                <MapPin className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900">Our Location</p>
                <p className="mt-1 text-sm text-zinc-600">
                  {settings.address || "Not set"}
                </p>
              </div>
            </div>

            {/* Office Hours */}
            {settings.officeHours && (
              <div className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50">
                  <Clock className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900">Office Hours</p>
                  <p className="mt-1 text-sm text-zinc-600">
                    {settings.officeHours}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section: Features ────────────────────────────────────────────────────────

function FeaturesSection() {
  return (
    <section className="bg-[#fdf5f5] px-4 py-12 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
                <Icon className="h-5 w-5 text-indigo-500" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-bold text-zinc-900">{title}</p>
              <p className="text-xs leading-relaxed text-zinc-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Map ─────────────────────────────────────────────────────────────

function MapSection({ settings }: { settings: ContactSettings }) {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          {/* Left */}
          <div>
            <h2 className="text-3xl font-extrabold text-zinc-900 sm:text-4xl">
              Our Location
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
              Visit us at our office or contact us anytime for any query. We are
              located at the heart of the business district.
            </p>
            {settings.address && (
              <div className="mt-6 flex items-center gap-2 text-sm text-zinc-600">
                <MapPin className="h-4 w-4 shrink-0 text-indigo-500" />
                {settings.address}
              </div>
            )}
            <a
              href={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address || "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline"
            >
              View larger map ↗
            </a>
          </div>

          {/* Right — Google Map embed */}
          <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm">
            {settings.googleMapEmbed ? (
              <div
                className="w-full [&>iframe]:h-[360px] [&>iframe]:w-full [&>iframe]:border-0"
                dangerouslySetInnerHTML={{ __html: settings.googleMapEmbed }}
              />
            ) : (
              <div className="flex h-[360px] w-full items-center justify-center bg-zinc-100 text-sm text-zinc-400">
                Map not configured
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section: FAQ ─────────────────────────────────────────────────────────────

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-[#fdf5f5] px-4 py-20 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Left */}
          <div>
            <h2 className="text-3xl font-extrabold text-zinc-900 sm:text-4xl">
              Have <span className="text-indigo-600">Questions?</span>
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-500">
              We&apos;ve got answers. If you can&apos;t find what you&apos;re
              looking for, feel free to contact our support team.
            </p>
            <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl">
              <Image
                src="/letsTalk.png"
                alt="Have questions - contact support"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Right — FAQ accordion */}
          <div className="flex flex-col gap-3">
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-zinc-800"
                  >
                    {item.q}
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-indigo-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="px-5 pb-4 text-sm leading-relaxed text-zinc-500">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section: Let's Work Together ────────────────────────────────────────────

function WorkTogetherSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold text-zinc-900 sm:text-4xl">
              Let&apos;s Work Together
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-500">
              We&apos;re ready to help you build amazing digital solutions for
              your business. Join our ecosystem of high-growth partners today.
            </p>
            <a
              href="#contact-form"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Let&apos;s Talk
              <Send className="h-4 w-4" />
            </a>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-2xl">
            <Image
              src="/contactus.png"
              alt="Contact Us network"
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

// ─── Main Client Export ───────────────────────────────────────────────────────

export function ContactClient({ settings }: { settings: ContactSettings }) {
  return (
    <>
      <ContactSection settings={settings} />
      <FeaturesSection />
      <MapSection settings={settings} />
      <FAQSection />
      <WorkTogetherSection />
    </>
  );
}
