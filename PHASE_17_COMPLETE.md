# Phase 17 — Landing Page Editor ✅

Part of `ORGANIZATION_AGNOSTIC_PLAN_V2.md`. Pure admin-UI addition on top of the
Phase 16 `SiteContent` foundation — no schema changes.

---

## Deviation from the plan: reorder UI, not drag-and-drop

The plan's Task 13 called for a "drag handle" for reordering. No drag-and-drop
library exists in this codebase (checked `package.json` — no `@dnd-kit`,
`react-beautiful-dnd`, etc.), and the existing precedent for reordering
(`CustomFieldsClient`'s `reorderCustomField`) already uses up/down chevron
buttons rather than drag handles. Used the same pattern here instead of adding
a new dependency for one screen: it's fully keyboard-accessible with zero setup
cost, and stays visually consistent with the rest of the admin panel. The
plan's actual acceptance criterion ("reorderable... reflected on /home") is met
either way — the mechanism, not the requirement, changed.

## Design addition not in the original plan: `kind` discriminant

`SECTION_REGISTRY` needed a way for the editor to pick the right form per
section beyond "which zod schema does this use" — checking schema
reference-equality across module boundaries is fragile. Added a `SectionKind`
("hero" | "sectionHeader" | "cards") to every registry entry, kept as an
explicit field, not derived. Because the dispatch in `SectionEditorModal` casts
through `as never` (unavoidable — TypeScript can't correlate a generic
`SectionKey`'s resolved data type with a runtime `kind` string), a mismatched
`kind` would silently render the wrong form for a section's actual data shape
with zero compile-time signal. Added a dedicated test for exactly this
(`"every entry's declared kind matches the schema it actually uses"`) and
deliberately broke one entry to confirm the test fails before reverting it —
this is the kind of drift that's easy to introduce later without noticing.

---

## Task 13 — Editor shell

`app/(app)/website-setup/landing-page/page.tsx` — server component, `auth()`
guarded like every other admin route in this codebase (verified live: hitting
the URL unauthenticated returns a 307 to `/login`; following it returns 200).
Fetches `getPageContent("home")` and `getPageContent("shared")`, and fills in
any registry entries with no DB row yet using their default payload — so a
fresh install that hasn't run `seed-site-content` still shows every section in
the editor, just starting from its hardcoded default rather than disappearing.

`LandingPageClient.tsx` renders two lists — "Homepage Sections" and "Shared
Sections" (with an explicit note that editing the latter also changes
`/company` and `/contact`) — each row showing: up/down reorder buttons, the
section's label, a one-line content preview, a visibility toggle
(`toggleSection`), and an Edit button. All three mutating actions
(toggle/reorder/save) optimistically update local state and roll back on
failure, with a transient success/error banner — same UX pattern as
`TagsClient`/`CustomFieldsClient`.

Added "Landing Page" to the Website Setup sub-menu in `components/Sidebar.tsx`,
positioned first in that group.

## Task 14 — Section editors

`SectionEditorModal.tsx` owns the save/cancel lifecycle and validation-error
display; three per-`kind` form components under `forms/` own their own field
state and report a plain schema-shaped object back via `onChange`:

- **`SectionHeaderForm`** — eyebrow / heading (required) / subheading / CTA
  label+href. Covers 7 of the 9 sections (Services, Projects, Blog, Partners,
  Tech, Team, FAQ headers).
- **`HeroForm`** — an array editor for `headingLines` (add/remove up to the
  schema's 4-line cap, matching how the current hero renders "Think Bigger,"
  / "Build Smarter," / "Scale Faster" as three separate lines rather than free
  text with manual line breaks), `highlightedWord`, primary/secondary CTA
  pairs, and an `ImageUploader` for the hero image + alt text.
- **`CardsForm`** — see Task 15.

Required-field validation happens at the schema level (`saveSection` rejects
before touching the DB) and surfaces as an inline error in the modal; a bad
`ctaHref` (anything not starting with `/`, `#`, or `http`) is rejected the same
way, reusing the refinement already written in Phase 16's `sectionHeaderSchema`.

## Task 15 — Repeatable card manager

`CardsForm` (and its `CardItemEditor` sub-component) covers add / edit /
reorder (up/down, same pattern as the section list) / delete for
`cardsSchema` items — title (required), description, link, and an optional
image via `ImageUploader`. Capped at 24 items (enforced by the schema, and the
form disables "Add card" past that count). An empty `items` array shows an
inline notice that the section will hide itself on the public site rather than
render an empty grid — matching how `Products` on the homepage already returns
`null` when `data.items.length === 0` (wired in Phase 16).

The homepage's hardcoded three-product array was already removed in Phase 16
when `Products` was wired to read `home.products` — this phase is what makes
that content actually editable instead of only DB-editable by hand.

---

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npx eslint` (all files added/touched this phase) | clean |
| `npm test` | 34 passed (33 prior + 1 new: kind/schema consistency) |
| Deliberately broke the kind/schema test to confirm it actually fails, then reverted | confirmed — caught a manufactured mismatch before reverting |
| `npm run build` | succeeds; `/website-setup/landing-page` compiles as a new route |
| Live dev server: unauthenticated GET to the editor route | 307 → `/login`, then 200 after following — confirms the `auth()` guard is active |
| Live dev server: all 9 `SiteContent` rows still present with `kind` field added | confirmed via a direct Prisma query |

### What was *not* independently re-verified this phase, and why

Phase 16 already proved `saveSection`'s full write path end-to-end (write →
`revalidateTag`/`updateTag` → re-read → live `/home` render → revert), using a
temporary route calling the action directly. For this phase I attempted the
same live-round-trip proof for `toggleSection` and `reorderSections`
specifically, but a plain `curl` to a Route Handler carries no browser session,
so both calls correctly hit their `requireAdmin()` gate and returned
`Unauthorized` — which proves the gate works, but not the authenticated happy
path for these two specific actions. I chose not to script a login against the
real seeded admin credentials to get past that, since authenticating as a real
account (even locally) for a one-off verification felt more invasive than the
check was worth. The residual risk is narrow: `toggleSection` and
`reorderSections` use the identical `requireAdmin()` helper and the identical
Prisma upsert/transaction shape already proven for `saveSection` — they were
not exercised past their auth gate in this session, and that gap should be
closed with a real browser session (or a proper integration-test harness with
a mocked session) before relying on this in production, rather than assumed
safe by similarity alone.

All scratch verification files/routes created during this phase were deleted
afterward; `git status` confirms none were left in the tree.

---

## Known items open

- **No editor exists yet for anything outside `home`/`shared`** — Phase 18
  (Universal Hero System) extends heroes to `teams`, `blogs`, `career`,
  `contact`, `about-us`, at which point this editor's page-selector needs
  extending too (currently hardcoded to exactly two page buckets).
- **The authenticated happy path for `toggleSection`/`reorderSections`** is
  unverified in a real browser session (see above) — worth closing before
  treating this phase as production-hardened, not just build-green.
- **`CardsForm`'s per-card `ImageUploader`** was not visually verified (no
  browser available) — the upload flow itself was already proven working
  elsewhere in the admin panel (e.g. `TechnologiesClient`), but this specific
  nested usage inside a repeatable list has not been.
