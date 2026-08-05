"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Building2,
  Clock,
  Headphones,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  Users,
  User,
  Zap,
} from "lucide-react";
import { FaqSection } from "@/components/FaqSection";
import { submitContactLead } from "@/app/actions/leads";

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

const BUDGET_OPTIONS = [
  "Under $5k",
  "$5k – $10k",
  "$10k – $25k",
  "$25k – $50k",
  "$50k+",
  "Not sure",
];

// ─── FAQ Data ────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: Zap, title: "Quick Response", desc: "We respond to all inquiries within 24 hours." },
  { icon: Headphones, title: "Expert Support", desc: "Get help from our experienced and friendly team." },
  { icon: Clock, title: "24/7 Availability", desc: "We are available round the clock for you." },
  { icon: Users, title: "Trusted by Clients", desc: "Hundreds of businesses trust our services." },
];

// ─── Section: Contact Form + Info ─────────────────────────────────────────────

function ContactSection({
  settings,
  services,
}: {
  settings: ContactSettings;
  services: string[];
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    serviceInterest: "",
    budget: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const res = await submitContactLead({
      fullName: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      subject: form.subject,
      message: form.message,
      serviceInterest: form.serviceInterest,
      budget: form.budget,
    });

    setIsSubmitting(false);
    if (res.success) {
      router.push("/contact/thank-you");
    } else {
      setSubmitError(res.error ?? "Failed to send your message. Please try again.");
    }
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

              {/* Phone + Company */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Phone Number
                  </label>
                  <div className="flex h-11 items-center gap-2 rounded-lg border border-zinc-200 px-3">
                    <Phone className="h-4 w-4 shrink-0 text-zinc-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone"
                      className="flex-1 bg-transparent text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Company Name
                  </label>
                  <div className="flex h-11 items-center gap-2 rounded-lg border border-zinc-200 px-3">
                    <Building2 className="h-4 w-4 shrink-0 text-zinc-400" />
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Your company"
                      className="flex-1 bg-transparent text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
                    />
                  </div>
                </div>
              </div>

              {/* Service of interest + Budget */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Service of Interest
                  </label>
                  <select
                    name="serviceInterest"
                    value={form.serviceInterest}
                    onChange={handleChange}
                    className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none focus:border-indigo-400"
                  >
                    <option value="">Select a service (optional)</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Budget Range
                  </label>
                  <select
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none focus:border-indigo-400"
                  >
                    <option value="">Select budget (optional)</option>
                    {BUDGET_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
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

              {submitError && (
                <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    Sending...
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="h-4 w-4" />
                  </>
                )}
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
// (dynamic content from database — see FaqSection component)

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

export function ContactClient({
  settings,
  services,
}: {
  settings: ContactSettings;
  services: string[];
}) {
  return (
    <>
      <ContactSection settings={settings} services={services} />
      <FeaturesSection />
      <MapSection settings={settings} />
      <FaqSection />
      <WorkTogetherSection />
    </>
  );
}
