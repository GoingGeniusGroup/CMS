"use client";

import { useState, useEffect } from "react";
import { getPublicTechnologies } from "@/app/actions/public-settings";

export function LandingTechSection() {
  const [technologies, setTechnologies] = useState<string[]>([]);

  useEffect(() => {
    getPublicTechnologies().then((data) => setTechnologies(data));
  }, []);

  if (technologies.length === 0) return null;

  return (
    <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <p className="mb-8 text-sm font-bold text-zinc-900">Technologies We Use</p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {technologies.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt={`Technology ${i + 1}`}
              className="h-7 w-auto max-w-[100px] object-contain sm:h-9 sm:max-w-[120px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
