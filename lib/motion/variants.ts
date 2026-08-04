import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion vocabulary for the public site.
 *
 * Design constraints:
 *  - Animate only `opacity` and `transform` (compositor-friendly, no layout thrash).
 *  - Entrances fire once on scroll-in, never on every hover.
 *  - Everything degrades to a no-op when the user prefers reduced motion, via the
 *    pure `resolve*` helpers below (kept out of components so they're unit-testable).
 */

// ─── Transitions ─────────────────────────────────────────────────────────────

/** Gentle spring for hover lifts — settles quickly without overshooting much. */
export const SPRING_SOFT: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 24,
  mass: 0.6,
};

/** Tighter spring for small, immediate feedback (icons, buttons). */
export const SPRING_SNAPPY: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

/** Standard ease-out curve for entrance animations. */
export const EASE_OUT: Transition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1],
};

/** Applied when reduced motion is requested: instant, no visible movement. */
export const NO_TRANSITION: Transition = { duration: 0 };

// ─── Variants ────────────────────────────────────────────────────────────────

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: EASE_OUT },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: EASE_OUT },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: EASE_OUT },
};

/** Variants that are structurally valid but visually inert. */
export const STATIC_VARIANTS: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: NO_TRANSITION },
};

/**
 * Container variants that stagger children in sequence.
 * `stagger` is the gap between each child's start, in seconds.
 */
export function staggerContainer(stagger = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

// ─── Hover states ────────────────────────────────────────────────────────────

export const HOVER_LIFT = { y: -6, transition: SPRING_SOFT } as const;
export const TAP_PRESS = { scale: 0.98, transition: SPRING_SNAPPY } as const;

// ─── Reduced-motion resolution (pure — unit tested) ──────────────────────────

/**
 * Returns `variants` unchanged, or inert variants when reduced motion is on.
 * Components call this instead of branching inline, so the rule lives in one place.
 */
export function resolveVariants(variants: Variants, reduced: boolean): Variants {
  return reduced ? STATIC_VARIANTS : variants;
}

/** Returns `transition` unchanged, or an instant transition under reduced motion. */
export function resolveTransition(transition: Transition, reduced: boolean): Transition {
  return reduced ? NO_TRANSITION : transition;
}

/**
 * Returns a hover/tap gesture object, or `undefined` under reduced motion so the
 * prop can be spread straight onto a motion component and simply vanish.
 */
export function resolveGesture<T extends object>(gesture: T, reduced: boolean): T | undefined {
  return reduced ? undefined : gesture;
}

/** Stagger container that collapses to zero stagger under reduced motion. */
export function resolveStagger(stagger: number, reduced: boolean): Variants {
  return reduced ? STATIC_VARIANTS : staggerContainer(stagger);
}
