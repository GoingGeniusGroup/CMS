import { describe, it, expect } from "vitest";
import {
  EASE_OUT,
  HOVER_LIFT,
  NO_TRANSITION,
  STATIC_VARIANTS,
  fadeUp,
  resolveGesture,
  resolveStagger,
  resolveTransition,
  resolveVariants,
  staggerContainer,
} from "@/lib/motion/variants";

describe("motion variants — reduced-motion resolution", () => {
  it("passes variants through untouched when reduced motion is off", () => {
    expect(resolveVariants(fadeUp, false)).toBe(fadeUp);
  });

  it("swaps in inert variants when reduced motion is on", () => {
    expect(resolveVariants(fadeUp, true)).toBe(STATIC_VARIANTS);
  });

  it("inert variants never move the element", () => {
    for (const state of Object.values(STATIC_VARIANTS)) {
      const target = state as Record<string, unknown>;
      expect(target.y).toBeUndefined();
      expect(target.x).toBeUndefined();
      expect(target.scale).toBeUndefined();
      expect(target.opacity).toBe(1);
    }
  });

  it("collapses transitions to instant under reduced motion", () => {
    expect(resolveTransition(EASE_OUT, false)).toBe(EASE_OUT);
    expect(resolveTransition(EASE_OUT, true)).toBe(NO_TRANSITION);
    expect(NO_TRANSITION.duration).toBe(0);
  });

  it("drops hover gestures entirely under reduced motion", () => {
    expect(resolveGesture(HOVER_LIFT, false)).toBe(HOVER_LIFT);
    expect(resolveGesture(HOVER_LIFT, true)).toBeUndefined();
  });

  it("removes child stagger under reduced motion", () => {
    const active = resolveStagger(0.08, false).visible as { transition?: { staggerChildren?: number } };
    expect(active.transition?.staggerChildren).toBe(0.08);
    expect(resolveStagger(0.08, true)).toBe(STATIC_VARIANTS);
  });
});

describe("motion variants — animation hygiene", () => {
  it("staggerContainer applies the requested gap and delay", () => {
    const v = staggerContainer(0.12, 0.3).visible as {
      transition?: { staggerChildren?: number; delayChildren?: number };
    };
    expect(v.transition?.staggerChildren).toBe(0.12);
    expect(v.transition?.delayChildren).toBe(0.3);
  });

  it("only animates compositor-friendly properties (opacity/transform)", () => {
    // Animating layout properties (width, height, top, left) forces reflow on every
    // frame. This guards against someone adding one to the shared vocabulary.
    const layoutProps = ["width", "height", "top", "left", "right", "bottom", "margin", "padding"];
    for (const state of Object.values(fadeUp)) {
      for (const prop of Object.keys(state as Record<string, unknown>)) {
        expect(layoutProps).not.toContain(prop);
      }
    }
  });
});
