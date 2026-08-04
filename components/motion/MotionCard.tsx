"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { ReactNode } from "react";
import { HOVER_LIFT, resolveGesture, SPRING_SOFT } from "@/lib/motion/variants";

/**
 * Card shell with a spring hover lift. Two opt-in embellishments:
 *  - `tilt`  — pointer-tracked 3D rotation (subtle, max 6deg)
 *  - `glow`  — gradient border that brightens on hover
 *
 * Both default to off, matching the project's "restrained motion" decision.
 * All motion is skipped entirely under `prefers-reduced-motion`.
 */
export function MotionCard({
  children,
  className = "",
  tilt = false,
  glow = false,
  lift = true,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  glow?: boolean;
  lift?: boolean;
  onClick?: () => void;
}) {
  const reduced = useReducedMotion() ?? false;

  // Pointer position, normalised to -0.5..0.5 and smoothed.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(py, SPRING_SOFT);
  const rotateY = useSpring(px, SPRING_SOFT);
  const transform = useMotionTemplate`perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!tilt || reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    px.set(nx * 12); // ±6deg
    py.set(-ny * 12);
  }

  function handlePointerLeave() {
    px.set(0);
    py.set(0);
  }

  const glowClasses = glow
    ? "before:absolute before:-inset-px before:-z-10 before:rounded-[inherit] before:bg-gradient-to-br before:from-indigo-400/50 before:via-transparent before:to-purple-400/50 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
    : "";

  if (reduced) {
    return (
      <div className={`relative ${glowClasses} ${className}`} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={`relative ${glowClasses} ${className}`}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      whileHover={resolveGesture(lift ? HOVER_LIFT : {}, reduced)}
      style={tilt ? { transform, transformStyle: "preserve-3d" } : undefined}
    >
      {children}
    </motion.div>
  );
}
