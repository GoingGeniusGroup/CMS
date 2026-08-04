"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, resolveVariants } from "@/lib/motion/variants";

/**
 * Fades + lifts its children into view the first time they scroll into frame.
 * Renders a plain <div> when the user prefers reduced motion.
 */
export function RevealOnScroll({
  children,
  className,
  delay = 0,
  amount = 0.2,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  /** Seconds to wait after entering the viewport. */
  delay?: number;
  /** Fraction of the element that must be visible before animating (0–1). */
  amount?: number;
  once?: boolean;
}) {
  const reduced = useReducedMotion() ?? false;

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={resolveVariants(fadeUp, reduced)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
