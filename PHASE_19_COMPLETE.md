# Phase 19 — Public Dynamic Terminology ✅

Part of `ORGANIZATION_AGNOSTIC_PLAN_V2.md`. Extends the existing (admin-only
in practice, though never actually auth-gated) entity-label system to the
public site, and adds a token syntax so CMS-editable text fields can
reference an entity label without an admin needing to hand-edit copy after
every industry-profile switch.

---

## Deviation from the plan: `career` and `teams` don't get `generateMetadata`

Task 24 asks for per-page metadata generated from hero content. `career` and
`teams` are `"use client"` pages (their heroes are fetched client-side via
`useEffect`, a decision made in Phase 18 to avoid splitting either page into
a server/client pair for one section swap) — `generateMetadata` can only be
exported from a server component. Wiring metadata into these two would mean
reopening exactly the tradeoff Phase 18 deliberately avoided. Left both pages
on whatever metadata they inherit from `app/(user)/layout.tsx` (the site's
default title/description) rather than restructuring either page for this
one feature. `home`, `our-services`, `contact`, `about-us`, and `blogs` — all
server components — do get hero-derived metadata.

## Design note: not every entity-shaped literal was tokenized

Two literals initially looked like Task 22 candidates but were deliberately
left as-is after checking them against `DEFAULT_ENTITY_LABELS`:
- `shared.faq`'s team-section eyebrow ("Our Team") — `{{team.plural}}`
  resolves to "Team Members", which would silently change the default
  rendered text (R8 violation) since the original copy uses "Team"
  singular-as-collective, not the plural label.
- `home.blog`'s CTA ("View All Articles") — `{{blog.plural}}` resolves to
  "Blogs", but the page has always said "Articles", not "Blogs". Tokenizing
  would change the default copy the same way.

Both are commented in `lib/content/schemas.ts` explaining why they're
intentionally not tokenized, rather than leaving future readers to wonder if
it was an oversight. Every other tokenized field was checked the same way
before being changed — `{{service.plural}}` → "Services", `{{project.plural}}`
→ "Projects", `{{project.plural|lower}}` → "projects" all match their pages'
existing literal text exactly.

---

## Task 20 — Public label reader

`getPublicEntityLabels()` added to `app/actions/labels.ts` as a thin wrapper
around the existing `getEntityLabels()`. That function turned out to already
have no auth check (confirmed by reading it, not assumed) — the plan's
"public reader" framing was about making the intended access level explicit
in the name for callers, not about stripping an auth gate that didn't exist.
Both share the same `entity-labels`-tagged `unstable_cache`, so an admin
editing labels or switching industry profile invalidates the public site's
labels in the same write.

## Task 21 — `PublicLabelProvider`

`components/content/PublicLabelProvider.tsx` — deliberately not a reuse of
the existing `ConfigProvider` (admin panel), which fetches its own data via
`useEffect` and is fine with a one-tick label flash on navigation. Public
visitors shouldn't see "Customers" flash to "Clients" a moment after paint,
so this provider takes already-resolved `initialLabels` as a prop, fetched
server-side once in `app/(user)/layout.tsx` and passed down — no client
fetch, no flash, ever.

Exposes `usePublicLabel(key, opts)` (single label) and
`usePublicLabelTokens(text)` (resolve every `{{...}}` token in a string) as
hooks, plus `usePublicLabelResolver()` returning the raw resolver function
for components that need to call it a variable number of times per render
(e.g. mapping over an array) — calling a hook conditionally/in a loop would
violate the rules of hooks, so `PageHero` grabs the resolver once and calls
it as a plain function per array item.

## Task 22 — Apply labels to public copy

`SectionHeader`/`SectionCta` now resolve tokens in `eyebrow`/`heading`/
`Subheading`/`ctaLabel`. `PageHero` resolves tokens in `eyebrow`/
`headingLines`/`Subheading`/`microcopy`/CTA labels/stat labels/`imageBadge`
label. `lib/content/schemas.ts`'s registry defaults were updated to use
tokens wherever it wouldn't change default rendered text (see design note
above): `home.services` (eyebrow + CTA), `home.projects` (Subheading + CTA),
`our-services.hero`'s dynamic "Total Services" stat label.

`teams/page.tsx`'s search placeholder ("Search team member...") now reads
the `team` entity's singular label instead of the literal word "team" — a
Café profile that renames "Team" to "Staff" gets "Search staff member..."
automatically, no content edit required.

## Task 23 — Section-level label tokens

`lib/content/tokens.ts` — `resolveTokens(text, labels)` implements the
`{{entityKey.form}}` / `{{entityKey.form|lower}}` syntax via a single regex
replace. Unknown entity keys and malformed tokens (bad form, missing dot, no
closing braces) are left in the output exactly as written — the plan's
explicit test requirement — rather than throwing or silently stripping them,
so a typo in an admin-authored token degrades to visible-but-harmless rather
than crashing the page. `resolveTokensIfPresent` adds a cheap `.includes("{{")`
guard so the common case (a plain literal string with no tokens at all) skips
the regex entirely. 9 new tests in `lib/content/__tests__/tokens.test.ts`.

## Task 24 — Dynamic public page metadata

`lib/content/resolve-tokens-server.ts` — a server-side counterpart to
`usePublicLabelTokens` for use inside `generateMetadata`, which runs before
any React context exists. `home`, `our-services`, `contact`, `about-us`, and
`blogs` each export `generateMetadata()` deriving `<title>`/`<meta
description>` from their hero's `headingLines`/`Subheading`, tokens resolved.
See deviation above for why `career`/`teams` don't.

---

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npx eslint` (all files added/touched this phase) | clean — the one error surfaced (`labels.ts:180`, pre-existing `as any` in `applyProfilePreset`) predates this phase and is unrelated to any line touched |
| `npm test` | 49 passed (40 prior + 9 new: `tokens.test.ts`) |
| `npm run build` | succeeds; all routes compile, no new warnings beyond the pre-existing `metadataBase` notice (unrelated — a global Next.js config item, not scoped to this phase) |
| Live dev server: `/home` title tag | `<title>Think Bigger, Build Smarter, Scale Faster \| Going Genius</title>` — resolved from the hero, no tokens in this particular hero's text |
| Live dev server: `/home` body | "Our Services" eyebrow, "View All Services" CTA, "What We Do Best" heading all present — tokens resolved to the exact original literals |
| Live dev server: `/our-services` title + stat | `<title>Digital Solutions For Your Business \| Going Genius</title>`; stat label source is `TOTAL Services` — renders as "TOTAL SERVICES" via the existing `uppercase` CSS class, matching the original all-caps literal visually |
| Live dev server: `/teams` search placeholder | `placeholder="Search team member..."` — byte-identical to the pre-Phase-19 literal, now label-driven |
| Live dev server: `/blogs` title + CTA | `<title>Stay Ahead with Insights That Drive Innovation \| Going Genius</title>`; "View All Articles" present unchanged (deliberately not tokenized, see design note) |
| Live dev server: `/contact` title | `<title>Contact Us \| Going Genius</title>` |
| Live dev server: `/about-us` | 0 bytes returned — same pre-existing `/about-us` auth-allowlist gap flagged in `PHASE_18_COMPLETE.md`, not a regression from this phase |

### What wasn't independently verified

The plan's Task 22 test criterion ("switching to the Café profile changes
public CTA labels") wasn't exercised end-to-end against a live profile
switch in this session — verified instead via the 9 unit tests proving
`resolveTokens` correctly substitutes arbitrary label values, plus the live
render confirming the *default* profile's labels resolve correctly. Switching
`applyProfilePreset` and re-checking `/home`'s rendered CTA text would be the
natural follow-up if this needs end-to-end proof beyond unit coverage.

---

## Known items open

- **`career` and `teams` have no hero-derived `generateMetadata`** — see
  deviation above. Both inherit the site-wide default title/description.
  Revisit if either page is ever converted to a server/client split for
  other reasons.
- **`shared.faq`'s "Our Team" eyebrow and `home.blog`'s "View All Articles"
  CTA are intentionally NOT tokenized** — see design note above. If a future
  admin wants these to track the `team`/`blog` entity labels exactly, that
  would require either accepting the default-copy change or adding a
  distinct "display word" override field, not just applying the existing
  token syntax naively.
- **`/about-us` remains outside the public-page auth allowlist** — same
  pre-existing, out-of-scope gap noted in `PHASE_18_COMPLETE.md`.
- **Café-profile end-to-end verification not performed live** — see above;
  covered by unit tests only in this session.
