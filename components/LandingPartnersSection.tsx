"use client";

import { useState, useEffect } from "react";
import { getPublicPartners } from "@/app/actions/settings";
import { Marquee } from "@/components/motion/Marquee";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { SECTION_REGISTRY, type SectionHeaderData } from "@/lib/content/schemas";
import { useModuleDisabled } from "@/components/content/PublicModuleVisibilityProvider";

export function LandingPartnersSection({
  initialPartners,
  headerData,
  bgColor,
  textColor,
}: {
  initialPartners?: string[];
  headerData?: SectionHeaderData;
  bgColor?: string;
  textColor?: string;
}) {
  const moduleHidden = useModuleDisabled("partners");
  const [partners, setPartners] = useState<string[]>(initialPartners ?? []);
  const header = headerData ?? SECTION_REGISTRY["home.partners"].defaultData;

  useEffect(() => {
    if (!initialPartners) {
      getPublicPartners().then((data) => setPartners(data));
    }
  }, [initialPartners]);

  if (moduleHidden || partners.length === 0) return null;

  // Pad out to a minimum count so a short list still fills the track width.
  const displayPartners = [...partners];
  while (displayPartners.length < 12) {
    displayPartners.push(...partners);
  }

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8" style={{ backgroundColor: bgColor || "#09090b" }}>
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <p className="mb-6 text-center text-2xl font-bold uppercase tracking-widest" style={{ color: textColor || "#a1a1aa" }}>
            {header.heading}
          </p>
        </RevealOnScroll>

        <Marquee duration={displayPartners.length * 2.5} gapClassName="gap-16 sm:gap-24" direction="left">
          {displayPartners.map((url, i) => (
            <span
              key={i}
              className="flex-shrink-0 rounded-lg px-4 py-2"
              style={{ backgroundColor: `${textColor || "#a1a1aa"}15` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Partner ${i + 1}`}
                className="h-8 w-auto max-w-[120px] object-contain opacity-80 transition-opacity hover:opacity-100 sm:h-10 sm:max-w-[140px]"
              />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
