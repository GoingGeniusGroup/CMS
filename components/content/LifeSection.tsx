"use client";

import Image from "next/image";
import type { LifeData } from "@/lib/content/schemas";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { usePublicLabelResolver } from "@/components/content/PublicLabelProvider";

/**
 * Career page "Life at Going Genius" mosaic (Phase 5) driven by
 * `lifeSectionSchema`: heading + copy + images. The first image spans both
 * rows on the left (its optional `label` overlaid), the next two fill the
 * right column, and any additional images render in a row below — preserving
 * the original bespoke 2fr/1fr mosaic exactly.
 */
export function LifeSection({ data }: { data: LifeData }) {
  const resolveLabel = usePublicLabelResolver();
  const [big, ...smalls] = data.images;
  const extras = data.images.slice(3);

  return (
    <section className="bg-white px-4 pb-16 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <h2 className="mb-6 text-2xl font-extrabold text-zinc-900 sm:text-3xl">
            {resolveLabel(data.heading)}
          </h2>
          {data.copy && (
            <p className="mb-6 max-w-2xl text-sm leading-relaxed text-zinc-500">
              {resolveLabel(data.copy)}
            </p>
          )}

          {big && (
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "2fr 1fr", gridTemplateRows: "1fr 1fr", height: 460 }}
            >
              {/* Large left tile — spans both rows */}
              <div className="relative overflow-hidden rounded-2xl shadow-sm" style={{ gridRow: "1 / 3" }}>
                <Image
                  src={big.src}
                  alt={big.alt || ""}
                  fill
                  sizes="66vw"
                  className="object-cover object-center"
                />
                {big.label && (
                  <span className="absolute bottom-4 left-4 text-sm font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {resolveLabel(big.label)}
                  </span>
                )}
              </div>

              {/* Right column tiles */}
              {smalls.map((img, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-2xl ${i >= 1 ? "shadow-sm" : ""}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt || ""}
                    fill
                    sizes="33vw"
                    className="object-cover object-center"
                  />
                  {img.label && (
                    <span className="absolute bottom-4 left-4 text-sm font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      {resolveLabel(img.label)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {extras.length > 0 && (
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {extras.map((img, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={img.src}
                    alt={img.alt || ""}
                    fill
                    sizes="33vw"
                    className="object-cover"
                  />
                  {img.label && (
                    <span className="absolute bottom-4 left-4 text-sm font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      {resolveLabel(img.label)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </RevealOnScroll>
      </div>
    </section>
  );
}