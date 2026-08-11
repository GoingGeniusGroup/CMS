"use client";

import { Globe } from "lucide-react";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { ShowcaseCard } from "@/components/ShowcaseCard";
import { CATEGORY_ICONS } from "@/lib/service-category-icons";
import { tiptapToPlainText } from "@/lib/tiptap-text";
import { serviceSlug } from "@/lib/service-slug";
import { SectionHeader } from "@/components/content/SectionHeader";
import type { SectionHeaderData } from "@/lib/content/schemas";

type ServiceData = {
  id: string;
  serviceName: string;
  description: string | null;
  category: string | null;
  thumbnailUrl: string | null;
  isFeatured: boolean;
};

export function FeaturedServicesGrid({ services, headerData }: { services: ServiceData[]; headerData?: SectionHeaderData }) {
  const featured = services.filter((s) => s.isFeatured);

  if (featured.length === 0) return null;

  return (
    <section className="bg-[#f8f9ff] px-4 py-20 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {headerData ? (
          <SectionHeader className="mb-12 text-center" data={headerData} />
        ) : (
          <RevealOnScroll className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">WHAT WE DO</p>
            <h2 className="mt-2 text-3xl font-extrabold text-zinc-900">Our <span className="text-indigo-600">Digital Services</span></h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-500">We build digital products and services that help you grow, scale and succeed in the digital world.</p>
          </RevealOnScroll>
        )}

        <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((svc) => {
            const Icon = CATEGORY_ICONS[svc.category || ""] || Globe;
            return (
              <StaggerItem key={svc.id}>
                <ShowcaseCard
                  title={svc.serviceName}
                  description={tiptapToPlainText(svc.description) || "Professional service tailored to your needs."}
                  imageUrl={svc.thumbnailUrl}
                  actionLabel="Learn More"
                  href={`/servicedetail/${serviceSlug(svc.serviceName)}`}
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
      </div>
    </section>
  );
}
