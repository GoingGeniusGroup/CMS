"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getPublicFaqs } from "@/app/actions/faq";
import { SECTION_REGISTRY, type SectionHeaderData } from "@/lib/content/schemas";
import { useModuleDisabled } from "@/components/content/PublicModuleVisibilityProvider";

type FaqItem = { question: string; answer: string; category: string };

export function FaqSection({
  initialFaqs,
  headerData,
}: {
  initialFaqs?: FaqItem[];
  /** From the "shared.faq" section — also shown on /home and /company. */
  headerData?: SectionHeaderData;
}) {
  const moduleHidden = useModuleDisabled("faq");
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs ?? []);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const header = headerData ?? SECTION_REGISTRY["shared.faq"].defaultData;

  useEffect(() => {
    if (!initialFaqs) {
      getPublicFaqs().then(setFaqs);
    }
  }, [initialFaqs]);

  if (moduleHidden || faqs.length === 0) return null;

  const grouped = faqs.reduce<Record<string, FaqItem[]>>((acc, faq) => {
    const cat = faq.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {});

  const categories = Object.keys(grouped);
  const selected = activeCategory && grouped[activeCategory] ? activeCategory : categories[0];
  const items = grouped[selected] ?? [];

  return (
    <section className="bg-[#f6f4f3] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {header.eyebrow && (
          <p className="text-center text-xs font-bold uppercase tracking-widest text-indigo-600">
            {header.eyebrow}
          </p>
        )}
        <h2 className="mt-2 text-center text-3xl font-extrabold text-zinc-900">{header.heading}</h2>

        {/* Category filter pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {categories.map((category) => {
            const isActive = category === selected;
            return (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setOpen(null);
                }}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "border border-zinc-200 bg-white text-zinc-700 hover:border-indigo-300"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Accordion cards for the selected category */}
        <div className="mt-8 space-y-4">
          {items.map((item, i) => {
            const idx = `${selected}-${i}`;
            const isOpen = open === idx;
            return (
              <div key={idx} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                <button
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left text-base font-bold text-zinc-900"
                >
                  {item.question}
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-indigo-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-indigo-600" />
                  )}
                </button>
                {isOpen && (
                  <p className="px-6 pb-6 text-sm leading-relaxed text-zinc-500">{item.answer}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
