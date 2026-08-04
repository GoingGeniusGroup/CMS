"use client";

import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Seamless infinite horizontal scroller.
 *
 * Implemented with CSS keyframes rather than framer-motion on purpose: an endless
 * marquee needs no JS frame loop, and `animation-play-state: paused` gives a
 * jump-free pause on hover that a JS tween can't match. Reduced motion renders a
 * static wrapped flex row instead.
 *
 * Children are rendered twice and the track is translated by exactly -50%, which
 * is what makes the loop seamless.
 *
 * The keyframes/pause-on-hover rules live in `app/globals.css`, not in a
 * `<style jsx>` block here — styled-jsx's per-component `<style>` tag was not
 * being emitted into the SSR output in this Next 16 setup (verified by
 * inspecting rendered HTML: the tag was simply absent), which silently
 * dropped the marquee animation everywhere it was used. `--marquee-duration`
 * is set inline per instance since global CSS can't take a JS prop directly.
 */
export function Marquee({
  children,
  className = "",
  /** Seconds for one full cycle. Scale this with item count for even pacing. */
  duration = 30,
  pauseOnHover = true,
  gapClassName = "gap-x-20 sm:gap-x-28",
  /** Scroll direction — use opposite directions on adjacent marquees for a classic "counter-scrolling" effect. */
  direction = "left",
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  pauseOnHover?: boolean;
  gapClassName?: string;
  direction?: "left" | "right";
}) {
  const reduced = useReducedMotion() ?? false;

  if (reduced) {
    return (
      <div className={`flex flex-wrap items-center justify-center ${gapClassName} gap-y-8 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className={`marquee-track flex w-max ${pauseOnHover ? "marquee-pausable" : ""} ${
          direction === "right" ? "marquee-reverse" : ""
        }`}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <div className={`flex shrink-0 items-center ${gapClassName} pr-20 sm:pr-28`}>
          {children}
        </div>
        <div
          className={`flex shrink-0 items-center ${gapClassName} pr-20 sm:pr-28`}
          aria-hidden="true"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
