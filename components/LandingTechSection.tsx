"use client";

import { useState, useEffect } from "react";
import { getPublicTechnologies } from "@/app/actions/public-settings";
import { Marquee } from "@/components/motion/Marquee";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { SECTION_REGISTRY, type SectionHeaderData } from "@/lib/content/schemas";
import { useModuleDisabled } from "@/components/content/PublicModuleVisibilityProvider";

export function LandingTechSection({
  initialTechnologies,
  headerData,
  bgColor,
  textColor,
}: {
  initialTechnologies?: string[];
  headerData?: SectionHeaderData;
  bgColor?: string;
  textColor?: string;
}) {
  const moduleHidden = useModuleDisabled("technologies");
  const [technologies, setTechnologies] = useState<string[]>(initialTechnologies ?? []);
  const header = headerData ?? SECTION_REGISTRY["home.tech"].defaultData;

  useEffect(() => {
    if (!initialTechnologies) {
      getPublicTechnologies().then((data) => setTechnologies(data));
    }
  }, [initialTechnologies]);

  if (moduleHidden || technologies.length === 0) return null;

  // Pad out to a minimum count so a short list still fills the track width.
  const displayTechs = [...technologies];
  while (displayTechs.length < 12) {
    displayTechs.push(...technologies);
  }

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8" style={{ backgroundColor: bgColor || "#ffffff" }}>
      <div className="mx-auto max-w-7xl text-center">
        <RevealOnScroll>
          <p className="mb-8 text-3xl font-bold" style={{ color: textColor || "#18181b" }}>{header.heading}</p>
        </RevealOnScroll>

        <Marquee duration={displayTechs.length * 2.5} direction="right">
          {displayTechs.map((url, i) => (
            <span
              key={i}
              className="flex-shrink-0 rounded-lg px-4 py-2"
              style={{ backgroundColor: `${textColor || "#18181b"}10` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Logo ${i + 1}`}
                className="h-7 w-auto max-w-[100px] object-contain sm:h-9 sm:max-w-[120px]"
              />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
