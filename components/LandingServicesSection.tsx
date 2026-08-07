"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPublicServices } from "@/app/actions/services";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { ShowcaseCard } from "@/components/ShowcaseCard";
import { SectionHeader, SectionCta } from "@/components/content/SectionHeader";
import { SECTION_REGISTRY, type SectionHeaderData } from "@/lib/content/schemas";
import { tiptapToPlainText } from "@/lib/tiptap-text";
import { useModuleDisabled } from "@/components/content/PublicModuleVisibilityProvider";
import { serviceSlug } from "@/lib/service-slug";

type ServiceData = {
  id: string;
  serviceName: string;
  description: string | null;
  category: string | null;
  thumbnailUrl: string | null;
  isFeatured: boolean;
};

export function LandingServicesSection({
  initialServices,
  headerData,
}: {
  initialServices?: ServiceData[];
  /** Falls back to the registry default (today's hardcoded copy) if omitted. */
  headerData?: SectionHeaderData;
}) {
  const moduleHidden = useModuleDisabled("service");
  const [services, setServices] = useState<ServiceData[]>(initialServices ?? []);
  const header = headerData ?? SECTION_REGISTRY["home.services"].defaultData;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialServices) {
      getPublicServices().then((data) => setServices(data));
    }
  }, [initialServices]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  if (moduleHidden || services.length === 0) return null;

  return (
    <>
      <section id="services" className="bg-[#f6f4f3] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader className="mb-6" data={header} />

          <div className="mb-4 flex items-center justify-end gap-2">
            <button
              onClick={() => scroll("left")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition hover:border-indigo-600 hover:text-indigo-600"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition hover:border-indigo-600 hover:text-indigo-600"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <StaggerGrid
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            stagger={0.06}
          >
            {services.map((service) => (
              <StaggerItem key={service.id} className="min-w-[260px] max-w-[260px] flex-shrink-0">
                <ShowcaseCard
                  title={service.serviceName}
                  description={tiptapToPlainText(service.description) || "Professional service tailored to your needs."}
                  imageUrl={service.thumbnailUrl}
                  actionLabel="Learn More"
                  href={`/servicedetail/${serviceSlug(service.serviceName)}`}
                />
              </StaggerItem>
            ))}
          </StaggerGrid>

          <SectionCta data={header} />
        </div>
      </section>
    </>
  );
}
