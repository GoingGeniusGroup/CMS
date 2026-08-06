"use client";

import { useState, useEffect } from "react";
import { getPublicJobs, type JobRow } from "@/app/actions/jobs";
import { getPublicContactSettings } from "@/app/actions/contact-settings";
import { getSection, type SiteContentSection } from "@/app/actions/site-content";
import { SECTION_REGISTRY, type SectionKey } from "@/lib/content/schemas";
import { PageHero } from "@/components/content/PageHero";
import { TwoColumnSection } from "@/components/content/TwoColumnSection";
import { StatsSection } from "@/components/content/StatsSection";
import { CareersSection } from "@/components/content/CareersSection";
import { ContactCtaSection } from "@/components/content/ContactCtaSection";
import { LandingTeamSection } from "@/components/LandingTeamSection";
import { FaqSection } from "@/components/FaqSection";
import { useModuleDisabled } from "@/components/content/PublicModuleVisibilityProvider";

/**
 * Fetches one section on the client and keeps its registry default until the
 * row arrives — the career page's pattern, generalized to several sections.
 */
function useSection<K extends SectionKey>(sectionKey: K): SiteContentSection<K> {
  const [section, setSection] = useState<SiteContentSection<K>>({
    sectionKey,
    pageKey: SECTION_REGISTRY[sectionKey].pageKey,
    variant: "default",
    isVisible: true,
    order: SECTION_REGISTRY[sectionKey].defaultOrder,
    data: SECTION_REGISTRY[sectionKey].defaultData,
  });

  useEffect(() => {
    getSection(SECTION_REGISTRY[sectionKey].pageKey, sectionKey).then(setSection);
  }, [sectionKey]);

  return section;
}

/* ─── Page ───────────────────────────────────────────────── */

export default function CompanyPage() {
  const jobModuleHidden = useModuleDisabled("job");
  const heroSection = useSection("company.hero");
  const aboutSection = useSection("company.about");
  const statsSection = useSection("company.stats");
  const careersSection = useSection("company.careers");
  const contactCtaSection = useSection("company.contactCta");
  // shared.*: also shown on /home and /contact — pass the section data so
  // these stop silently falling back to registry defaults when an admin has
  // edited them.
  const teamHeader = useSection("shared.team");
  const faqHeader = useSection("shared.faq");

  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [contactInfo, setContactInfo] = useState<{ email?: string; phone?: string }>({});

  useEffect(() => {
    getPublicJobs().then((data) => setJobs(data.slice(0, 3)));
    // Contact details come from Settings > Contact (not hardcoded literals).
    getPublicContactSettings().then((settings) =>
      setContactInfo({
        email: settings?.email1 || undefined,
        phone: settings?.phone1 || undefined,
      })
    );
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <PageHero data={heroSection.data} />
      <TwoColumnSection data={aboutSection.data} />
      <StatsSection data={statsSection.data} />
      <LandingTeamSection headerData={teamHeader.data} />
      {!jobModuleHidden && <CareersSection data={careersSection.data} jobs={jobs} />}
      <FaqSection headerData={faqHeader.data} />
      <ContactCtaSection
        data={contactCtaSection.data}
        email={contactInfo.email}
        phone={contactInfo.phone}
      />
    </div>
  );
}