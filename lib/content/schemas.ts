import { z } from "zod";

/**
 * Zod schemas for every editable public-site section, plus the registry that
 * maps each `sectionKey` to its schema, a human label for the editor UI, which
 * page it belongs to, and the default payload matching today's hardcoded copy.
 *
 * This registry is the single source of truth: `prisma/seed-site-content.ts`
 * seeds from it, the Landing Page editor (Phase 17) renders forms from it, and
 * `getSection` (Task 11) validates reads against it. Adding a new section type
 * means adding one entry here — no other file needs to know about it.
 */

// ─── Section-header schema ───────────────────────────────────────────────────
// Covers every "eyebrow + heading + optional subheading" section: Services,
// Featured Projects, Blog, Team, FAQ. Also used standalone by Partners/Tech,
// which only render the `heading` field.

export const sectionHeaderSchema = z.object({
  eyebrow: z.string().max(80).optional(),
  heading: z.string().min(1, "Heading is required").max(200),
  subheading: z.string().max(400).optional(),
  ctaLabel: z.string().max(60).optional(),
  ctaHref: z
    .string()
    .max(300)
    .optional()
    .refine((v) => !v || v.startsWith("/") || v.startsWith("#") || v.startsWith("http"), {
      message: "Link must be a path (/...), an anchor (#...), or a full URL",
    }),
});

export type SectionHeaderData = z.infer<typeof sectionHeaderSchema>;

// ─── Hero schema ──────────────────────────────────────────────────────────────
// One shape serves every hero variant (Task 16, Phase 18); only `home` uses it
// today. `highlightedWord` lets "Build Smarter" keep its accent color without
// the admin needing to hand-author HTML/markup in a text field.

export const heroStatSchema = z.object({
  value: z.string().min(1).max(20),
  label: z.string().min(1).max(60),
  /** Name from `lib/content/hero-icons.ts`'s registry; omit for no icon. */
  iconName: z.string().max(40).optional(),
});

/**
 * `layout` selects one of `PageHero`'s four variants (Task 16, Phase 18):
 *  - "split"    — heading+CTAs left, image right (home, contact, about-us, company)
 *  - "centered" — everything centered, no image (career, blogs — image-as-backdrop
 *                 cases are handled by `backdropImageUrl` instead)
 *  - "minimal"  — heading only, no subheading/CTAs/image (lightweight pages)
 *  - "stats"    — split layout plus a stat-card row underneath (our-services)
 * Defaults to "split" so existing un-migrated callers behave like today's home hero.
 */
export const heroSchema = z.object({
  layout: z.enum(["split", "centered", "minimal", "stats"]).default("split"),
  eyebrow: z.string().max(80).optional(),
  headingLines: z.array(z.string().max(80)).min(1).max(4),
  highlightedWord: z.string().max(40).optional(),
  subheading: z.string().max(400).optional(),
  primaryCtaLabel: z.string().max(60).optional(),
  primaryCtaHref: z.string().max(300).optional(),
  /** Some existing heroes show an arrow icon after the primary CTA, some don't. */
  primaryCtaShowArrow: z.boolean().default(false),
  secondaryCtaLabel: z.string().max(60).optional(),
  secondaryCtaHref: z.string().max(300).optional(),
  imageUrl: z.string().max(500).optional(),
  imageAlt: z.string().max(200).optional(),
  /** Full-bleed background image behind a "centered" hero (e.g. career page). */
  backdropImageUrl: z.string().max(500).optional(),
  /**
   * "split" layout only: wraps the two columns in a bordered card on a tinted
   * section background (the original home hero's look) instead of a plain
   * white section. Kept as a flag rather than a fifth layout value, since
   * every other "split" hero (contact, about-us, blogs, company) uses the
   * plain white version.
   */
  cardStyle: z.boolean().default(false),
  /** Only rendered by the "stats" layout, as a row of cards below the fold. */
  stats: z.array(heroStatSchema).max(6).optional(),
  /**
   * "split" layout only: a single stat badge floating over the corner of the
   * hero image (e.g. "5+ Years of Excellence" on the about-us hero). Distinct
   * from `stats` (a full row below the whole hero) — this is one badge
   * overlaid on the image itself.
   */
  imageBadge: heroStatSchema.pick({ value: true, label: true }).optional(),
  /** Small icon+text line below the CTAs (e.g. "24-hour response promise"). */
  microcopy: z.string().max(120).optional(),
});

export type HeroData = z.infer<typeof heroSchema>;
export type HeroStat = z.infer<typeof heroStatSchema>;

// ─── Repeatable cards schema ──────────────────────────────────────────────────
// Used by the homepage "Products and Solutions" grid today; generic enough for
// any future admin-managed card grid (Task 15, Phase 17).

export const cardItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(120),
  description: z.string().max(400).optional(),
  iconName: z.string().max(60).optional(),
  imageUrl: z.string().max(500).optional(),
  href: z.string().max(300).optional(),
});

export const cardsSchema = z.object({
  eyebrow: z.string().max(80).optional(),
  heading: z.string().max(200).optional(),
  ctaLabel: z.string().max(60).optional(),
  ctaHref: z.string().max(300).optional(),
  items: z.array(cardItemSchema).max(24),
});

export type CardsData = z.infer<typeof cardsSchema>;
export type CardItem = z.infer<typeof cardItemSchema>;

// ─── Section registry ─────────────────────────────────────────────────────────

/**
 * Discriminates which editor form a section renders (Phase 17, Task 14).
 * Kept separate from the zod schema itself rather than relying on schema
 * reference-equality, so the editor's form-selection logic can't silently
 * break if a schema is ever refactored/wrapped.
 */
export type SectionKind = "hero" | "sectionHeader" | "cards";

type SectionRegistryEntry<T> = {
  pageKey: string;
  label: string;
  kind: SectionKind;
  schema: z.ZodType<T>;
  defaultOrder: number;
  defaultData: T;
};

/**
 * Accepts `defaultData` in the schema's *input* shape (so a registry entry
 * only needs to set the fields it actually cares about — e.g. `layout` and
 * `headingLines` — and every zod `.default()` field like `primaryCtaShowArrow`
 * or `cardStyle` gets filled in automatically) but stores the fully-resolved
 * *output* shape, via `schema.parse()`. Every downstream consumer of the
 * registry (seeding, reads, the editor) sees complete, defaulted objects.
 *
 * `z.input<>`/`z.output<>` diverge specifically because of `.default()`
 * fields being optional-in / required-out — without this, adding any new
 * defaulted field to `heroSchema` would force every existing registry entry
 * to be updated to explicitly set it, which is exactly the churn this avoids.
 */
function defineSection<T>(entry: {
  pageKey: string;
  label: string;
  kind: SectionKind;
  schema: z.ZodType<T>;
  defaultOrder: number;
  defaultData: z.input<z.ZodType<T>>;
}): SectionRegistryEntry<T> {
  return { ...entry, defaultData: entry.schema.parse(entry.defaultData) };
}

export const SECTION_REGISTRY = {
  "home.hero": defineSection<HeroData>({
    pageKey: "home",
    label: "Hero",
    kind: "hero",
    schema: heroSchema,
    defaultOrder: 0,
    defaultData: {
      layout: "split",
      cardStyle: true,
      headingLines: ["Think Bigger,", "Build Smarter,", "Scale Faster"],
      highlightedWord: "Build Smarter",
      subheading:
        "Going Genius turns your ideas into something bigger, smarter, and more impactful. Let's connect and bring your vision to life — better than you imagined.",
      primaryCtaLabel: "Get Started.",
      primaryCtaHref: "#contact",
      primaryCtaShowArrow: false,
      secondaryCtaLabel: "Learn More",
      secondaryCtaHref: "#services",
      imageAlt: "Developer building a digital product",
    },
  }),

  "home.partners": defineSection<SectionHeaderData>({
    pageKey: "home",
    label: "Partners strip heading",
    kind: "sectionHeader",
    schema: sectionHeaderSchema,
    defaultOrder: 1,
    defaultData: { heading: "Our Partners" },
  }),

  "home.tech": defineSection<SectionHeaderData>({
    pageKey: "home",
    label: "Logo showcase heading",
    kind: "sectionHeader",
    schema: sectionHeaderSchema,
    defaultOrder: 2,
    defaultData: { heading: "Trusted & Recognized By" },
  }),

  "home.services": defineSection<SectionHeaderData>({
    pageKey: "home",
    label: "Services section header",
    kind: "sectionHeader",
    schema: sectionHeaderSchema,
    defaultOrder: 3,
    defaultData: {
      eyebrow: "Our {{service.plural}}",
      heading: "What We Do Best",
      subheading: "End-to-end digital solutions to help your business grow and scale.",
      ctaLabel: "View All {{service.plural}}",
      ctaHref: "/our-services",
    },
  }),

  "home.products": defineSection<CardsData>({
    pageKey: "home",
    label: "Products and Solutions cards",
    kind: "cards",
    schema: cardsSchema,
    defaultOrder: 4,
    defaultData: {
      eyebrow: "Products",
      heading: "Products and Solutions",
      ctaLabel: "Contact Sales",
      ctaHref: "#contact",
      items: [
        {
          id: "growth-analytics",
          title: "Growth Analytics",
          description: "Live dashboards and reporting for business performance and customer insights.",
        },
        {
          id: "campaign-automation",
          title: "Campaign Automation",
          description: "Automated workflows that convert leads and keep customers engaged.",
        },
        {
          id: "customer-portal",
          title: "Customer Portal",
          description: "Secure, branded portals for customers to manage accounts and requests.",
        },
      ],
    },
  }),

  "home.projects": defineSection<SectionHeaderData>({
    pageKey: "home",
    label: "Featured projects section header",
    kind: "sectionHeader",
    schema: sectionHeaderSchema,
    defaultOrder: 5,
    defaultData: {
      eyebrow: "Featured Works",
      heading: "Recent Success Stories",
      subheading: "Explore our latest {{project.plural|lower}} and see how we help businesses grow.",
      ctaLabel: "View All {{project.plural}}",
      ctaHref: "/our-projects",
    },
  }),

  "home.blog": defineSection<SectionHeaderData>({
    pageKey: "home",
    label: "Blog section header",
    kind: "sectionHeader",
    schema: sectionHeaderSchema,
    defaultOrder: 6,
    defaultData: {
      eyebrow: "Insights",
      heading: "Industry Perspectives",
      subheading: "Stay ahead with the latest trends, tips, and insights.",
      // NOTE: intentionally NOT tokenized to "{{blog.plural}}" — the entity
      // label's plural is "Blogs", but this page's actual copy has always
      // said "Articles" (a blog is displayed there, but "Articles" is the
      // reader-facing word for it). Tokenizing would silently change the
      // default rendered text, which violates R8 (no visual change without
      // an explicit edit). Left as a literal for that reason.
      ctaLabel: "View All Articles",
      ctaHref: "/blogs",
    },
  }),

  "our-services.hero": defineSection<HeroData>({
    pageKey: "our-services",
    label: "Hero",
    kind: "hero",
    schema: heroSchema,
    defaultOrder: 0,
    defaultData: {
      layout: "stats",
      headingLines: ["Digital Solutions", "For Your Business"],
      highlightedWord: "For Your Business",
      subheading:
        "Transforming ideas into powerful digital solutions that inspire growth, innovation, and lasting business success.",
      primaryCtaLabel: "Explore Services",
      primaryCtaHref: "#services-we-provide",
      primaryCtaShowArrow: true,
      secondaryCtaLabel: "Contact Us",
      secondaryCtaHref: "/contact",
      imageUrl: "/TechOffice.png",
      imageAlt: "Digital globe on monitor",
      // "TOTAL SERVICES" is intentionally excluded from this static seed — the
      // live page computes it from the actual service count (`${services.length}+`)
      // and that dynamic behavior is preserved separately; see Task 17 notes.
      stats: [
        { value: "150+", label: "PROJECTS COMPLETED", iconName: "check-circle" },
        { value: "80+", label: "HAPPY CLIENTS", iconName: "layers" },
        { value: "6+", label: "YEARS EXPERIENCE", iconName: "book-open" },
      ],
    },
  }),

  "contact.hero": defineSection<HeroData>({
    pageKey: "contact",
    label: "Hero",
    kind: "hero",
    schema: heroSchema,
    defaultOrder: 0,
    defaultData: {
      layout: "split",
      headingLines: ["Contact Us"],
      primaryCtaShowArrow: false,
      subheading:
        "Have a question or a project in mind? We'd love to hear from you. Our team of geniuses is ready to help scale your business.",
      imageUrl: "/Rectangle.png",
      imageAlt: "Contact Us",
    },
  }),

  "about-us.hero": defineSection<HeroData>({
    pageKey: "about-us",
    label: "Hero",
    kind: "hero",
    schema: heroSchema,
    defaultOrder: 0,
    defaultData: {
      layout: "split",
      eyebrow: "About Going Genius",
      headingLines: ["We Build Digital", "Solutions That", "Drive Real Impact"],
      highlightedWord: "Real Impact",
      subheading:
        "Going Genius is a creative technology company helping businesses grow with innovative digital solutions. We combine design, technology and strategy to build products people love.",
      primaryCtaLabel: "Our Story",
      primaryCtaHref: "#our-story",
      primaryCtaShowArrow: false,
      secondaryCtaLabel: "Contact Us",
      secondaryCtaHref: "/contact",
      imageUrl: "/career3.png",
      imageAlt: "Going Genius team",
      imageBadge: { value: "5+", label: "Years of Excellence" },
      microcopy: "24-hour response promise",
    },
  }),

  "career.hero": defineSection<HeroData>({
    pageKey: "career",
    label: "Hero",
    kind: "hero",
    schema: heroSchema,
    defaultOrder: 0,
    defaultData: {
      layout: "centered",
      eyebrow: "CAREERS AT GOING GENIUS",
      headingLines: ["Build Your Career With", "Going Genius"],
      primaryCtaShowArrow: false,
      subheading:
        "Join a team of visionaries, engineers, and designers dedicated to building the future of corporate intelligence and efficient modern systems.",
      backdropImageUrl: "/career-new.png",
      imageAlt: "Careers at Going Genius",
    },
  }),

  "blogs.hero": defineSection<HeroData>({
    pageKey: "blogs",
    label: "Hero",
    kind: "hero",
    schema: heroSchema,
    defaultOrder: 0,
    defaultData: {
      layout: "split",
      headingLines: ["Stay Ahead with", "Insights That", "Drive Innovation"],
      subheading:
        "Explore in-depth articles, tutorials, case studies, and industry trends to help you build better products and grow your business.",
      primaryCtaLabel: "Browse Articles",
      primaryCtaHref: "#articles",
      primaryCtaShowArrow: true,
      secondaryCtaLabel: "Subscribe",
      secondaryCtaHref: "#subscribe",
      imageUrl: "/blog1.png",
      imageAlt: "Blog",
    },
  }),

  "teams.hero": defineSection<HeroData>({
    pageKey: "teams",
    label: "Hero",
    kind: "hero",
    schema: heroSchema,
    defaultOrder: 0,
    defaultData: {
      layout: "centered",
      eyebrow: "Our Team",
      headingLines: ["Meet Our Amazing Team"],
      primaryCtaShowArrow: false,
      subheading:
        "A diverse group of passionate professionals working together to create extraordinary digital solutions.",
    },
  }),

  // NOTE: no "company.hero" entry — the /company hero uses a circular logo
  // mark (GeniusMark) as its image side, not a rectangular photo. Forcing it
  // through heroSchema's 4:3 `object-cover` image treatment would visibly
  // distort that logo, so this page was deliberately left on its bespoke
  // markup rather than migrated. See Phase 18 completion notes.

  // "shared.*" (not "home.*"): LandingTeamSection and FaqSection are rendered,
  // unparameterized, on /home, /company, and /contact alike — today they
  // already show identical copy on all three. Scoping these under "home"
  // would make a home-only editor silently also control /company and
  // /contact, which is misleading. "shared" makes that page-spanning nature
  // explicit instead of pretending these belong to one page.
  "shared.team": defineSection<SectionHeaderData>({
    pageKey: "shared",
    label: "Team section header (shown on Home, Company, Contact)",
    kind: "sectionHeader",
    schema: sectionHeaderSchema,
    defaultOrder: 0,
    defaultData: {
      // NOTE: not tokenized — "{{team.plural}}" resolves to "Team Members",
      // but the original copy says "Our Team" (singular usage), so
      // tokenizing here would change the default rendered text (R8).
      eyebrow: "Our Team",
      heading: "Meet the Geniuses",
    },
  }),

  "shared.faq": defineSection<SectionHeaderData>({
    pageKey: "shared",
    label: "FAQ section header (shown on Home, Company, Contact)",
    kind: "sectionHeader",
    schema: sectionHeaderSchema,
    defaultOrder: 1,
    defaultData: {
      eyebrow: "Support",
      heading: "Frequently Asked Questions",
    },
  }),
} as const satisfies Record<string, SectionRegistryEntry<unknown>>;

export type SectionKey = keyof typeof SECTION_REGISTRY;

/** The inferred data type for a given section key, e.g. HeroData for "home.hero". */
export type SectionDataFor<K extends SectionKey> = (typeof SECTION_REGISTRY)[K]["defaultData"];

export function getSectionSchema(sectionKey: SectionKey) {
  return SECTION_REGISTRY[sectionKey].schema;
}

/**
 * Parses `data` against the section's schema, falling back to the registry's
 * default payload if parsing fails. Used on read paths so a malformed/stale row
 * (e.g. from a schema change) degrades to the safe default instead of crashing
 * the page — see Task 11 and the "Editor JSON drifts" risk in the plan doc.
 */
export function parseSectionData<K extends SectionKey>(
  sectionKey: K,
  data: unknown
): SectionDataFor<K> {
  const entry = SECTION_REGISTRY[sectionKey];
  const result = entry.schema.safeParse(data);
  return (result.success ? result.data : entry.defaultData) as SectionDataFor<K>;
}
