import type { Metadata } from "next";
import { getPublicContactSettings } from "@/app/actions/contact-settings";
import { getPublicServices } from "@/app/actions/services";
import { getSection } from "@/app/actions/site-content";
import { resolveTokensOnServer } from "@/lib/content/resolve-tokens-server";
import { PageHero } from "@/components/content/PageHero";
import { ContactClient } from "./ContactClient";

// ─── Metadata (Task 24, Phase 19) ───────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  // Title intentionally omitted — the tab title stays the site name from
  // Settings > General (default title set in app/(user)/layout.tsx). Only the
  // description is derived from hero content.
  const heroSection = await getSection("contact", "contact.hero");
  const description = heroSection.data.Subheading
    ? await resolveTokensOnServer(heroSection.data.Subheading)
    : undefined;
  return { description };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ContactPage() {
  const [data, heroSection, services, featuresSection, workTogetherSection] = await Promise.all([
    getPublicContactSettings(),
    getSection("contact", "contact.hero"),
    getPublicServices(),
    getSection("contact", "contact.features"),
    getSection("contact", "contact.workTogether"),
  ]);

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

  const serviceNames = services.map((s) => s.serviceName);

  return (
    <>
      <PageHero data={heroSection.data} />
      <ContactClient
        settings={settings}
        services={serviceNames}
        features={featuresSection.data}
        workTogether={workTogetherSection.data}
      />
    </>
  );
}
