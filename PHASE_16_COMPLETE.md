# Phase 16 — `SiteContent` Foundation ✅

Part of `ORGANIZATION_AGNOSTIC_PLAN_V2.md`. Additive schema change (one new table),
plus refactoring 7 landing components to read their headers from it.

---

## Correction to the plan: added a `pageKey: "shared"` bucket

The plan assumed every section belongs to exactly one page (`home.team`,
`home.faq`, etc.). While wiring Task 12 I found `LandingTeamSection` and
`FaqSection` are called **bare, with no page-specific props**, on `/home`,
`/company`, **and** `/contact` — all three already show identical copy today.
Scoping their content under `pageKey: "home"` would let a home-only editor
silently also control two other pages, which is misleading.

Fixed by introducing `pageKey: "shared"` for genuinely page-spanning sections:
`shared.team` and `shared.faq`, instead of `home.team` / `home.faq`. Caught this
by actually tracing every call site (`grep` across `app/` and `components/`)
before writing the seed data, not by assuming the plan's page-per-section model
was correct.

---

## Task 9 — Schema + seed

- Added `SiteContent` model to `prisma/schema.prisma` (`pageKey`, `sectionKey`,
  `variant`, `isVisible`, `order`, `data: Json`, unique on `[pageKey, sectionKey]`).
- `npx prisma migrate dev` failed against this DB with a pre-existing shadow-DB
  history mismatch (`P3006`/`P1014` on the unrelated `0_baseline` migration) —
  not something this change introduced; `npx prisma db push` was used instead,
  which is additive-only here (one new table, nothing else touched). Verified via
  a direct Prisma query that `site_content` exists post-push.
- `prisma/seed-site-content.ts` (wired to `npm run seed-site-content`) seeds one
  row per `SECTION_REGISTRY` entry from **today's exact literal copy** — verified
  against the live DB: first run created 9 rows, second run created 0 (idempotent).

## Task 10 — Zod schemas + registry

`lib/content/schemas.ts`: `sectionHeaderSchema` (eyebrow/heading/Subheading/CTA,
covers Services/Projects/Blog/Partners/Tech/Team/FAQ), `heroSchema` (for Phase 18),
`cardsSchema` (Products grid). `SECTION_REGISTRY` maps 9 section keys to their
schema, page, default order, and default payload — the single source of truth
for seeding, reads, and the future editor.

`parseSectionData` falls back to the registry default on a validation failure,
so a malformed row degrades gracefully instead of crashing a page.

12 new tests in `lib/content/__tests__/schemas.test.ts`: every registry default
parses against its own schema, `defaultOrder` has no collisions within a page,
`ctaHref` rejects non-path/anchor/URL values (e.g. `javascript:`), and
`parseSectionData` is verified to actually fall back rather than throw.

## Task 11 — Server actions

`app/actions/site-content.ts`: `getPageContent`, `getSection`, `saveSection`
(zod-validated, admin-gated), `toggleSection`, `reorderSections`. Read path uses
`unstable_cache` tagged `site-content`, same pattern as `getEntityLabels`.

**Verified against the live DB and a running dev server (not just typecheck):**
- `getPageContent("home")` → 9 sections
- `getSection("home", "home.faq")` → correctly resolves to the seeded value
- `saveSection` from an **unauthenticated** request → rejected with `Unauthorized`
- A direct write to `home.services`, followed by `revalidateTag("site-content")`
  and a re-read, showed the change take effect immediately — then restored to
  the original value, confirmed via a fresh `/home` fetch showing zero occurrences
  of the test string.
- Found and fixed a real bug in my own verification harness along the way:
  `updateTag` can only run inside a Server Action, not a Route Handler
  (`revalidateTag` is the Route-Handler-safe equivalent) — this doesn't affect
  `saveSection` itself, which correctly runs as a Server Action, but is worth
  recording since it's an easy mistake to make with this API.

## Task 12 — `SectionHeader` + wiring into 7 components

`components/content/SectionHeader.tsx` (eyebrow/heading/Subheading, wrapped in
`RevealOnScroll`) and `SectionCta` (the "View All X" link below a grid, kept as
its **own** separately-timed reveal block — the original markup already treats
header and CTA as two independently-timed reveals, and collapsing them into one
would have changed the animation timing, violating R8).

Wired into `app/(user)/home/page.tsx`, which now fetches all 9 sections
server-side via `Promise.all` alongside the existing data fetches, and passes
each as a `headerData` prop:
- `LandingServicesSection`, `LandingFeaturedProjects`, `LandingBlogSection` — use
  `SectionHeader` + `SectionCta`
- `LandingPartnersSection`, `LandingTechSection` — render `header.heading`
  directly into their existing `<p>` (not `SectionHeader`'s `<h2>`), since their
  original markup is a single centered heading with no eyebrow/CTA; forcing them
  through the shared component would have changed the DOM/tag
- `LandingTeamSection`, `FaqSection` — read from `shared.team`/`shared.faq`,
  `headerData` is **optional** so `/company` and `/contact` (which call these
  components with no props at all) keep working via the registry-default fallback
- `Products` (the homepage's inline card section) reads `home.products` via
  `CardsData` instead of a hardcoded array — the hardcoded three-card array is gone

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npx eslint` (all files touched this phase) | clean (1 real error found and fixed: `any` → `unknown` in the registry's `satisfies` clause) |
| `npm test` | 33 passed (21 prior + 12 new) |
| `npm run build` | succeeds, `/home` and all other routes compile |
| Live dev server: `/home` renders all 9 seeded strings | confirmed via `curl` — "What We Do Best", "Recent Success Stories", "Industry Perspectives", "Meet the Geniuses", "Frequently Asked Questions", "Trusted & Recognized By", "Growth Analytics" all present |
| Live dev server: write → cache invalidation → read → render | confirmed via a temporary route handler, then reverted |
| Live dev server: unauthenticated write rejected | confirmed |
| Registry per-key type inference isn't secretly `any` | confirmed via a standalone typecheck asserting `SectionDataFor<"home.hero">.headingLines` and `SectionDataFor<"home.products">.items[0].title` resolve to real types |

All scratch verification routes/scripts were deleted after use; `git status`
confirms none were left behind.

## Known items open

- **`/company` and `/contact` fetch team/FAQ data client-side**, with no
  server-side data fetch at all (pre-existing, not introduced by this phase) —
  meaning a plain `curl` can't see their eventual rendered content, only the
  initial client shell. Confirmed via the dev server log that both return 200
  with no errors; the actual client-rendered text was not independently
  verified in a real browser this phase.
- **`Products` section and the other card-grid consumers of `cardsSchema`** have
  no admin editor yet — that's Phase 17 (Task 15), not in scope here. Right now
  the only way to change `home.products` content is a direct DB write.
- **No test coverage for `app/actions/site-content.ts` itself** — it was
  verified manually against a live server/DB (see above) rather than with an
  automated test, since it depends on `unstable_cache`/`auth()`/`revalidatePath`,
  none of which run in the plain-Node Vitest environment already configured.
  Flagged for Phase 21 (test suite extension) if this is worth investing in —
  likely via a thin seam that separates the DB/validation logic (testable now)
  from the Next.js-runtime-dependent caching/auth wrapper (needs a different
  test setup, e.g. `next/experimental/testmode` or an integration test runner).
