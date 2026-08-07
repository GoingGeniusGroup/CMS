# Plan: Make All Client Pages Section-Customizable (like /home)

All new sections follow the existing pattern: zod schema + entry in `SECTION_REGISTRY` (`lib/content/schemas.ts`) → seeded via `prisma/seed-site-content.ts` → read via `getSection` → auto-appears as a tab/row in the admin Landing Page editor (`app/(app)/website-setup/landing-page/` — page-tabbed, kind-dispatched). Defaults for every new section = the exact current hardcoded copy, so pages look identical until edited.

## Current state per page

| Page | Hero | Stats | Others |
|---|---|---|---|
| our-services | ✅ configurable (PageHero) | ✅ **separate Stats cards section** (Phase 1 — moved out of hero) | **Development Process hardcoded** (to remove), **CTA hardcoded** |
| our-projects | ✅ configurable (dark-card PageHero) | ✅ **separate Stats cards section** (4+) | **CTA hardcoded** → now configurable (`our-projects.cta`) |
| about-us | ✅ configurable | ✅ **separate Stats cards section** (250+/120+/8+/40+) | Story/timeline, Mission/Vision, Values, Why-us, CTA all configurable |
| company | ✅ configurable (centered hero + logoUrl) | ✅ **separate Stats cards section** (250+/120+/8+/35+) | About, Careers (button now links to `/career`), Contact CTA (email/phone from ContactSettings) all configurable; shared Team/FAQ headers passed |
| career | ✅ configurable (client-fetch pattern) | — | **"Life at Going Genius" mosaic configurable** |
| contact | ✅ configurable | — | Features strip + "Let's Work Together" configurable; info cards/map already settings-driven |

## Decisions

- **Stats**: always a **separate, editable "Stats cards" section** (kind `stats`) on every page that has them — our-services, our-projects, about-us, company. Stats are NOT part of hero data anymore; heroes keep only heading/copy/CTAs. One shared `StatsCards` component provides the identical card UI everywhere. All stats — including counters like "TOTAL SERVICES" (seeded as `6+`, the current service count) — are ordinary admin-editable cards, so the admin panel and the public page always show the same cards. No live injection.
- **Company hero logo**: extend `heroSchema` with an optional `logoUrl` field rendered above the heading in the `centered` layout.

## Phase 1 — Foundation + our-services (mostly DONE)

- **Schemas/kinds** (`lib/content/schemas.ts`): add `stats` kind (`statsSchema`: heading + items[{value, label, icon}]), `cta` kind (`ctaSchema`: eyebrow, heading, copy, image, imageAlt, 2 buttons), extend `SectionKind` union, and add optional `logoUrl` to `heroSchema` (centered-layout hero logo).
- **New editor forms**: `StatsForm`, `CtaForm`; register dispatch + `summarize()` support in `SectionEditorModal`/`LandingPageClient`; extend `HeroForm` with logo upload field.
- **Shared UI**: `components/content/StatsCards.tsx` (shared card markup, reused by PageHero's `stats` layout) + `components/content/StatsSection.tsx` (standard section chrome around it for standalone use).
- **Registry**: `our-services.stats` (4 default cards incl. `6+ TOTAL SERVICES`; label "Stats cards"), `our-services.cta` (defaults = current copy + `/Rectangle.png`). `our-services.hero` default drops `stats` and uses layout `split`.
- **Page** `our-services/page.tsx`: **delete `DevelopmentProcess` + `PROCESS_STEPS`**; hero `stats` payload dropped before rendering (existing DB rows keep it); render `StatsSection` + `CtaSection` via `getSection` — no live stat injection, the stats section data renders as-is.
- **Data migration**: remove `stats` from the existing `our-services.hero` row; update the `our-services.stats` row to the 4-card payload (seed skips existing rows); `npm run seed-site-content` for fresh installs.
- Verify: seed, tsc, eslint, build, page + editor look.

## Phase 2 — our-projects (DONE)

- **Schema extensions**: `heroSchema` gained `darkCardStyle` (dark rounded card, the bespoke projects hero look) and `highlightedWords` (word list, each matched against any heading line — supports the "Real"/"Impact" italic indigo accents); `ctaSchema` gained `cardStyle` (tinted `#f0eef9` rounded card) and `primaryCtaShowArrow`. `hero-icons.ts` extended with rocket/smile/award/building2 for the stat icons.
- Registry: `our-projects.hero` (layout `split`, `darkCardStyle`, defaults = current copy + `/ProjectHero.png`), `our-projects.stats` (4 regular editable stats: 4+/120+/6+/20+ — no live injection), `our-projects.cta` (card style, "Have an Idea?" copy). Editor tab label "Projects Page" added.
- Page: bespoke `HeroSection`/`StatsSection`/`CTASection` replaced with `PageHero`/`StatsSection`/`CtaSection` + `getSection`; `ProjectsGrid` stays live data.
- Verify: seed, tsc, eslint, build, page renders dark hero + double italic highlights + 4 stats + tinted CTA card (200).

## Phase 3 — about-us (DONE)

- **New kinds**: `timeline` (`timelineSectionSchema`: heading, copy, image, items[{year, title, description}]) and `twoColumn` (`twoColumnSectionSchema`: eyebrow, heading, copy, 2 columns[{icon, title, description}], button) + forms. `cardsSchema` gained `variant` (`grid` = centered icon-card grid on a tinted band / `list` = left-aligned icon list in a bordered box) + optional `Subheading`; `HERO_STAT_ICONS` extended (heart/users/globe/star/lightbulb/shield/trending-up/bar-chart-2/scale).
- Registry: `about-us.stats` (250+/120+/8+/40+), `about-us.story` (2021–2024 timeline + `/career3.png`), `about-us.missionVision` (twoColumn), `about-us.values` (reuses `cards` grid, 5 values), `about-us.whyUs` (reuses `cards` list, 4 items), `about-us.cta` (centered "Let's build something amazing together" → `/contact`).
- Page: `TimelineSection`/`TwoColumnSection`/`CardsSection` (shared, in `components/content/`) + `StatsSection`; all hardcoded sections replaced; hero's `#our-story` anchor preserved on the timeline section.
- Verify: seed (6 new rows), tsc, eslint, build, about-us 200 with all copy, home/our-services/our-projects regressions OK.

## Phase 4 — company (client component) (DONE)

- Used career's client-side `getSection` pattern, generalized into a `useSection(sectionKey)` hook in `app/(user)/company/page.tsx`.
- Registry: `company.hero` (layout `centered` + `logoUrl: /logo.png` — replaces hardcoded `GeniusMark` inside hero; the "deliberately no company.hero" caveat is removed), `company.about` (twoColumn + "More About Our Story"), `company.stats` (250+/120+/8+/35+), `company.careers` (new `careers` kind: eyebrow/heading/copy/cultureItems/button — button defaults to a working link to `/career`, **fixing the dead "View All Openings" button**), `company.contactCta` (cta kind; bespoke `ContactCtaSection` renders the email/phone from ContactSettings, replacing the `goingenius2021@gmail.com` / `9845632107` literals — settings row now wins).
- Bonus: `shared.team` / `shared.faq` section data fetched and passed to `LandingTeamSection`/`FaqSection` so their headers stop silently falling back to defaults when an admin has edited them.
- `HERO_STAT_ICONS` extended (briefcase/clock/user-check/compass/sparkles/gift); new `CareersForm` + `CareersSection`/`ContactCtaSection` components (Open Positions panel stays live jobs data).
- Verify: seed (5 new rows), tsc, eslint, build, /company 200 with hero/about/stats/careers/CTA content, contact email/phone from settings, button links to /career.

## Phase 5 — career (DONE)

- **New kind**: `life` (`lifeSectionSchema`: heading, copy, images[{src, alt, label}]) + `LifeForm`.
- Registry: `career.life` (defaults = "Life at Going Genius" + career2/3/4.png + labels), order 1 after the hero.
- Page: hardcoded `LifeSection` replaced with the shared `components/content/LifeSection.tsx` (first image spans both rows on the left with its optional label overlay, images 2–3 fill the right column, extra images render in a row below), fetched client-side via `getSection` alongside the existing hero fetch.
- Verify: seed (1 new row → 32 total), tsc, eslint (only pre-existing 2), build, /career 200 with mosaic + label, /company regression OK.

## Phase 6 — contact (DONE)

- Registry: `contact.features` (reuses `cards` grid, 4 defaults: Zap/Headphones/Clock/Users) and `contact.workTogether` (reuses `cta` split, "Let's Work Together" + `/contactus.png`); `HERO_STAT_ICONS` extended (zap/headphones).
- Page: `FeaturesSection` + `WorkTogetherSection` hardcodes removed from `ContactClient.tsx`; it now renders `CardsSection` + `CtaSection` fed from the section rows (passed from the server `contact/page.tsx`). Form + info cards + map stay settings-driven.
- Verify: seed (2 new rows), tsc, eslint, build, /contact 200 with features + CTA + form intact.

## Phase 7 — Final verification (DONE)

- `npm run seed-site-content` (idempotent upsert — 34 rows: 2 home/shared-era + services+projects+about-us+company+career+contact, all existing rows untouched), `npx tsc --noEmit`, `npm run lint` (only the 2 pre-existing issues), `npm run build` all clean.
- Manual: all 9 public routes (/home, /our-services, /our-projects, /about-us, /company, /career, /contact, /blogs, /teams) return 200 with the new sections rendering; admin Landing Page editor auto-gains tabs (company) and rows (about-us, career, contact) from `SECTION_REGISTRY`; `saveSection`/`toggleSection`/`reorderSections` revalidate `/${pageKey}`, covering all pages.

## Notes

- `company`/`career` stay client components (career pattern already proven).
- Hero `logoUrl` is optional/backward-compatible.
- Seed must run once on prod DB after deploy.
