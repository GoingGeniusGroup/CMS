import Image from "next/image";
import Link from "next/link";
import { images } from "@/lib/images";
import { LandingServicesSection } from "@/components/LandingServicesSection";
import { LandingFeaturedProjects } from "@/components/LandingFeaturedProjects";
import { LandingBlogSection } from "@/components/LandingBlogSection";
import { LandingTeamSection } from "@/components/LandingTeamSection";
import { LandingPartnersSection } from "@/components/LandingPartnersSection";
import { LandingTechSection } from "@/components/LandingTechSection";
import { FaqSection } from "@/components/FaqSection";
import { getPublicPartners } from "@/app/actions/settings";
import { getPublicTechnologies } from "@/app/actions/public-settings";
import { getPublicServices } from "@/app/actions/services";
import { getPublicProjects } from "@/app/actions/projects";
import { getPublicBlogs } from "@/app/actions/blogs";
import { getPublicTeamMembers } from "@/app/actions/team";
import { getPublicFaqs } from "@/app/actions/faq";

// ΓöÇΓöÇΓöÇ Hero ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

function Hero() {
  return (
    <section id="home" className="border-b border-zinc-100 bg-[#f6f4f3] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 rounded-3xl border-2 border-indigo-500/70 bg-white p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-5xl">
              Think Bigger,
              <br />
              <span className="text-indigo-600">Build Smarter</span>,
              <br />
              Scale Faster
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-500">
              Going Genius turns your ideas into something bigger, smarter, and
              more impactful. Let&apos;s connect and bring your vision to life ΓÇö
              better than you imagined.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Get Started.
              </a>
              <a
                href="#services"
                className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400"
              >
                Learn More
              </a>
            </div>

            <div className="mt-8">
              <p className="mb-2 text-xs font-semibold text-zinc-500">Our Top Products</p>
              <Image
                src={images.frame1}
                alt="Our top products"
                width={300}
                height={60}
                className="h-12 w-auto"
                style={{ width: "auto" }}
              />
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={images.picture1}
              alt="Developer building a digital product"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Featured Works ───────────────────────────────────────────────────────────

function Products() {
  return (
    <section id="products" className="bg-[#f6f4f3] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Products</p>
            <h2 className="mt-2 text-2xl font-extrabold text-zinc-900">Products and Solutions</h2>
          </div>
          <a href="#contact" className="text-sm font-semibold text-indigo-600 hover:underline">
            Contact Sales
          </a>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Growth Analytics",
              desc: "Live dashboards and reporting for business performance and customer insights.",
            },
            {
              title: "Campaign Automation",
              desc: "Automated workflows that convert leads and keep customers engaged.",
            },
            {
              title: "Customer Portal",
              desc: "Secure, branded portals for customers to manage accounts and requests.",
            },
          ].map((product) => (
            <div key={product.title} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-zinc-900">{product.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">{product.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ─── FAQ ───────────────────────────────────────────────────────────────────
// (dynamic content from database — see FaqSection component)

// ΓöÇΓöÇΓöÇ Page ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export default async function Page() {
  const [rawPartners, rawTechnologies, rawServices, rawProjects, rawBlogs, rawTeam, rawFaqs] = await Promise.all([
    getPublicPartners(),
    getPublicTechnologies(),
    getPublicServices(),
    getPublicProjects(),
    getPublicBlogs(),
    getPublicTeamMembers(),
    getPublicFaqs(),
  ]);

  // Serialize Date objects to strings for client component props
  const partners = JSON.parse(JSON.stringify(rawPartners));
  const technologies = JSON.parse(JSON.stringify(rawTechnologies));
  const services = JSON.parse(JSON.stringify(rawServices));
  const projects = JSON.parse(JSON.stringify(rawProjects));
  const blogs = JSON.parse(JSON.stringify(rawBlogs));
  const team = JSON.parse(JSON.stringify(rawTeam));
  const faqs = JSON.parse(JSON.stringify(rawFaqs));

  return (
    <>
      <Hero />
      <LandingPartnersSection initialPartners={partners} />
      <LandingTechSection initialTechnologies={technologies} />
      <LandingServicesSection initialServices={services} />
      <Products />
      <LandingFeaturedProjects initialProjects={projects} />
      <LandingBlogSection initialBlogs={blogs} />
      <LandingTeamSection initialMembers={team} />
      <FaqSection initialFaqs={faqs} />
    </>
  );
}