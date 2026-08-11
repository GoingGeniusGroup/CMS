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
// Covers every "eyebrow + heading + optional Subheading" section: Services,
// Featured Projects, Blog, Team, FAQ. Also used standalone by Partners/Tech,
// which only render the `heading` field.

export const sectionHeaderSchema = z.object({
  eyebrow: z.string().max(80).optional(),
  heading: z.string().min(1, "Heading is required").max(200),
  "Subheading": z.string().max(400).optional(),
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
 *  - "minimal"  — heading only, no Subheading/CTAs/image (lightweight pages)
 *  - "stats"    — split layout plus a stat-card row underneath (our-services)
 * Defaults to "split" so existing un-migrated callers behave like today's home hero.
 */
export const heroSchema = z.object({
  layout: z.enum(["split", "centered", "minimal", "stats"]).default("split"),
  eyebrow: z.string().max(80).optional(),
  headingLines: z.array(z.string().max(80)).min(1).max(4),
  highlightedWord: z.string().max(40).optional(),
  "Subheading": z.string().max(400).optional(),
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
   * "centered" layout only: a small logo mark rendered above the eyebrow
   * (e.g. the circular GeniusMark on the company hero). Optional/backward-
   * compatible; absent on every existing hero.
   */
  logoUrl: z.string().max(500).optional(),
  /**
   * "split" layout only: wraps the two columns in a bordered card on a tinted
   * section background (the original home hero's look) instead of a plain
   * white section. Kept as a flag rather than a fifth layout value, since
   * every other "split" hero (contact, about-us, blogs, company) uses the
   * plain white version.
   */
  cardStyle: z.boolean().default(false),
  /**
   * "split" layout only: renders the two columns inside a dark rounded card
   * (bg-#2d2d3f, white heading/text) instead of the plain white section — the
   * bespoke our-projects hero's look. Distinct from `cardStyle` (white card on
   * a tinted background).
   */
  darkCardStyle: z.boolean().default(false),
  /**
   * Optional per-line highlight phrases; when present they take precedence
   * over `highlightedWord` so several heading lines can each carry an accent
   * (the our-projects hero highlights "Real" and "Impact" on separate lines).
   */
  highlightedWords: z.array(z.string().max(40)).max(4).optional(),
  /**
   * Per-word highlight with custom color. When present, takes precedence over
   * both `highlightedWord` and `highlightedWords`. Each entry specifies a
   * word/phrase and the color to render it in.
   */
  coloredHighlights: z.array(z.object({
    word: z.string().max(80),
    color: z.string().max(30).default("#4f46e5"),
  })).max(8).optional(),
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
  "Subheading": z.string().max(400).optional(),
  ctaLabel: z.string().max(60).optional(),
  ctaHref: z.string().max(300).optional(),
  /**
   * Presentation style: "grid" = centered icon-card grid on a tinted band
   * (about-us Core Values), "list" = left-aligned icon list inside a bordered
   * container (about-us Why Work With Us). Defaults to "grid" — the original
   * homepage Products look — so existing rows behave as before.
   */
  variant: z.enum(["grid", "list"]).default("grid"),
  items: z.array(cardItemSchema).max(24),
});

export type CardsData = z.infer<typeof cardsSchema>;
export type CardItem = z.infer<typeof cardItemSchema>;

// ─── Timeline schema ──────────────────────────────────────────────────────────
// The about-us "Our Story" block: heading + copy + image on the left, a
// vertical list of dated milestones on the right.

export const timelineItemSchema = z.object({
  year: z.string().max(20),
  title: z.string().min(1, "Title is required").max(120),
  description: z.string().max(400).optional(),
});

export const timelineSectionSchema = z.object({
  heading: z.string().min(1, "Heading is required").max(200),
  copy: z.string().max(600).optional(),
  imageUrl: z.string().max(500).optional(),
  imageAlt: z.string().max(200).optional(),
  items: z.array(timelineItemSchema).min(1, "Add at least one event").max(12),
});

export type TimelineData = z.infer<typeof timelineSectionSchema>;
export type TimelineItem = z.infer<typeof timelineItemSchema>;

// ─── Two-column schema ───────────────────────────────────────────────────────
// Two side-by-side icon cards (about-us Mission & Vision). Header fields and
// the button are optional so a section can be just the two cards, or carry a
// full header + button when a future page needs it.

export const twoColumnItemSchema = z.object({
  iconName: z.string().max(60).optional(),
  title: z.string().min(1, "Title is required").max(120),
  description: z.string().max(400).optional(),
});

export const twoColumnSectionSchema = z.object({
  eyebrow: z.string().max(80).optional(),
  heading: z.string().max(200).optional(),
  copy: z.string().max(600).optional(),
  buttonLabel: z.string().max(60).optional(),
  buttonHref: z.string().max(300).optional(),
  items: z.array(twoColumnItemSchema).min(1, "Add at least one column").max(4),
});

export type TwoColumnData = z.infer<typeof twoColumnSectionSchema>;
export type TwoColumnItem = z.infer<typeof twoColumnItemSchema>;

// ─── Careers schema ──────────────────────────────────────────────────────────
// The company page's "Join Our Team" block: header (eyebrow/heading/copy), a
// small grid of culture points, and a button linking to the careers page —
// fixing the original hardcoded "View All Openings" button that went nowhere.

export const careersItemSchema = z.object({
  iconName: z.string().max(60).optional(),
  title: z.string().min(1, "Title is required").max(120),
  description: z.string().max(400).optional(),
});

export const careersSectionSchema = z.object({
  eyebrow: z.string().max(80).optional(),
  heading: z.string().min(1, "Heading is required").max(200),
  copy: z.string().max(600).optional(),
  buttonLabel: z.string().max(60).optional(),
  buttonHref: z.string().max(300).optional(),
  cultureItems: z.array(careersItemSchema).max(8),
});

export type CareersData = z.infer<typeof careersSectionSchema>;
export type CareersItem = z.infer<typeof careersItemSchema>;

// ─── Life-at-company schema ───────────────────────────────────────────────────
// The career page's "Life at Going Genius" photo mosaic: heading + copy + up to
// 6 images. The first image renders large on the left (spanning both rows, its
// optional `label` overlaid), the next two fill the right column, and any
// further ones render in a simple row below.

export const lifeImageSchema = z.object({
  src: z.string().min(1, "Image URL is required").max(500),
  alt: z.string().max(200).optional(),
  label: z.string().max(120).optional(),
});

export const lifeSectionSchema = z.object({
  heading: z.string().min(1, "Heading is required").max(200),
  copy: z.string().max(600).optional(),
  images: z.array(lifeImageSchema).min(1, "Add at least one image").max(6),
});

export type LifeData = z.infer<typeof lifeSectionSchema>;
export type LifeImage = z.infer<typeof lifeImageSchema>;

// ─── Stats schema ────────────────────────────────────────────────────────────
// A standalone stats-card row (our-services has the same cards inside its hero
// stats layout; these sections render the same shared StatsCards component as
// their own editable, toggleable section below a hero).

export const statItemSchema = z.object({
  value: z.string().min(1, "Value is required").max(20),
  label: z.string().min(1, "Label is required").max(60),
  /** Name from `lib/content/hero-icons.ts`'s registry; omit for no icon. */
  iconName: z.string().max(40).optional(),
});

export const statsSchema = z.object({
  eyebrow: z.string().max(80).optional(),
  heading: z.string().max(200).optional(),
  items: z.array(statItemSchema).min(1, "Add at least one stat").max(6),
});

export type StatsData = z.infer<typeof statsSchema>;
export type StatItem = z.infer<typeof statItemSchema>;

// ─── CTA schema ──────────────────────────────────────────────────────────────
// A call-to-action banner. `variant` mirrors hero layouts: "split" is the
// heading-left/image-right block (our-services, contact), "centered" the
// text-only centered block (about-us final CTA card, company contact CTA).

const ctaHrefRefine = z
  .string()
  .max(300)
  .optional()
  .refine((v) => !v || v.startsWith("/") || v.startsWith("#") || v.startsWith("http"), {
    message: "Link must be a path (/...), an anchor (#...), or a full URL",
  });

export const ctaSchema = z.object({
  variant: z.enum(["split", "centered"]).default("split"),
  /** "split" only: wrap the two columns in a tinted rounded card (bg-#f0eef9) on a tinted section — the our-projects CTA's look. */
  cardStyle: z.boolean().default(false),
  eyebrow: z.string().max(80).optional(),
  headingLines: z.array(z.string().max(80)).min(1).max(4),
  highlightedWord: z.string().max(40).optional(),
  /** Per-word highlight with custom color — same mechanism as the hero. */
  coloredHighlights: z.array(z.object({
    word: z.string().max(80),
    color: z.string().max(30).default("#4f46e5"),
  })).max(8).optional(),
  "Subheading": z.string().max(400).optional(),
  primaryCtaLabel: z.string().max(60).optional(),
  primaryCtaHref: ctaHrefRefine,
  /** Some CTAs show an arrow icon after the primary button, some don't. */
  primaryCtaShowArrow: z.boolean().default(false),
  secondaryCtaLabel: z.string().max(60).optional(),
  secondaryCtaHref: ctaHrefRefine,
  imageUrl: z.string().max(500).optional(),
  imageAlt: z.string().max(200).optional(),
});

export type CtaData = z.infer<typeof ctaSchema>;

// ─── Section registry ─────────────────────────────────────────────────────────

/**
 * Discriminates which editor form a section renders (Phase 17, Task 14).
 * Kept separate from the zod schema itself rather than relying on schema
 * reference-equality, so the editor's form-selection logic can't silently
 * break if a schema is ever refactored/wrapped.
 */
export type SectionKind = "hero" | "sectionHeader" | "cards" | "stats" | "cta" | "timeline" | "twoColumn" | "careers" | "life";

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
      "Subheading":
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
      "Subheading": "End-to-end digital solutions to help your business grow and scale.",
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
      "Subheading": "Explore our latest {{project.plural|lower}} and see how we help businesses grow.",
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
      "Subheading": "Stay ahead with the latest trends, tips, and insights.",
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

  "our-projects.hero": defineSection<HeroData>({
    pageKey: "our-projects",
    label: "Hero",
    kind: "hero",
    schema: heroSchema,
    defaultOrder: 0,
    defaultData: {
      layout: "split",
      darkCardStyle: true,
      headingLines: ["Building Digital", "Products", "That Drive Real", "Impact"],
      highlightedWords: ["Real", "Impact"],
      "Subheading":
        "We design and develop innovative digital experiences that help brands grow, engage users, and achieve measurable business results through cutting-edge technology and precision engineering.",
      primaryCtaLabel: "Explore Projects",
      primaryCtaHref: "#projects",
      primaryCtaShowArrow: true,
      secondaryCtaLabel: "Start a Project",
      secondaryCtaHref: "/contact",
      imageUrl: "/ProjectHero.png",
      imageAlt: "Web Development",
    },
  }),

  "our-projects.stats": defineSection<StatsData>({
    pageKey: "our-projects",
    label: "Stats cards",
    kind: "stats",
    schema: statsSchema,
    defaultOrder: 1,
    defaultData: {
      items: [
        { value: "4+", label: "PROJECTS COMPLETED", iconName: "rocket" },
        { value: "120+", label: "HAPPY CLIENTS", iconName: "smile" },
        { value: "6+", label: "YEARS EXPERIENCE", iconName: "award" },
        { value: "20+", label: "INDUSTRIES SERVED", iconName: "building2" },
      ],
    },
  }),

  "our-projects.cta": defineSection<CtaData>({
    pageKey: "our-projects",
    label: "CTA section",
    kind: "cta",
    schema: ctaSchema,
    defaultOrder: 2,
    defaultData: {
      variant: "split",
      cardStyle: true,
      eyebrow: "START YOUR PROJECT",
      headingLines: ["Have an Idea?", "Let's Build It Together"],
      "Subheading":
        "Whether you need a website, mobile app, or a complete digital transformation — we're ready to turn your vision into reality.",
      primaryCtaLabel: "Get a Free Quote",
      primaryCtaHref: "/contact",
      primaryCtaShowArrow: true,
      secondaryCtaLabel: "Our Services",
      secondaryCtaHref: "/our-services",
      imageUrl: "/Rectangle.png",
      imageAlt: "Start a project",
    },
  }),

  "our-services.hero": defineSection<HeroData>({
    pageKey: "our-services",
    label: "Hero",
    kind: "hero",
    schema: heroSchema,
    defaultOrder: 0,
    defaultData: {
      layout: "split",
      headingLines: ["Digital Solutions", "For Your Business"],
      highlightedWord: "For Your Business",
      "Subheading":
        "Transforming ideas into powerful digital solutions that inspire growth, innovation, and lasting business success.",
      primaryCtaLabel: "Explore Services",
      primaryCtaHref: "#services-we-provide",
      primaryCtaShowArrow: true,
      secondaryCtaLabel: "Contact Us",
      secondaryCtaHref: "/contact",
      imageUrl: "/TechOffice.png",
      imageAlt: "Digital globe on monitor",
    },
  }),

  // All four stats are regular, admin-editable cards — no live injection, so
  // the admin panel and the public page always show the same cards.
  "our-services.stats": defineSection<StatsData>({
    pageKey: "our-services",
    label: "Stats cards",
    kind: "stats",
    schema: statsSchema,
    defaultOrder: 1,
    defaultData: {
      items: [
        { value: "150+", label: "PROJECTS COMPLETED", iconName: "check-circle" },
        { value: "80+", label: "HAPPY CLIENTS", iconName: "layers" },
        { value: "6+", label: "YEARS EXPERIENCE", iconName: "book-open" },
        { value: "7+", label: "SERVICES", iconName: "book-open" },
      ],
    },
  }),

  "our-services.cta": defineSection<CtaData>({
    pageKey: "our-services",
    label: "CTA section",
    kind: "cta",
    schema: ctaSchema,
    defaultOrder: 2,
    defaultData: {
      variant: "split",
      headingLines: ["Ready to Start", "Your Project?"],
      highlightedWord: "Ready to Start",
      "Subheading":
        "Let's build something amazing together. Get in touch with our team today.",
      primaryCtaLabel: "Get a Free Quote",
      primaryCtaHref: "/contact",
      secondaryCtaLabel: "Contact Us",
      secondaryCtaHref: "/contact",
      imageUrl: "/Rectangle.png",
      imageAlt: "Web development",
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
      "Subheading":
        "Have a question or a project in mind? We'd love to hear from you. Our team of geniuses is ready to help scale your business.",
      imageUrl: "/Rectangle.png",
      imageAlt: "Contact Us",
    },
  }),

  "contact.features": defineSection<CardsData>({
    pageKey: "contact",
    label: "Features cards",
    kind: "cards",
    schema: cardsSchema,
    defaultOrder: 1,
    defaultData: {
      variant: "grid",
      items: [
        {
          id: "quick-response",
          title: "Quick Response",
          description: "We respond to all inquiries within 24 hours.",
          iconName: "zap",
        },
        {
          id: "expert-support",
          title: "Expert Support",
          description: "Get help from our experienced and friendly team.",
          iconName: "headphones",
        },
        {
          id: "availability",
          title: "24/7 Availability",
          description: "We are available round the clock for you.",
          iconName: "clock",
        },
        {
          id: "trusted-clients",
          title: "Trusted by Clients",
          description: "Hundreds of businesses trust our services.",
          iconName: "users",
        },
      ],
    },
  }),

  "contact.workTogether": defineSection<CtaData>({
    pageKey: "contact",
    label: "Let's Work Together",
    kind: "cta",
    schema: ctaSchema,
    defaultOrder: 2,
    defaultData: {
      variant: "split",
      headingLines: ["Let's Work Together"],
      "Subheading":
        "We're ready to help you build amazing digital solutions for your business. Join our ecosystem of high-growth partners today.",
      primaryCtaLabel: "Let's Talk",
      primaryCtaHref: "#contact-form",
      primaryCtaShowArrow: false,
      imageUrl: "/contactus.png",
      imageAlt: "Contact Us network",
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
      "Subheading":
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

  "about-us.stats": defineSection<StatsData>({
    pageKey: "about-us",
    label: "Stats cards",
    kind: "stats",
    schema: statsSchema,
    defaultOrder: 1,
    defaultData: {
      items: [
        { value: "250+", label: "Projects Completed", iconName: "rocket" },
        { value: "120+", label: "Happy Clients", iconName: "heart" },
        { value: "8+", label: "Years Experience", iconName: "book-open" },
        { value: "40+", label: "Team Members", iconName: "users" },
      ],
    },
  }),

  "about-us.story": defineSection<TimelineData>({
    pageKey: "about-us",
    label: "Our Story (timeline)",
    kind: "timeline",
    schema: timelineSectionSchema,
    defaultOrder: 2,
    defaultData: {
      heading: "Our Story",
      copy:
        "Founded in 2021, Going Genius started with a simple idea — help businesses grow the right way. Today, we are a team of passionate designers, developers and strategists delivering world-class digital experiences.",
      imageUrl: "/career3.png",
      imageAlt: "Going Genius team",
      items: [
        {
          year: "2021",
          title: "Company Founded",
          description: "Started with a small office and a big vision to redefine digital solutions.",
        },
        {
          year: "2022",
          title: "Expanded Our Services",
          description: "Grew our capabilities to include mobile app development and UI/UX design.",
        },
        {
          year: "2023",
          title: "Crossed 100+ Projects",
          description: "Successfully delivered over 100 high-impact projects for global clients.",
        },
        {
          year: "2024",
          title: "Growing Stronger Together",
          description: "Expanding our global footprint with 40+ dedicated geniuses on board.",
        },
      ],
    },
  }),

  "about-us.missionVision": defineSection<TwoColumnData>({
    pageKey: "about-us",
    label: "Mission & Vision",
    kind: "twoColumn",
    schema: twoColumnSectionSchema,
    defaultOrder: 3,
    defaultData: {
      items: [
        {
          iconName: "globe",
          title: "Our Mission",
          description:
            "To empower businesses with innovative and reliable digital solutions that solve real problems and create lasting value in an ever-evolving tech landscape.",
        },
        {
          iconName: "star",
          title: "Our Vision",
          description:
            "To be a leading digital transformation partner known for excellence, creativity and customer success worldwide, setting new standards for innovation.",
        },
      ],
    },
  }),

  "about-us.values": defineSection<CardsData>({
    pageKey: "about-us",
    label: "Core Values cards",
    kind: "cards",
    schema: cardsSchema,
    defaultOrder: 4,
    defaultData: {
      variant: "grid",
      heading: "Our Core Values",
      "Subheading": "The principles that guide every decision we make and every project we undertake.",
      items: [
        {
          id: "innovation",
          title: "Innovation",
          description: "We embrace new ideas and technologies.",
          iconName: "lightbulb",
        },
        {
          id: "integrity",
          title: "Integrity",
          description: "We believe in honesty and transparency.",
          iconName: "shield",
        },
        {
          id: "excellence",
          title: "Excellence",
          description: "We never settle for anything less.",
          iconName: "star",
        },
        {
          id: "collaboration",
          title: "Collaboration",
          description: "We grow together as a team.",
          iconName: "users",
        },
        {
          id: "customer-first",
          title: "Customer First",
          description: "Your success is our success.",
          iconName: "heart",
        },
      ],
    },
  }),

  "about-us.whyUs": defineSection<CardsData>({
    pageKey: "about-us",
    label: "Why Work With Us",
    kind: "cards",
    schema: cardsSchema,
    defaultOrder: 5,
    defaultData: {
      variant: "list",
      heading: "Why work with us?",
      items: [
        {
          id: "growth-learning",
          title: "Growth & Learning",
          description: "Continuous learning and professional development opportunities.",
          iconName: "trending-up",
        },
        {
          id: "great-culture",
          title: "Great Culture",
          description: "Friendly and supportive work environment that values people.",
          iconName: "heart",
        },
        {
          id: "exciting-projects",
          title: "Exciting Projects",
          description: "Work on impactful and innovative projects for global clients.",
          iconName: "bar-chart-2",
        },
        {
          id: "work-life-balance",
          title: "Work-Life Balance",
          description: "We value your time and well-being outside of work.",
          iconName: "scale",
        },
      ],
    },
  }),

  "about-us.cta": defineSection<CtaData>({
    pageKey: "about-us",
    label: "CTA section",
    kind: "cta",
    schema: ctaSchema,
    defaultOrder: 6,
    defaultData: {
      variant: "centered",
      headingLines: ["Let's build something amazing together"],
      "Subheading":
        "Have a project in mind? We would love to hear from you and discuss how we can help you achieve your goals.",
      primaryCtaLabel: "Get In Touch",
      primaryCtaHref: "/contact",
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
      "Subheading":
        "Join a team of visionaries, engineers, and designers dedicated to building the future of corporate intelligence and efficient modern systems.",
      backdropImageUrl: "/career-new.png",
      imageAlt: "Careers at Going Genius",
    },
  }),

  "career.life": defineSection<LifeData>({
    pageKey: "career",
    label: "Life at Going Genius",
    kind: "life",
    schema: lifeSectionSchema,
    defaultOrder: 1,
    defaultData: {
      heading: "Life at Going Genius",
      images: [
        {
          src: "/career2.png",
          alt: "Collaborative Environment",
          label: "Collaborative Environment",
        },
        { src: "/career3.png", alt: "Team" },
        { src: "/career4.png", alt: "Night Coding" },
      ],
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
      "Subheading":
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
      "Subheading":
        "A diverse group of passionate professionals working together to create extraordinary digital solutions.",
    },
  }),

  "company.hero": defineSection<HeroData>({
    pageKey: "company",
    label: "Hero",
    kind: "hero",
    schema: heroSchema,
    defaultOrder: 0,
    defaultData: {
      layout: "split",
      eyebrow: "Our Company",
      headingLines: ["Innovating the Future", "with Going Genius"],
      highlightedWord: "Going Genius",
      "Subheading":
        "We are a team of passionate innovators, designers, and developers building digital solutions that help businesses grow, scale, and succeed in an ever-changing world.",
      primaryCtaLabel: "Explore Our Work",
      primaryCtaHref: "/our-projects",
      primaryCtaShowArrow: true,
      secondaryCtaLabel: "Contact Us",
      secondaryCtaHref: "/contact",
      imageUrl: "/logo.png",
      imageAlt: "Going Genius",
    },
  }),

  "company.about": defineSection<TwoColumnData>({
    pageKey: "company",
    label: "About section",
    kind: "twoColumn",
    schema: twoColumnSectionSchema,
    defaultOrder: 1,
    defaultData: {
      eyebrow: "About Us",
      heading: "Building digital solutions that make a difference.",
      copy:
        "For over a decade, Going Genius has been a trusted partner for innovative experiences that solve real problems, delight users, and stay one step ahead of a constantly changing world.",
      buttonLabel: "More About Our Story",
      buttonHref: "/blogs",
      items: [
        {
          iconName: "compass",
          title: "Our Mission",
          description:
            "To empower businesses with creative, right-sized digital solutions that grow with them.",
        },
        {
          iconName: "sparkles",
          title: "Our Vision",
          description:
            "To be a studio people know and trust for turning bold ideas into working products.",
        },
      ],
    },
  }),

  "company.stats": defineSection<StatsData>({
    pageKey: "company",
    label: "Stats cards",
    kind: "stats",
    schema: statsSchema,
    defaultOrder: 2,
    defaultData: {
      items: [
        { value: "250+", label: "Projects Completed", iconName: "briefcase" },
        { value: "120+", label: "Happy Clients", iconName: "users" },
        { value: "8+", label: "Years of Experience", iconName: "clock" },
        { value: "35+", label: "Team Members", iconName: "user-check" },
      ],
    },
  }),

  "company.careers": defineSection<CareersData>({
    pageKey: "company",
    label: "Careers section",
    kind: "careers",
    schema: careersSectionSchema,
    defaultOrder: 3,
    defaultData: {
      eyebrow: "Careers",
      heading: "Join Our Team",
      copy:
        "We're always looking for talented and motivated individuals to pursue an extraordinary journey. Be a part of a team that values creativity, growth and respect.",
      // Links to /career — the original hardcoded "View All Openings" button
      // was a dead <button> with no href; the whole point of this section is
      // that its button is now a real link.
      buttonLabel: "View All Openings",
      buttonHref: "/career",
      cultureItems: [
        {
          iconName: "sparkles",
          title: "Great Culture",
          description: "Collaborative teammates who genuinely enjoy the work.",
        },
        {
          iconName: "trending-up",
          title: "Learning & Growth",
          description: "Ongoing mentorship and room to grow your craft.",
        },
        {
          iconName: "scale",
          title: "Work Life Balance",
          description: "Flexible hours that respect your time.",
        },
        {
          iconName: "gift",
          title: "Competitive Benefits",
          description: "Health, equity and perks that reward good work.",
        },
      ],
    },
  }),

  "company.contactCta": defineSection<CtaData>({
    pageKey: "company",
    label: "Contact CTA section",
    kind: "cta",
    schema: ctaSchema,
    defaultOrder: 4,
    defaultData: {
      variant: "split",
      headingLines: ["Have Questions?", "Let's Work Together."],
      "Subheading":
        "We'd love to hear about your project and explore how we can help you achieve your goals.",
      primaryCtaLabel: "Go to Contact Page",
      primaryCtaHref: "/contact",
      primaryCtaShowArrow: true,
      imageUrl: "/rect.png",
      imageAlt: "Contact us",
    },
  }),

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

  // ─── Portfolio page ───────────────────────────────────────────────────────
  "portfolio.hero": defineSection<HeroData>({
    pageKey: "portfolio",
    label: "Hero",
    kind: "hero",
    schema: heroSchema,
    defaultOrder: 0,
    defaultData: {
      layout: "split",
      darkCardStyle: true,
      eyebrow: "Our Portfolio",
      headingLines: ["Building Digital", "Products That Drive", "Real Impact"],
      highlightedWords: ["Real", "Impact"],
      "Subheading":
        "We design and develop innovative digital experiences that help brands grow, engage users, and achieve measurable business results.",
      primaryCtaLabel: "Explore Projects",
      primaryCtaHref: "#projects",
      primaryCtaShowArrow: true,
      imageUrl: "/career3.png",
      imageAlt: "Portfolio showcase",
    },
  }),

  "portfolio.cta": defineSection<CtaData>({
    pageKey: "portfolio",
    label: "CTA section",
    kind: "cta",
    schema: ctaSchema,
    defaultOrder: 1,
    defaultData: {
      variant: "split",
      cardStyle: true,
      eyebrow: "LET'S WORK TOGETHER",
      headingLines: ["Have a Project", "in Mind?"],
      highlightedWord: "Project",
      "Subheading":
        "We're here to turn your ideas into powerful digital solutions that drive results. Our team of experts is ready to help you scale your business.",
      primaryCtaLabel: "Start Your Project",
      primaryCtaHref: "/contact",
      primaryCtaShowArrow: true,
      secondaryCtaLabel: "View Services",
      secondaryCtaHref: "/our-services",
      imageUrl: "/career3.png",
      imageAlt: "Collaboration",
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
