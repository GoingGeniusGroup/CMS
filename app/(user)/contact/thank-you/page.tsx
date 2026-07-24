import Link from "next/link";
import { Check, Home, Mail, Zap, Clock, User } from "lucide-react";
import { getPublicContactSettings } from "@/app/actions/contact-settings";

export default async function ThankYouPage() {
  const data = await getPublicContactSettings();
  const phone = data?.phone1 || "+977 9841 234567";
  const email = data?.email1 || "info@goinggenius.com";

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        {/* Decorative dots */}
        <span className="absolute left-[20%] top-24 h-2.5 w-2.5 rounded-full bg-blue-400/60" />
        <span className="absolute right-[18%] top-40 h-2.5 w-2.5 rounded-full border border-rose-300" />
        <span className="absolute left-[12%] top-52 h-1 w-4 rounded-full bg-indigo-300" />
        <span className="absolute right-[28%] top-64 h-1 w-4 rotate-45 rounded-full bg-amber-300" />

        <div className="mx-auto max-w-2xl text-center">
          {/* Success badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
            <Check className="h-3.5 w-3.5" /> Success
          </span>

          {/* Green check circle */}
          <div className="mx-auto mt-8 flex h-32 w-32 items-center justify-center rounded-full bg-emerald-50">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-200">
              <Check className="h-11 w-11 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Heading */}
          <h1 className="mt-10 text-4xl font-extrabold text-zinc-900 sm:text-5xl">
            Thank You!
          </h1>
          <p className="mt-5 text-lg font-bold text-zinc-800">
            Your message has been received.
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-zinc-500">
            We appreciate you reaching out to us. Our team will review your
            message and get back to you within 24 hours.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/home"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              <Home className="h-4 w-4" /> Back to Home
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-6 py-3 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
            >
              <Mail className="h-4 w-4" /> Send Another Message
            </Link>
          </div>
        </div>
      </section>

      {/* Footer info row */}
      <section className="border-t border-zinc-100 bg-zinc-50/60 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-zinc-900">What happens next?</p>
              <p className="mt-0.5 text-xs text-zinc-500">Our team will review your message</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
              <Clock className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-zinc-900">Quick Response</p>
              <p className="mt-0.5 text-xs text-zinc-500">We typically reply within 24 hours</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
              <User className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-zinc-900">Need Immediate Help?</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                Call us at {phone} or email {email}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
