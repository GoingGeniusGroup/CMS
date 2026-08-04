# Phase 15 — Team Showcase Redesign ✅

Part of `ORGANIZATION_AGNOSTIC_PLAN_V2.md`. No schema changes; presentation only.

---

## Scope change from the written plan

The original plan's Tasks 5–7 assumed a redesigned **card** (`TeamCard.tsx`) with a
grayscale-to-color hover and a scroll rail. Mid-implementation the user asked for
something structurally different from cards, not a nicer card — so this phase
shipped a different UI paradigm instead:

**An editorial name-roster.** Members are listed as large typeset names in a
divided list (think a masthead credits page), not photo tiles in a grid. On desktop,
hovering a name floats that member's photo in beside the cursor, spring-tracked;
on touch devices — which have no hover — the photo sits inline next to the name
instead. This is one component, `TeamRoster`, used by both the landing page and the
full `/teams` page, replacing the plan's separate `TeamCard`.

`TeamCard.tsx` was never created — confirmed via a full-repo grep that nothing
references it.

---

## Task 5 (redefined) — `TeamRoster`

**`components/TeamRoster.tsx`** — the roster itself:
- Numbered rows (`01`, `02`, ...) in large tracking-tight type, divided by
  hairline borders — an editorial list, not tiles
- Desktop: hovering a row floats a 180×220 portrait next to the cursor with a
  spring (`AnimatePresence` + `motion.div`, position driven by `onMouseMove`),
  with the row's text turning indigo and the arrow nudging
- Touch: no hover exists, so a 40px circular avatar sits inline before each name
  instead — the floating photo is `hidden sm:block`
- Accepts an optional `groupLabel`, so the same component serves a flat "Our Team"
  rail (landing page) and department-grouped sections (`/teams`) without two
  implementations
- Fully keyboard operable: each row is a real `<button>`; the hover state is also
  triggered by `onFocus`/`onBlur`, so tabbing through the list surfaces the same
  floating portrait sighted mouse users get
- No motion at all when `useReducedMotion()` is true — the floating-portrait block
  is skipped entirely rather than degraded

## Task 6 — Shared-element transition into the modal

**`components/TeamMemberModal.tsx`** now takes an optional `portraitLayoutId` prop
and wraps its portrait in `motion.div layoutId={portraitLayoutId}`. `TeamRoster`
exports `getTeamPortraitLayoutId(namespace, memberId)`, which both the roster's
floating-preview photo and the modal's portrait resolve to the same id from — that
shared id is what framer-motion needs to morph one into the other instead of
cross-fading.

The modal itself was also converted from a plain conditional render to
`AnimatePresence` + entrance/exit motion (backdrop fade, sheet scale-and-lift),
matching the "restrained motion" decision from Phase 14 — reusing `EASE_OUT` from
`lib/motion/variants.ts` rather than introducing a new curve.

`namespace` is threaded through so multiple rosters on one page (department groups
on `/teams`) never produce colliding `layoutId`s — each department group gets its
own namespace, and the modal on that page resolves the matching one based on which
group the selected member's department falls into.

## Task 7 (redefined) — no rail

The plan's "draggable, snap-scrolling rail" doesn't apply to a roster — there's
nothing to scroll horizontally. The landing page section shows up to 8 members as
a full-width vertical roster instead (`members.slice(0, 8)`), consistent with the
"restrained motion" decision: no carousel mechanics for something that reads fine
as a straightforward stacked list.

## Task 8 — Department grouping on `/teams`

`/teams` now fetches `getDepartments()` (existing, previously admin-only-adjacent
but not actually auth-gated) alongside `getPublicTeamMembers()`, and groups members
by department using `useMemo`:
- Group **order** and the set of valid group names come from the curated
  `Department` list (Settings), not from whatever free-text values happen to exist
  on `Team` rows
- A member whose `department` value doesn't match any configured department (blank,
  or referencing one that was renamed/deleted) falls into an "Other" group appended
  last
- Departments with zero matching members are simply never rendered — the `grouped`
  memo only includes keys present in the data

---

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npx eslint` on all 4 touched files | clean |
| `npm test` | 21 passed (unchanged — no new pure logic to test in this phase) |
| `npm run build` | succeeds; `/teams` and `/home` compile |
| grep for `TeamCard` references | none — confirms the pivot left no dangling references |

**Not verified:** actual look and feel in a browser — the floating-photo offset
(`cursor.x + 32, cursor.y - 110`), spring stiffness, and whether the roster reads
well at each breakpoint all need a visual pass at `/home` and `/teams`.

## Known items open

- **Floating-photo offset is a fixed guess**, not computed from viewport edges. On
  a narrow desktop window, hovering a name near the right edge could push the
  180px-wide portrait preview off-screen. Not addressed here — needs either a
  clamp against `window.innerWidth` or `useMotionValue` boundary detection, best
  done alongside the visual QA pass above.
- **No test coverage added** for this phase's own logic (the `/teams` department
  grouping `useMemo`). It's currently only exercised inside a client component with
  live data; if it's worth isolating, extracting the grouping function to a plain
  module would make it testable the same way `lib/motion/variants.ts` is — flagged
  for Phase 21 (test suite extension) rather than done ad hoc here.

---

## Follow-up: landing page reverted to cards, roster kept for `/teams`

After the roster shipped, the user asked to keep the **original card row** on the
landing page specifically, while still getting Phase 14's motion treatment. Net
result — two different UIs for two different contexts, both intentional:

- **`/home` (`LandingTeamSection`):** reverted to the pre-Phase-15 card row —
  square photo, name, role, horizontal scroll with chevron buttons — restored
  from git history (`e675eb1`) rather than rebuilt from memory, to avoid
  reintroducing subtle differences. Phase 14 primitives layered on top:
  `RevealOnScroll` on the header, `StaggerGrid`/`StaggerItem` staggering each
  card in, `MotionCard` for the spring hover-lift (replacing the plain
  `hover:-translate-y-1`). The photo tile also keeps its Phase 15
  `layoutId`-based morph into the modal — that's an enhancement to the existing
  photo, not a new UI, so it stayed.
- **`/teams` (full page):** unchanged — still the `TeamRoster` from this phase,
  grouped by department.

**Primitive fix required to make this work:** `StaggerGrid`/`StaggerItem` didn't
forward refs, and the card row needs a real DOM ref for its scroll-left/right
buttons (`scrollRef.current.scrollBy(...)`). Rather than reintroduce a second
nested scroll container as a workaround, both primitives were converted to
`forwardRef`, and `StaggerGrid` gained a `style` prop (the row needs
`scrollbarWidth: "none"` inline to hide the native scrollbar cross-browser).
This is a strict superset of the previous API — every other consumer
(`LandingServicesSection`, `LandingFeaturedProjects`, `LandingBlogSection`,
`ServicesGrid`, `ProjectsGrid`, `FeaturedServicesGrid`) was re-typechecked,
re-linted, and rebuilt with no changes required on their end.

### Verification (this follow-up)
| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npx eslint` on both touched files | clean |
| `npm test` | 21 passed, unchanged |
| `npm run build` | succeeds, all routes including every other `StaggerGrid` consumer |

**Not verified:** the visual result. Still needs a look at `/home`'s team section
specifically to confirm the stagger/lift feels right on the restored card shape.
