"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export type RosterMember = {
  id: string;
  fullName: string;
  role: string | null;
  department: string | null;
  image: string | null;
};

/**
 * Builds the shared `layoutId` used to morph a member's portrait from the
 * roster's floating hover preview into the detail modal. `namespace` scopes
 * this per roster instance (e.g. per department group) so multiple rosters on
 * the same page never collide.
 */
export function getTeamPortraitLayoutId(namespace: string, memberId: string) {
  return `team-portrait-${namespace}-${memberId}`;
}

/**
 * Editorial name-roster — deliberately not a card grid.
 *
 * Each row is set in large type, like a masthead or credits list. On desktop,
 * hovering a row floats that member's photo in beside the cursor, tracked with
 * a spring; on touch devices the photo is inline instead, since there's no
 * hover to reveal it. Clicking a row hands off to `onSelect`, which the caller
 * pairs with a `layoutId`-matched modal for the portrait to morph into.
 *
 * `groupLabel` is optional so the same component works for a flat "Our Team"
 * rail and for department-grouped sections without a separate implementation.
 */
export function TeamRoster({
  members,
  onSelect,
  groupLabel,
  namespace = "default",
}: {
  members: RosterMember[];
  onSelect: (member: RosterMember) => void;
  groupLabel?: string;
  /** Scopes this roster's shared-element `layoutId`s; see {@link getTeamPortraitLayoutId}. */
  namespace?: string;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion() ?? false;

  if (members.length === 0) return null;

  const hovered = members.find((m) => m.id === hoveredId) ?? null;

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    setCursor({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
  }

  return (
    <div className="relative" onMouseLeave={() => setHoveredId(null)}>
      {groupLabel && (
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-indigo-600">
          {groupLabel}
        </p>
      )}

      <div
        role="list"
        onMouseMove={handleMove}
        className="divide-y divide-zinc-200 border-y border-zinc-200"
      >
        {members.map((member, index) => {
          const isHovered = hoveredId === member.id;
          return (
            <div
              key={member.id}
              role="listitem"
              onMouseEnter={() => setHoveredId(member.id)}
              onFocus={() => setHoveredId(member.id)}
              onBlur={() => setHoveredId((id) => (id === member.id ? null : id))}
              className="relative"
            >
              <button
                type="button"
                onClick={() => onSelect(member)}
                aria-label={`View profile: ${member.fullName}`}
                className="group flex w-full items-baseline justify-between gap-6 py-5 text-left transition-colors focus:outline-none focus-visible:bg-zinc-50 sm:py-7"
              >
                <span className="flex min-w-0 items-baseline gap-4 sm:gap-6">
                  <span className="hidden shrink-0 font-mono text-xs text-zinc-400 sm:inline">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Inline photo — the only place it appears on touch devices,
                      since there's no hover to trigger the floating one. */}
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 sm:hidden">
                    {member.image ? (
                      <Image src={member.image} alt="" fill sizes="40px" className="object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-sm font-bold text-zinc-400">
                        {member.fullName.charAt(0)}
                      </span>
                    )}
                  </span>

                  <span
                    className={`truncate text-2xl font-extrabold tracking-tight transition-colors sm:text-4xl ${
                      isHovered ? "text-indigo-600" : "text-zinc-900"
                    }`}
                  >
                    {member.fullName}
                  </span>
                </span>

                <span className="flex shrink-0 items-center gap-2 text-right">
                  <span className="hidden text-sm text-zinc-500 sm:inline">
                    {member.role || member.department || "Team Member"}
                  </span>
                  <ArrowUpRight
                    className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${
                      isHovered ? "translate-x-0.5 -translate-y-0.5 text-indigo-600" : ""
                    }`}
                  />
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Floating portrait — desktop hover only. Positioned relative to the
          roster container and offset from the cursor so it never sits under it. */}
      {!reduced && (
        <AnimatePresence>
          {hovered && (
            <motion.div
              key={hovered.id}
              className="pointer-events-none absolute z-10 hidden overflow-hidden rounded-2xl border-4 border-white shadow-2xl sm:block"
              style={{ width: 180, height: 220 }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{
                opacity: 1,
                scale: 1,
                left: cursor.x + 32,
                top: cursor.y - 110,
              }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.5 }}
            >
              <motion.div layoutId={getTeamPortraitLayoutId(namespace, hovered.id)} className="h-full w-full">
                {hovered.image ? (
                  <Image
                    src={hovered.image}
                    alt=""
                    fill
                    sizes="180px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                    <span className="text-4xl font-extrabold text-indigo-300">
                      {hovered.fullName.charAt(0)}
                    </span>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
