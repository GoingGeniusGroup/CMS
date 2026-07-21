"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getPublicFaqs } from "@/app/actions/faq";

type FaqItem = { question: string; answer: string; category: string };

export function FaqSection() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    getPublicFaqs().then(setFaqs);
  }, []);

  if (faqs.length === 0) return null;

  const grouped = faqs.reduce<Record<string, FaqItem[]>>((acc, faq) => {
    const cat = faq.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {});

  return (
    <section className="bg-[#f6f4f3] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-indigo-600">Support</p>
        <h2 className="mt-2 text-center text-2xl font-extrabold text-zinc-900">Frequently Asked Questions</h2>

        <div className="mt-10 space-y-10">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">{category}</h3>
              <div className="space-y-3">
                {items.map((item, i) => {
                  const idx = `${category}-${i}`;
                  const isOpen = open === idx;
                  return (
                    <div key={idx} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                      <button
                        onClick={() => setOpen(isOpen ? null : idx)}
                        className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold text-zinc-900"
                      >
                        {item.question}
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 shrink-0 text-indigo-600" />
                        ) : (
                          <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" />
                        )}
                      </button>
                      {isOpen && (
                        <p className="px-5 pb-4 text-sm leading-relaxed text-zinc-500">{item.answer}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
