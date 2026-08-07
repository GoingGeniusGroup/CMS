"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, Phone, Send } from "lucide-react";
import type { CtaData } from "@/lib/content/schemas";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { usePublicLabelResolver } from "@/components/content/PublicLabelProvider";

/**
 * Company page "Let's Work Together" CTA card (Phase 4), driven by
 * `ctaSchema` data (the "company.contactCta" section). Keeps the bespoke
 * three-column card (image | text | contact info + button) that the shared
 * CtaSection doesn't model, but renders the email/phone from ContactSettings
 * instead of the old hardcoded literals.
 */
export function ContactCtaSection({
  data,
  email,
  phone,
}: {
  data: CtaData;
  email?: string | null;
  phone?: string | null;
}) {
  const resolveLabel = usePublicLabelResolver();

  return (
    <section className="border-t border-gray-100 bg-gray-50/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <RevealOnScroll className="grid items-center gap-10 rounded-3xl bg-white p-8 shadow-md sm:p-10 md:grid-cols-[280px_1fr_auto] md:gap-12">
          {data.imageUrl && (
            <div className="relative h-52 w-full overflow-hidden rounded-2xl md:h-48">
              <Image
                src={data.imageUrl}
                alt={data.imageAlt || ""}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          )}

          <div>
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
                <Send className="h-7 w-7" />
              </span>
              <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                {data.headingLines.map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {resolveLabel(line)}
                  </span>
                ))}
              </h2>
            </div>
            {data.Subheading && (
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
                {resolveLabel(data.Subheading)}
              </p>
            )}
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            {email && (
              <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Mail className="h-4 w-4 text-indigo-600" /> {email}
              </span>
            )}
            {phone && (
              <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Phone className="h-4 w-4 text-indigo-600" /> {phone}
              </span>
            )}
            {data.primaryCtaLabel && (
              <Link
                href={data.primaryCtaHref || "/contact"}
                className="mt-1 flex items-center gap-1.5 whitespace-nowrap rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                {resolveLabel(data.primaryCtaLabel)}
                {data.primaryCtaShowArrow && <ArrowRight className="h-4 w-4" />}
              </Link>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}