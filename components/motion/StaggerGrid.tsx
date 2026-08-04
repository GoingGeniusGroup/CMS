"use client";

import { forwardRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, resolveStagger, resolveVariants } from "@/lib/motion/variants";

/**
 * Wraps a grid/row so its direct children animate in one after another as the
 * container scrolls into view. Children must be <StaggerItem> to participate.
 *
 * Forwards its ref to the underlying element so it can double as a scroll
 * container (e.g. a horizontally-scrollable rail driven by external buttons).
 */
export const StaggerGrid = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    /** Gap between each child's start, in seconds. */
    stagger?: number;
    amount?: number;
    once?: boolean;
  }
>(function StaggerGrid({ children, className, style, stagger = 0.08, amount = 0.15, once = true }, ref) {
  const reduced = useReducedMotion() ?? false;

  if (reduced) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      variants={resolveStagger(stagger, reduced)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  );
});

/** A single staggered child. No-ops under reduced motion. */
export const StaggerItem = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(
  function StaggerItem({ children, className }, ref) {
    const reduced = useReducedMotion() ?? false;

    if (reduced) {
      return (
        <div ref={ref} className={className}>
          {children}
        </div>
      );
    }

    return (
      <motion.div ref={ref} className={className} variants={resolveVariants(fadeUp, reduced)}>
        {children}
      </motion.div>
    );
  }
);
