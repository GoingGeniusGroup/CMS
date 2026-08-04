"use client";

import { useState, useEffect } from "react";
import { getPublicServices } from "@/app/actions/services";
import { ServiceDetailModal } from "@/components/ServiceDetailModal";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { ShowcaseCard } from "@/components/ShowcaseCard";
import { SectionHeader, SectionCta } from "@/components/content/SectionHeader";
import { SECTION_REGISTRY, type SectionHeaderData } from "@/lib/content/schemas";
import { tiptapToPlainText } from "@/lib/tiptap-text";

type ServiceData = {
  id: string;
  serviceName: string;
  description: string | null;
  category: string | null;
  thumbnailUrl: string | null;
  isFeatured: boolean;
};

function serviceSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function LandingServicesSection({
  initialServices,
  headerData,
}: {
  initialServices?: ServiceData[];
  /** Falls back to the registry default (today's hardcoded copy) if omitted. */
  headerData?: SectionHeaderData;
}) {
  const [services, setServices] = useState<ServiceData[]>(initialServices ?? []);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const header = headerData ?? SECTION_REGISTRY["home.services"].defaultData;

  useEffect(() => {
    if (!initialServices) {
      getPublicServices().then((data) => setServices(data));
    }
  }, [initialServices]);

  if (services.length === 0) return null;

  return (
    <>
      <section id="services" className="bg-[#f6f4f3] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader className="mb-12" data={header} />

          <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.slice(0, 4).map((service) => (
              <StaggerItem key={service.id}>
                <ShowcaseCard
                  title={service.serviceName}
                  description={tiptapToPlainText(service.description) || "Professional service tailored to your needs."}
                  imageUrl={service.thumbnailUrl}
                  actionLabel="Learn More"
                  onClick={() => setSelectedService(service)}
                />
              </StaggerItem>
            ))}
          </StaggerGrid>

          <SectionCta data={header} />
        </div>
      </section>

      <ServiceDetailModal
        open={!!selectedService}
        service={selectedService}
        serviceHref={selectedService ? `/servicedetail/${serviceSlug(selectedService.serviceName)}` : undefined}
        onClose={() => setSelectedService(null)}
      />
    </>
  );
}
