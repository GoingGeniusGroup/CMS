"use client";

import { useState, useEffect } from "react";
import { getPublicPartners } from "@/app/actions/settings";

export function LandingPartnersSection() {
  const [partners, setPartners] = useState<string[]>([]);

  useEffect(() => {
    getPublicPartners().then((data) => setPartners(data));
  }, []);

  if (partners.length === 0) return null;

  return (
    <section className="bg-zinc-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="mb-6 text-center text-2xl font-bold uppercase tracking-widest text-zinc-400">
          Our Partners
        </p>
        <div className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {partners.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={url}
                alt={`Partner ${i + 1}`}
                className="h-8 w-auto max-w-[120px] object-contain opacity-80 transition-opacity hover:opacity-100 sm:h-10 sm:max-w-[140px]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
