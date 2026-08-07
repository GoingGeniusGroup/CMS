"use client";

import { Globe } from "lucide-react";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { ShowcaseCard } from "@/components/ShowcaseCard";
import { CATEGORY_ICONS } from "@/lib/service-category-icons";
import { tiptapToPlainText } from "@/lib/tiptap-text";
import { serviceSlug } from "@/lib/service-slug";

type ServiceData = {
  id: string;
  serviceName: string;
  description: string | null;
  category: string | null;
  thumbnailUrl: string | null;
  isFeatured: boolean;
};

export function ServicesGrid({ services }: { services: ServiceData[] }) {
  return (
    <section id="services-we-provide" className="bg-white px-4 py-20 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
            SERVICES WE PROVIDE
          </p>
        </RevealOnScroll>

        <StaggerGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = CATEGORY_ICONS[service.category || ""] || Globe;
            return (
              <StaggerItem key={service.id}>
                <ShowcaseCard
                  title={service.serviceName}
                  description={tiptapToPlainText(service.description) || "Professional service tailored to your needs."}
                  imageUrl={service.thumbnailUrl}
                  actionLabel="Learn More"
                  href={`/servicedetail/${serviceSlug(service.serviceName)}`}
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                      <Icon className="h-12 w-12 text-white/40" strokeWidth={1.5} />
                    </div>
                  }
                />
              </StaggerItem>
            );
          })}
        </StaggerGrid>

        {services.length === 0 && (
          <p className="py-10 text-center text-sm text-zinc-400">
            No services available yet. Check back soon!
          </p>
        )}
      </div>
    </section>
  );
}
