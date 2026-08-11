import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isModuleDisabled } from "@/lib/module-visibility";
import { ModuleDisabledPage } from "@/components/content/ModuleDisabledPage";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Briefcase,
  Users,
  User,
  Edit3,
  ExternalLink,
  Shield,
  Zap,
  Server,
  Check,
  Download,
  SmilePlus,
  TrendingUp,
  Building2,
  Search,
  Home,
  Palette,
  Code2,
  TestTube,
  Rocket,
  Lock,
  ShoppingCart,
  CreditCard,
  Truck,
  BarChart3,
  Brain,
  Puzzle,
} from "lucide-react";
import prisma from "@/lib/prisma";

// Icon map for dynamic rendering
const ICON_MAP: Record<string, React.ElementType> = {
  Shield, Zap, Users, Server, Check, Download, SmilePlus, TrendingUp,
  Building2, Lock, ShoppingCart, CreditCard, Truck, BarChart3, Brain, Puzzle,
  Clock, Rocket, Search, Home, Palette, Code2, TestTube, Edit3,
};

function getIcon(name: string) {
  return ICON_MAP[name] || Briefcase;
}

// Process steps (static)
const PROCESS_STEPS = [
  { icon: Search, step: "01", title: "Discovery", description: "We analyze requirements and business goals." },
  { icon: Home, step: "02", title: "Planning", description: "We create a detailed plan and define the roadmap." },
  { icon: Palette, step: "03", title: "UI/UX Design", description: "We design intuitive and user-friendly interfaces." },
  { icon: Code2, step: "04", title: "Development", description: "We build scalable, secure and high-performance apps." },
  { icon: TestTube, step: "05", title: "Testing", description: "We test thoroughly to ensure quality and security." },
  { icon: Rocket, step: "06", title: "Deployment", description: "We deploy and provide ongoing support." },
];

async function getProjectById(id: string) {
  // Try by id first, then by slug
  let project = await prisma.project.findUnique({
    where: { id },
    include: {
      customer: { select: { fullName: true, companyName: true } },
      service: { select: { serviceName: true } },
    },
  });
  if (!project) {
    project = await prisma.project.findUnique({
      where: { slug: id },
      include: {
        customer: { select: { fullName: true, companyName: true } },
        service: { select: { serviceName: true } },
      },
    });
  }
  return project;
}

async function getRelatedProjects(currentId: string) {
  return await prisma.project.findMany({
    where: { status: "Published", id: { not: currentId } },
    select: { id: true, title: true, category: true, description: true, thumbnail: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (await isModuleDisabled("project")) return <ModuleDisabledPage moduleLabel="Projects" />;
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project || project.status !== "Published") {
    notFound();
  }

  const relatedProjects = await getRelatedProjects(project.id);

  const features = (project.features as { icon: string; title: string; description: string }[]) ?? [];
  const highlights = project.highlights ?? [];
  const challenges = project.challenges ?? [];
  const solutions = project.solutions ?? [];
  const technologies = project.technologies ?? [];
  const gallery = project.gallery ?? [];
  const results = (project.results as { icon: string; value: string; label: string }[]) ?? [];

  const duration = project.startDate && project.endDate
    ? `${Math.ceil((project.endDate.getTime() - project.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))} Months`
    : null;

  return (
    <div className="bg-white">
      {/* ─── Hero ─── */}
      <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/our-projects"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              {project.category && (
                <span className="inline-block rounded-full bg-indigo-600 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  {project.category}
                </span>
              )}
              <h1 className="mt-6 text-4xl font-extrabold leading-tight text-zinc-900 sm:text-5xl">
                {project.title}
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-500">
                {project.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                  >
                    Visit Live App
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400"
                >
                  Start Similar Project
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {project.thumbnail && (
              <ProjectImageFrame
                src={project.thumbnail}
                alt={project.title}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            )}
          </div>
        </div>
      </section>

      {/* ─── Project Overview + Features ─── */}
      <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">PROJECT OVERVIEW</p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600">
                {project.overview || project.description}
              </p>

              {features.length > 0 && (
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {features.map((f) => {
                    const Icon = getIcon(f.icon);
                    return (
                      <div key={f.title} className="flex flex-col items-center rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-center">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                          <Icon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h4 className="text-sm font-bold text-zinc-900">{f.title}</h4>
                        <p className="mt-1 text-[11px] text-zinc-500">{f.description}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {highlights.length > 0 && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm h-fit">
                <h3 className="text-lg font-bold text-zinc-900">Project Highlights</h3>
                <ul className="mt-4 space-y-3">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                      <span className="text-sm text-zinc-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Challenge + Project Summary ─── */}
      <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 rounded-full bg-indigo-600" />
                <h2 className="text-2xl font-extrabold italic text-zinc-900">The Challenge</h2>
              </div>

              {challenges.length > 0 && (
                <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
                  <h4 className="mb-3 text-sm font-bold text-zinc-900">Key Challenges</h4>
                  <ul className="space-y-2.5">
                    {challenges.map((c) => (
                      <li key={c} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                        <span className="text-sm text-zinc-600">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Project Summary Card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm h-fit">
              <h3 className="text-lg font-bold text-zinc-900">Project Summary</h3>
              <div className="mt-5 space-y-5">
                {project.customer && (
                  <SummaryItem icon={User} label="CLIENT" value={project.customer.companyName || project.customer.fullName} />
                )}
                {project.category && (
                  <SummaryItem icon={Briefcase} label="INDUSTRY" value={project.category} />
                )}
                {duration && (
                  <SummaryItem icon={Clock} label="DURATION" value={duration} />
                )}
                {project.endDate && (
                  <SummaryItem icon={Calendar} label="COMPLETION" value={project.endDate.toLocaleDateString("en-US", { year: "numeric", month: "long" })} />
                )}
                {project.service && (
                  <SummaryItem icon={Edit3} label="SERVICE" value={project.service.serviceName} />
                )}
                {technologies.length > 0 && (
                  <SummaryItem icon={Code2} label="TECH STACK" value={technologies.join(", ")} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Our Solution ─── */}
      {solutions.length > 0 && (
        <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-indigo-600" />
              <h2 className="text-2xl font-extrabold italic text-zinc-900">Our Solution</h2>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {solutions.map((point) => (
                <div key={point} className="flex items-center gap-2.5">
                  <Edit3 className="h-4 w-4 shrink-0 text-indigo-600" />
                  <span className="text-sm text-zinc-700">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Results ─── */}
      {results.length > 0 && (
        <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-indigo-600" />
              <h2 className="text-2xl font-extrabold italic text-zinc-900">The Results</h2>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {results.map((r) => {
                const Icon = getIcon(r.icon);
                return (
                  <div key={r.label} className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-5 text-center shadow-sm">
                    <Icon className="mb-2 h-6 w-6 text-indigo-600" />
                    <p className="text-2xl font-extrabold text-indigo-600">{r.value}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">{r.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── Gallery ─── */}
      {gallery.length > 0 && (
        <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-indigo-600" />
              <h2 className="text-2xl font-extrabold italic text-zinc-900">Project Gallery</h2>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {gallery.map((img, idx) => (
                <ProjectImageFrame key={idx} src={img} alt={`Gallery ${idx + 1}`} sizes="(max-width: 640px) 50vw, 25vw" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Related Projects ─── */}
      {relatedProjects.length > 0 && (
        <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 rounded-full bg-indigo-600" />
                <h2 className="text-2xl font-extrabold text-zinc-900">Related Projects</h2>
              </div>
              <Link href="/our-projects" className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline">
                View All Projects →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((rp) => (
                <div key={rp.id} className="group">
                  {rp.thumbnail ? (
                    <ProjectImageFrame src={rp.thumbnail} alt={rp.title} sizes="(max-width: 640px) 100vw, 33vw" />
                  ) : (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100 shadow-inner flex items-center justify-center">
                      <Briefcase className="h-10 w-10 text-zinc-300" />
                    </div>
                  )}
                  <div className="mt-4">
                    {rp.category && (
                      <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">{rp.category}</p>
                    )}
                    <h3 className="mt-1 text-base font-bold text-zinc-900">{rp.title}</h3>
                    {rp.description && (
                      <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{rp.description}</p>
                    )}
                    <Link href={`/our-projects/${rp.id}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:gap-2.5 transition-all">
                      View Case Study <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <section className="bg-[#f6f4f3] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mx-auto max-w-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-zinc-900 sm:text-3xl">
              Have a similar project in mind?
            </h2>
            <p className="mt-3 text-sm text-zinc-500">
              Let&apos;s build something amazing together. Get in touch with our team today.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
                Start Your Project <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/our-projects" className="inline-flex items-center rounded-lg border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400">
                View More Projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Helper Components ───────────────────────────────────────────────────────

function SummaryItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
        <Icon className="h-4 w-4 text-indigo-600" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{label}</p>
        <p className="text-sm font-semibold text-zinc-900">{value}</p>
      </div>
    </div>
  );
}

/**
 * Keeps any uploaded asset fully visible. Large source files are displayed at
 * the frame's rendered size by the browser, while the quiet surface avoids
 * empty/cropped-looking edges on logos, portraits, and wide screenshots.
 */
function ProjectImageFrame({
  src,
  alt,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100 shadow-inner">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={60}
        className="object-contain p-3"
      />
    </div>
  );
}
