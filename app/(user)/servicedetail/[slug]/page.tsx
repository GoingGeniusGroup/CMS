import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createElement } from "react";
import {
  ArrowRight,
  Check,
  Smartphone,
  Zap,
  Search,
  ShieldCheck,
  RefreshCw,
  Puzzle,
  Code2,
  Palette,
  Cloud,
  Megaphone,
  Lightbulb,
} from "lucide-react";
import { getServiceBySlug, getPublicServices } from "@/app/actions/services";
import { TiptapRenderer } from "@/components/TiptapRenderer";
import type { JSONContent } from "@tiptap/react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Development: Code2,
  Design: Palette,
  Marketing: Megaphone,
  Infrastructure: Cloud,
  Mobile: Smartphone,
};

const heroChecks = ["Custom Solutions", "Modern Technologies", "Scalable & Secure", "SEO Friendly"];

const missionStats = [
  { value: "250+", label: "Projects Completed" },
  { value: "180+", label: "Happy Clients" },
  { value: "25+", label: "Expert Developers" },
  { value: "98%", label: "Client Satisfaction" },
];

const processSteps = [
  { num: "01", label: "Discovery", desc: "Understanding your requirements" },
  { num: "02", label: "Planning", desc: "Strategy and project planning" },
  { num: "03", label: "Design", desc: "UI/UX design and prototyping" },
  { num: "04", label: "Development", desc: "Building with clean code" },
  { num: "05", label: "Testing", desc: "Quality assurance and testing" },
  { num: "06", label: "Deployment", desc: "Launching and ongoing support" },
];

const features = [
  { icon: Smartphone, title: "Responsive Design", desc: "Perfectly responsive websites that look great on all devices, from desktop to mobile." },
  { icon: Zap, title: "High Performance", desc: "Optimized for speed and performance to ensure the best user experience and engagement." },
  { icon: Search, title: "SEO Friendly", desc: "Clean code and best SEO practices to help your website rank higher on search engines." },
  { icon: ShieldCheck, title: "Secure & Reliable", desc: "We follow best security practices to keep your website and user data safe." },
  { icon: RefreshCw, title: "Scalable Solutions", desc: "Our solutions grow with your business and adapt to your future technology needs." },
  { icon: Puzzle, title: "Custom Development", desc: "Tailored solutions built specifically for your unique business requirements." },
];

function extractPreview(text: string | null): string {
  if (!text) return "";
  if (!text.startsWith('{"type":"doc"')) return text;
  try {
    const json = JSON.parse(text);
    const parts: string[] = [];
    function walk(nodes: unknown[] | undefined) {
      if (!nodes) return;
      for (const node of nodes as { type?: string; text?: string; content?: unknown[] }[]) {
        if (node.text) parts.push(node.text);
        if (node.content) walk(node.content);
      }
    }
    walk(json.content);
    return parts.join(" ").replace(/\s+/g, " ").trim();
  } catch {
    return text;
  }
}

function isRichContent(text: string | null): text is string {
  return !!text && text.startsWith('{"type":"doc"');
}

function getCategoryIcon(category: string | null): React.ElementType {
  return CATEGORY_ICONS[category || ""] || Code2;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getPublicServices();
  return services.map((s) => ({
    slug: s.serviceName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
  }));
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const Icon = getCategoryIcon(service.category);
  const plainDescription = extractPreview(service.description);
  const richContent = isRichContent(service.description) ? (JSON.parse(service.description) as JSONContent) : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            {service.category && (
              <span className="inline-block rounded-md bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-600">
                {service.category}
              </span>
            )}
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
              {service.serviceName}
              <br />
              <span className="text-indigo-600">Solutions</span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500">
              {plainDescription || "Professional service tailored to your business needs."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                Get a Free Consultation
              </Link>
              <Link href="/our-projects" className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-indigo-600 transition hover:border-indigo-300">
                View Our Work
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 sm:flex sm:flex-wrap sm:gap-5">
              {heroChecks.map((c) => (
                <span key={c} className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                  <Check className="h-3.5 w-3.5 text-indigo-600" /> {c}
                </span>
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            {service.thumbnailUrl ? (
              <Image src={service.thumbnailUrl} alt={service.serviceName} fill sizes="100vw" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-indigo-50">
                {createElement(Icon, { className: "h-20 w-20 text-indigo-300", strokeWidth: 1.5 })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mission / Stats */}
      <section className="border-t border-gray-100">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src="/mission.png" alt="Designer at work" fill className="object-cover" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Overview</p>
              <h2 className="mt-2 text-3xl font-extrabold leading-snug text-gray-900">
                Delivering High-Performance {service.serviceName}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-500">
                At Going Genius, we deliver top-notch {service.serviceName.toLowerCase()} solutions
                tailored to your business needs. Our expert team combines cutting-edge technology with
                proven methodologies to drive exceptional results.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {missionStats.map((s) => (
                  <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <p className="text-2xl font-extrabold text-indigo-600">{s.value}</p>
                    <p className="mt-1 text-[10px] font-semibold uppercase leading-tight tracking-wide text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rich Description */}
      {richContent && (
        <section className="border-t border-gray-100">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-indigo-600">
              Service Details
            </p>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
              What We Offer
            </h2>
            <div className="prose prose-sm sm:prose-base max-w-none mx-auto mt-10">
              <TiptapRenderer content={richContent} />
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="border-t border-gray-100">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-indigo-600">
            Key Features
          </p>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Excellence in Every Detail
          </h2>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-gray-200 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-gray-900">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-gray-100">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-indigo-600">
            Our Development Process
          </p>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            How We Bring Your Ideas To Life
          </h2>

          <div className="relative mt-16">
            <div className="absolute left-[8%] right-[8%] top-6 hidden border-t-2 border-dashed border-gray-200 sm:block" />
            <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
              {processSteps.map((step, i) => {
                const isLast = i === processSteps.length - 1;
                return (
                  <div key={step.num} className="relative flex flex-col items-center text-center">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${isLast ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-indigo-50 text-indigo-600"}`}>
                      {step.num}
                    </span>
                    <p className="mt-3 text-sm font-bold text-gray-900">{step.label}</p>
                    <p className="mt-1 max-w-[110px] text-[11px] leading-snug text-gray-400">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Other Services */}
      <OtherServices currentSlug={slug} />

      {/* CTA */}
      <section className="border-t border-gray-100">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-xl border border-gray-200 px-6 py-8 sm:px-10">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Lightbulb className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                  Ready to build your dream website?
                </h2>
                <p className="mt-1.5 max-w-md text-sm text-gray-500">
                  Let&apos;s discuss your project and bring your ideas to life with our expert team.
                </p>
              </div>
            </div>
            <Link href="/contact" className="flex shrink-0 items-center gap-1.5 rounded-lg bg-gray-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-gray-900">
              Get a Free Consultation <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

async function OtherServices({ currentSlug }: { currentSlug: string }) {
  const allServices = await getPublicServices();
  const others = allServices.filter((s) =>
    s.serviceName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") !== currentSlug
  ).slice(0, 3);

  if (others.length === 0) return null;

  return (
    <section className="border-t border-gray-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-indigo-600">Other Services</p>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Explore More Services
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((svc) => {
            const SvgIcon = getCategoryIcon(svc.category);
            const plainDesc = extractPreview(svc.description);
            return (
              <Link
                key={svc.id}
                href={`/servicedetail/${svc.serviceName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                className="group rounded-xl border border-gray-200 p-6 transition hover:shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <SvgIcon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-gray-900">{svc.serviceName}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500 line-clamp-2">
                  {plainDesc || "Professional service tailored to your needs."}
                </p>
                <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                  Learn More <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
