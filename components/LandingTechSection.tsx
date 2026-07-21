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
        <p className="mb-8 text-3xl font-bold text-zinc-900">Technologies We Use</p>
        <div className="overflow-hidden">
          <div className="flex gap-x-20 sm:gap-x-28 tech-scroll">
            {[...technologies, ...technologies].map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={url}
                alt={`Technology ${i + 1}`}
                className="h-7 w-auto max-w-[100px] object-contain flex-shrink-0 sm:h-9 sm:max-w-[120px]"
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .tech-scroll {
          animation: tech-scroll-right 10s linear infinite;
          will-change: transform;
        }
        .tech-scroll:hover {
          animation-play-state: paused;
        }
        @keyframes tech-scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
