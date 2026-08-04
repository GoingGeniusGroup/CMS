"use client";

import { useState, useEffect } from "react";
import { getPublicTechnologies } from "@/app/actions/public-settings";
import { Marquee } from "@/components/motion/Marquee";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { SECTION_REGISTRY, type SectionHeaderData } from "@/lib/content/schemas";

export function LandingTechSection({
  initialTechnologies,
  headerData,
}: {
  initialTechnologies?: string[];
  headerData?: SectionHeaderData;
}) {
  const [technologies, setTechnologies] = useState<string[]>(initialTechnologies ?? []);
  const header = headerData ?? SECTION_REGISTRY["home.tech"].defaultData;

  useEffect(() => {
    if (!initialTechnologies) {
      getPublicTechnologies().then((data) => setTechnologies(data));
    }
  }, [initialTechnologies]);

  if (technologies.length === 0) return null;

  // Pad out to a minimum count so a short list still fills the track width.
  const displayTechs = [...technologies];
  while (displayTechs.length < 12) {
    displayTechs.push(...technologies);
  }

  return (
    <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <RevealOnScroll>
          <p className="mb-8 text-3xl font-bold text-zinc-900">{header.heading}</p>
        </RevealOnScroll>

        <Marquee duration={displayTechs.length * 2.5} direction="right">
          {displayTechs.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt={`Logo ${i + 1}`}
              className="h-7 w-auto max-w-[100px] flex-shrink-0 object-contain sm:h-9 sm:max-w-[120px]"
            />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
