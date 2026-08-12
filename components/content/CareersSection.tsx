"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";
import type { CareersData } from "@/lib/content/schemas";
import { IconRenderer } from "@/components/content/IconRenderer";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { usePublicLabelResolver } from "@/components/content/PublicLabelProvider";
import type { JobRow } from "@/app/actions/jobs";

/**
 * Company page "Join Our Team" block (Phase 4) driven by `careersSectionSchema`:
 * editable eyebrow/heading/copy/culture points/button on the left — with the
 * button now a real link to `/career` (the old hardcoded version went nowhere)
 * — plus the live Open Positions panel fed by `jobs` on the right.
 */
export function CareersSection({ data, jobs }: { data: CareersData; jobs: JobRow[] }) {
  const resolveLabel = usePublicLabelResolver();

  return (
    <section className="border-t border-gray-100 bg-gray-50/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2">
          <RevealOnScroll>
            {data.eyebrow && (
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                {resolveLabel(data.eyebrow)}
              </p>
            )}
            <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              {resolveLabel(data.heading)}
            </h2>
            {data.copy && (
              <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500">
                {resolveLabel(data.copy)}
              </p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
              {data.cultureItems.map((item) => {
                return (
                  <div key={item.title} className="flex gap-2.5">
                    {item.iconName && (
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                        <IconRenderer name={item.iconName} className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-gray-800">
                        {resolveLabel(item.title)}
                      </p>
                      {item.description && (
                        <p className="text-[11px] leading-snug text-gray-500">
                          {resolveLabel(item.description)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {data.buttonLabel && (
              <Link
                href={data.buttonHref || "/career"}
                className="mt-7 inline-block rounded-full bg-indigo-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-indigo-700"
              >
                {resolveLabel(data.buttonLabel)} →
              </Link>
            )}
          </RevealOnScroll>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-gray-900">Open Positions</p>
            <div className="mt-4 flex flex-col gap-3">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                        <Briefcase className="h-4 w-4" />
                      </span>
                      <p className="text-xs font-semibold text-gray-800">{job.title}</p>
                    </div>
                    <Link
                      href={`/career/apply?jobId=${job.id}`}
                      className="shrink-0 rounded-full border border-indigo-600/30 px-3 py-1.5 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-100"
                    >
                      Apply Now →
                    </Link>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-xs text-gray-400">
                  No open positions right now.
                </p>
              )}
            </div>
            <Link
              href="/career"
              className="mt-4 block text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View All Openings →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}