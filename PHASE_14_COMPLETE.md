# Phase 14 — Motion Primitives & Card Redesign ✅

Part of `ORGANIZATION_AGNOSTIC_PLAN_V2.md`. No schema changes; presentation only.

---

## Plan corrections found during implementation

Three assumptions in the written plan were wrong. Recording them because they
changed the work:

1. **The flip card was in 6 components, not 1.** The plan scoped Task 2 to
   `LandingServicesSection`. Actually present in `LandingServicesSection`,
   `LandingFeaturedProjects`, `LandingBlogSection`, `ServicesGrid`, `ProjectsGrid`,
   and `FeaturedServicesGrid` — all with near-identical markup. Fixed by extracting
   one shared `ShowcaseCard` rather than editing six files.
2. **The marquee keyframes were not in `globals.css`.** They lived in styled-jsx
   blocks inside `LandingTechSection` and `LandingPartnersSection`. Nothing needed
   removing from `globals.css`. The plan also missed that `LandingPartnersSection`
   had the same duplicated-track hack.
3. **`ShowcaseCard` needed an `href` mode.** `ProjectsGrid` / `ServicesGrid` /
   `FeaturedServicesGrid` navigate to a detail page rather than opening a modal, so
   the card renders either a `<button>` or a `<Link>`.

---

## Task 1 — Motion primitives

**`lib/motion/variants.ts`** — shared motion vocabulary: `SPRING_SOFT`,
`SPRING_SNAPPY`, `EASE_OUT`, `fadeUp`, `fadeIn`, `scaleIn`, `staggerContainer()`,
`HOVER_LIFT`, `TAP_PRESS`.

Reduced-motion handling is deliberately implemented as **pure functions**
(`resolveVariants`, `resolveTransition`, `resolveGesture`, `resolveStagger`) rather
than inline branching in components. That keeps the rule in one place and makes it
unit-testable in a Node environment with no jsdom or Testing Library.

**Components** (`components/motion/`):
- `RevealOnScroll` — fade + lift on first scroll into view (`whileInView`, `once`)
- `StaggerGrid` / `StaggerItem` — sequenced child entrance
- `MotionCard` — spring hover lift; opt-in `tilt` (pointer-tracked, capped at ±6°)
  and `glow` (gradient border). Both default **off**, matching the project's
  "restrained motion" decision.
- `Marquee` — seamless infinite scroller

Every primitive returns a plain element when `useReducedMotion()` is true.

**Note on `Marquee`:** implemented with CSS keyframes, not framer-motion. An endless
marquee needs no JS frame loop, and `animation-play-state: paused` gives a jump-free
hover pause that a JS tween cannot match cleanly. The reduced-motion gate is still in
React, plus a CSS `@media (prefers-reduced-motion)` belt-and-braces fallback.

**Tests:** 8 new tests in `lib/motion/__tests__/variants.test.ts` covering
pass-through vs. inert resolution, instant transitions, dropped gestures, collapsed
stagger, and a guard asserting the shared variants only animate
compositor-friendly properties (never `width`/`height`/`top`/`left`).

---

## Task 2 — Flip card replaced everywhere

**New `components/ShowcaseCard.tsx`** — one image-led card used by all six sections.

Interaction, replacing the flip:
- image zooms to `scale(1.06)` over 500ms on hover
- gradient scrim keeps the title legible over any image
- description + action label slide up on hover **or keyboard focus**
  (`group-focus-visible:`)
- arrow nudges right on hover
- whole card is one `<button>` or `<Link>` with an `aria-label`

**Touch handling:** the old card required a tap on a small chevron to flip and read
the description. Now the description is visible up-front on mobile and only collapses
from `sm` up, where hover exists. Tapping the card goes straight to the
modal/detail page.

Removed from all six: `[transform:rotateY(180deg)]`, `perspective-[1000px]`,
`[backface-visibility:hidden]`, `[transform-style:preserve-3d]`, the `flippedIds`
`Set` state, and the `toggleFlip` handler.

**Incidental cleanup while rewriting:**
- `ServicesGrid` and `FeaturedServicesGrid` each carried dead modal state —
  `setSelectedService` was only ever called with `null`, so those
  `ServiceDetailModal`s could never open. Removed.
- Their identical `CATEGORY_ICONS` maps were duplicated in both files; extracted to
  `lib/service-category-icons.tsx`.

---

## Task 3 — Scroll reveal

`RevealOnScroll` on every section header and CTA; `StaggerGrid`/`StaggerItem` on every
card grid, across `LandingServicesSection`, `LandingFeaturedProjects`,
`LandingBlogSection`, `LandingPartnersSection`, `LandingTechSection`, `ServicesGrid`,
`ProjectsGrid`, `FeaturedServicesGrid`, and the homepage Products section (which also
gained `MotionCard` hover lift).

---

## Task 4 — Marquee

`LandingTechSection` and `LandingPartnersSection` both migrated to the `Marquee`
primitive, removing their hand-rolled duplicated-track markup and per-component
`@keyframes`. Cycle duration still scales with item count, so pacing is unchanged.

---

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npm test` | 21 passed (13 existing + 8 new) |
| `npm run build` | succeeds, all routes compiled |
| `npx eslint` on all touched files | clean |
| `grep` for flip artifacts in live code | none remaining |

**Not verified:** visual/interaction correctness in a browser. The hover reveal,
marquee pacing, and stagger timing need a human pass at `/home`, `/our-services`, and
`/our-projects`.

---

## Known items left open

- **Two dead files still contain the flip pattern:**
  `app/(user)/home/HomeClient.tsx` and `app/(user)/our-services/ServicesSection.tsx`
  are imported nowhere. Left in place because deleting them was outside this task's
  scope. Both are git-tracked, so removal is safe and recoverable — recommend
  deleting so the pattern isn't copied forward.
- **`MotionCard`'s `glow` is unused.** It relies on a `-z-10` pseudo-element that
  would render behind the card's own opaque background on the current cards. Left in
  the primitive but not applied anywhere, pending visual verification.
