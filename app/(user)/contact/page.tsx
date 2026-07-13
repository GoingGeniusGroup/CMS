import Image from "next/image";
import { getPublicContactSettings } from "@/app/actions/contact-settings";
import { ContactClient } from "./ContactClient";

// ─── Section: Hero (server-rendered, no interactivity) ───────────────────────

function HeroSection() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left */}
          <div>
            <h1 className="text-4xl font-extrabold text-zinc-900 sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-500">
              Have a question or a project in mind? We&apos;d love to hear from
              you. Our team of geniuses is ready to help scale your business.
            </p>
          </div>

          {/* Right */}
          <div className="relative aspect-video overflow-hidden rounded-2xl">
            <Image
              src="/Rectangle.png"
              alt="Contact Us"
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ContactPage() {
  const data = await getPublicContactSettings();

  const settings = {
    phone1: data?.phone1 ?? "",
    phone2: data?.phone2 ?? "",
    email1: data?.email1 ?? "",
    email2: data?.email2 ?? "",
    address: data?.address ?? "",
    contactMail: data?.contactMail ?? "",
    officeHours: data?.officeHours ?? "",
    googleMapEmbed: data?.googleMapEmbed ?? "",
  };

  return (
    <>
      <HeroSection />
      <ContactClient settings={settings} />
    </>
  );
}
