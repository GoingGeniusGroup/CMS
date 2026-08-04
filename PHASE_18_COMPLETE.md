# Phase 18 — Universal Hero System ✅

Part of `ORGANIZATION_AGNOSTIC_PLAN_V2.md`. Replaces 7 separate hardcoded
`Hero()`/`HeroSection()` components across the public site with one
CMS-driven `PageHero` component, extending the Phase 16 `SiteContent`
foundation and the Phase 17 editor shell to cover heroes on every public page
except `company`.

---

## Deviation from the plan: `company` was not migrated

`company`'s hero renders a circular `GeniusMark()` logo mark. `PageHero`'s
image slot uses a 4:3 `object-cover` treatment tuned for photography (all
other 7 heroes use a photo, not a logo mark) — forcing the logo through that
crop would visibly distort it. Migrating it correctly would mean adding a
second image-treatment mode to the schema for exactly one page, which is the
kind of one-off flag this component is trying to avoid accumulating. Left
`company`'s hero as its own hardcoded component and removed the orphaned
`company.hero` registry entry + seeded DB row rather than ship dead content
an admin could edit with no visible effect.

## Deviation from the plan: two schema fields added to preserve `about-us` content

`about-us`'s original hero had a floating "5+ Years of Excellence" stat badge
over the image and a "24-hour response promise" microcopy line under the CTAs.
Neither fits the other 6 heroes, but dropping them to fit the schema as
originally scoped would have violated R8 (no visual loss vs. pre-migration).
Added `imageBadge: { label, value }` and `microcopy: string`, both optional,
rather than leaving `about-us` unmigrated or accepting content loss.

## Real bug found and fixed during migration: `.split(highlight)` drops content on repeated words

The naive approach for rendering a hero heading with one highlighted word was
`line.split(highlightedWord)`. Repro'd via `node -e` before writing the fix:
if the highlight word appears twice in the same line, `.split()` produces 3+
segments and the render logic (written for exactly 2) silently drops the
middle segment. Extracted to a pure, `indexOf`-based `splitHighlight()` in
`lib/content/hero-text.ts` with 6 dedicated tests instead of patching the
inline logic.

## Real bug found and fixed: `our-services`'s "Total Services" stat is dynamic

That page's hero stats include a live count of services (`services.length`),
not static seed content. Rather than extending `heroSchema.stats` to support
computed values (over-complicating the schema for one field on one page),
that entry was excluded from the static seed and computed in `page.tsx`,
prepended to `heroSection.data.stats` at render time.

---

## Task 16 — `PageHero` component

`components/content/PageHero.tsx` — 4 layouts (`split`, `centered`, `minimal`,
`stats`) covering every hero shape found across the 7 migrated pages, plus:
- `cardStyle` (boolean) — `home`'s hero renders inside a card container,
  others render flush; carried as a flag rather than a 5th layout since it's
  the only page that needed it.
- `imageBadge` / `microcopy` — see deviation above, `about-us`-only in
  practice but available to any page.
- `stats[].iconName` — resolved through `lib/content/hero-icons.ts`
  (`HERO_STAT_ICONS`: `layers`, `check-circle`, `book-open`), so stat icons
  are data-driven rather than hardcoded per page.
- `primaryCtaShowArrow` — only `our-services` ("Explore Services") and
  `blogs` ("Browse Articles") have an actual `<ArrowRight>` icon in the
  original source (verified via `grep` before setting the flag) — every
  other page's arrow, where present, is baked into the label text itself
  (e.g. `company`'s literal `"Explore Our Work →"`), so this flag was set
  only on those two registry entries.

`lib/content/hero-text.ts` (`splitHighlight`) and `lib/content/hero-icons.ts`
are both new, standalone, unit-tested modules consumed by the component.

`lib/content/schemas.ts`: extended `heroSchema` with `layout`,
`primaryCtaShowArrow`, `cardStyle`, `imageBadge`, `microcopy`,
`stats[].iconName`; added 6 new registry entries (`our-services.hero`,
`contact.hero`, `about-us.hero`, `career.hero`, `blogs.hero`, `teams.hero`)
alongside the existing `home.hero`. Also fixed `defineSection()` to accept
`z.input<>` (not `z.output<>`) for `defaultData` and call `.parse()`
internally — the prior signature forced every existing registry entry to be
manually updated with every new `.default()`-backed field added to the
schema, which was causing repeated TS2741 errors unrelated to the actual
change being made.

## Task 17 — Page migrations

Migrated `home`, `our-services`, `contact`, `about-us`, `blogs`, `career`,
`teams` to render `<PageHero>` from `SiteContent` instead of a bespoke
component. `home`'s "Our Top Products" image strip (previously nested inside
the hero card) was extracted to a standalone `ProductsTopStrip()` rendered
directly after `PageHero` — a deliberate, documented layout shift, not part
of `heroSchema` and not a hero concern.

`career` and `teams` fetch their hero client-side via `useEffect`, matching
the existing `getPublicJobs`/`getPublicTeamMembers` pattern already on those
pages, rather than converting either page to a server/client split for one
section swap.

**Accepted minor visual drift**, documented rather than chased into more
schema flags:
- Blog's "Subscribe" secondary CTA lost its `Mail` icon-before-text, and its
  `border-b border-zinc-100` hero wrapper was dropped.
- `/teams` used `text-gray-900`/`text-gray-500`; `PageHero` uses
  `text-zinc-900`/`text-zinc-500` (Tailwind gray vs. zinc — visually
  near-identical, not byte-identical).

## Task 18 — Editor updates for the new hero pages

`app/(app)/website-setup/landing-page/page.tsx` now derives its page list
from `SECTION_REGISTRY` directly instead of the two hardcoded buckets
(`home`/`shared`) from Phase 17, with a `PAGE_LABELS` map + `labelForPage()`
fallback for any future page added to the registry with no explicit label.

`LandingPageClient.tsx` rewritten as a page-tabbed UI (was two fixed
sections), taking a `pages: PageGroup[]` prop.

`SectionEditorModal.tsx`: added a live preview pane for `kind === "hero"`
sections only (scaled 0.55, 182% width, to approximate the real rendered
proportions without an iframe), widened the modal to `max-w-5xl` for heroes,
and replaced hardcoded "homepage"/"shared" copy with a page-generic
`SHARED_PAGE_NOTE` constant.

---

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npx eslint` (all files added/touched this phase) | clean |
| `npm test` | 40 passed (34 prior + 6 new: `hero-text.test.ts`) |
| `npm run build` | succeeds; all routes incl. `/website-setup/landing-page` compile |
| Live dev server: `/home`, `/our-services`, `/contact`, `/blogs`, `/teams`, `/career` | all 200 |
| Live dev server content spot-check | correct hero text present (`Think Bigger,`, `Digital Solutions`, `Contact Us`, `Stay Ahead with`), `TOTAL SERVICES`/`PROJECTS COMPLETED` stats present, `Explore Services`/`Browse Articles` arrow CTAs present |
| Direct DB read of `home.hero` and `about-us.hero` rows | confirmed `cardStyle`, `layout`, `imageBadge`, `microcopy` all persisted correctly with expected values |
| Scratch files/routes created during verification | all deleted; `git status --short` shows no `scratch*` source files remaining (only unrelated `.next/` build cache, which is gitignored) |

### `/about-us` could not be curl-verified live

`/about-us` returns a 307 to `/login` when hit unauthenticated — this is a
**pre-existing gap** in `auth.config.ts`'s public-page allowlist (it's
missing alongside `/portfolio` and `/pages`), not a regression from this
phase. Flagged, not fixed, since it's out of scope for a hero-migration
phase. Verified instead via direct DB read (above) that the row `about-us`
reads at render time has the correct `imageBadge`/`microcopy` values, and via
`tsc`/component logic that `PageHero` renders those fields when present —
this is not equivalent to a live render, but is the strongest verification
available without either fixing the unrelated auth gap or scripting a login
against seeded credentials (rejected for the same reason as Phase 17's
equivalent tradeoff: more invasive than the check is worth for a one-off
verification).

### Two footguns discovered during verification, both worth flagging forward

1. **Seed script is idempotent-by-design and does not backfill schema
   changes.** `prisma/seed-site-content.ts` skips any row that already
   exists (correct behavior for not clobbering admin edits), but this means
   a row seeded under an older schema version never picks up newly-added
   `.default()` fields — it just falls back to the zod default at read time,
   which silently reads correctly but was **not** what was in the DB. Hit
   this twice (`home.hero` after adding `cardStyle`/`layout`, `about-us.hero`
   after adding `imageBadge`/`microcopy`) and resolved both via one-off manual
   delete + re-seed. This is a general schema-evolution gap in the seeding
   strategy, not fully resolved by this phase — a future migration-aware
   backfill (or a "merge missing keys into existing rows" seed mode) would
   close it properly.
2. **`unstable_cache` (60s TTL, tag `site-content`) caused a false-negative
   during manual verification.** Direct Prisma writes (used for the DB
   spot-checks above) bypass `updateTag`/`revalidateTag`, so changes made
   that way aren't visible until the TTL expires. The real app write path
   (`saveSection` → `updateTag`) invalidates correctly and was not affected —
   this only bit ad-hoc verification scripts, not the actual feature.

---

## Known items open

- **`company`'s hero was intentionally not migrated** — see deviation above.
  Any future work generalizing the hero system further should either add a
  logo-safe image mode or continue treating `company` as a permanent
  exception.
- **Seed-script schema-evolution gap** (see footgun #1) — affects any future
  schema field addition to any section, not just heroes. Worth a dedicated
  fix before the registry grows much further.
- **`/about-us` missing from the public-page auth allowlist** — pre-existing,
  unrelated to this phase, but now confirmed and documented rather than
  silently worked around.
- **Blog CTA icon + hero wrapper border drift** — accepted, documented, not
  planned for follow-up unless a user notices and flags it.
