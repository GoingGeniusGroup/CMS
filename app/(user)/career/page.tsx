"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Bookmark, Briefcase, ChevronDown, Clock, MapPin } from "lucide-react";
import { getPublicJobs, type JobRow } from "@/app/actions/jobs";
import { getSection, type SiteContentSection } from "@/app/actions/site-content";
import { PageHero } from "@/components/content/PageHero";
import { SECTION_REGISTRY } from "@/lib/content/schemas";
import { useModuleDisabled } from "@/components/content/PublicModuleVisibilityProvider";
import { ModuleDisabledPage } from "@/components/content/ModuleDisabledPage";

// ─── Data ─────────────────────────────────────────────────────────────────────

// ─── Job Card ─────────────────────────────────────────────────────────────────

function JobCard({ job }: { job: JobRow }) {
  const router = useRouter();
  return (
    <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-500">{job.department}</span>
        <button type="button" aria-label="Bookmark" className="text-zinc-400 hover:text-indigo-500">
          <Bookmark className="h-4 w-4" />
        </button>
      </div>
      <h3 className="mt-2 text-base font-extrabold text-zinc-900">{job.title}</h3>
      <div className="mt-1 flex flex-wrap gap-3 text-xs text-zinc-500">
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.type}</span>
        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.mode}</span>
      </div>
      <p className="mt-3 flex-1 text-xs leading-relaxed text-zinc-500">{job.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.tags.map((t) => (
          <span key={t} className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">{t}</span>
        ))}
      </div>
      <button
        type="button"
        onClick={() => router.push(`/career/apply?jobId=${job.id}`)}
        className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 py-2 text-sm font-semibold text-zinc-800 transition-colors hover:border-indigo-400 hover:text-indigo-600"
      >
        Apply Now <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Open Positions ───────────────────────────────────────────────────────────

function OpenPositions({ jobs }: { jobs: JobRow[] }) {
  const [activeDept, setActiveDept] = useState("All Departments");
  const [deptOpen, setDeptOpen] = useState(false);

  const depts = ["All Departments", ...new Set(jobs.map((j) => j.department).filter(Boolean))];

  const filtered = activeDept === "All Departments" ? jobs : jobs.filter((j) => j.department === activeDept);

  return (
    <section className="bg-white px-4 py-14 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-900 sm:text-3xl">Open Positions</h2>
            <p className="mt-1 text-sm text-zinc-500">Explore opportunities to make an impact.</p>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setDeptOpen((v) => !v)}
              className="inline-flex min-w-[160px] items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
            >
              {activeDept}
              <ChevronDown className={`h-4 w-4 transition-transform ${deptOpen ? "rotate-180" : ""}`} />
            </button>
            {deptOpen && (
              <div className="absolute right-0 top-full z-20 mt-1 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
                {depts.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => { setActiveDept(dept); setDeptOpen(false); }}
                    className={`block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${activeDept === dept ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((job) => <JobCard key={job.id} job={job} />)}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 flex flex-col items-center gap-3 text-center">
            <Briefcase className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">No open positions in this department right now.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Life at Going Genius ─────────────────────────────────────────────────────

function LifeSection() {
  return (
    <section className="bg-white px-4 pb-16 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 text-2xl font-extrabold text-zinc-900 sm:text-3xl">
          Life at Going Genius
        </h2>

        <div className="grid gap-4" style={{ gridTemplateColumns: "2fr 1fr", gridTemplateRows: "1fr 1fr", height: 460 }}>

          {/* career2 — large left, spans 2 rows, object-cover with label */}
          <div className="relative overflow-hidden rounded-2xl shadow-sm" style={{ gridRow: "1 / 3" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/career2.png"
              alt="Collaborative Environment"
              className="h-full w-full object-cover object-center"
            />
            <span className="absolute bottom-4 left-4 text-sm font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              Collaborative Environment
            </span>
          </div>

          {/* career3 — top right, full image, no border, no gap */}
          <div className="overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/career3.png"
              alt="Team"
              style={{ width: "100%", height: "100%", objectFit: "fill", display: "block" }}
            />
          </div>

          {/* career4 — bottom right, dark scene, object-cover */}
          <div className="overflow-hidden rounded-2xl shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/career4.png"
              alt="Night Coding"
              className="h-full w-full object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CareerPage() {
  const moduleHidden = useModuleDisabled("job");
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [heroSection, setHeroSection] = useState<SiteContentSection<"career.hero">>({
    sectionKey: "career.hero",
    pageKey: "career",
    variant: "default",
    isVisible: true,
    order: SECTION_REGISTRY["career.hero"].defaultOrder,
    data: SECTION_REGISTRY["career.hero"].defaultData,
  });

  useEffect(() => {
    getPublicJobs().then((data) => setJobs(data));
    // Client-side fetch (not a server-rendered prop) because this whole page
    // is already "use client" for its interactive job filtering — matching
    // the existing getPublicJobs pattern rather than splitting the page into
    // a server wrapper + client sub-component for one section.
    getSection("career", "career.hero").then((section) => setHeroSection(section));
  }, []);

  if (moduleHidden) return <ModuleDisabledPage moduleLabel="Careers" />;

  return (
    <>
      <PageHero data={heroSection.data} />
      <OpenPositions jobs={jobs} />
      <LifeSection />
    </>
  );
}
