"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { DEFAULT_ENTITY_LABELS } from "@/lib/config/entity-labels";
import { resolveTokensIfPresent, type LabelsMap } from "@/lib/content/tokens";

type PublicLabelContextValue = {
  labels: LabelsMap;
  label: (key: string, opts?: { plural?: boolean; fallback?: string }) => string;
  resolveTokens: (text: string) => string;
};

const PublicLabelContext = createContext<PublicLabelContextValue | null>(null);

/**
 * Public-site counterpart to `ConfigProvider` (Task 21, Phase 19). Deliberately
 * separate rather than reusing `ConfigProvider` directly: `ConfigProvider`
 * fetches its own data client-side via `useEffect` (fine for the admin panel,
 * where a one-tick label flash on navigation is a non-issue), but public
 * pages care about first-paint correctness — a visitor should never see
 * "Customers" flash to "Clients" a moment later. So this provider takes
 * already-resolved `initialLabels` as a prop, fetched server-side in
 * `app/(user)/layout.tsx`, and never re-fetches on its own.
 */
export function PublicLabelProvider({
  initialLabels,
  children,
}: {
  initialLabels: LabelsMap;
  children: ReactNode;
}) {
  const value = useMemo<PublicLabelContextValue>(() => {
    const labels: LabelsMap = { ...DEFAULT_ENTITY_LABELS, ...initialLabels };
    return {
      labels,
      label: (key, opts) => {
        const entry = labels[key];
        if (entry) return opts?.plural ? entry.plural : entry.singular;
        return opts?.fallback ?? key;
      },
      resolveTokens: (text) => resolveTokensIfPresent(text, labels),
    };
  }, [initialLabels]);

  return <PublicLabelContext.Provider value={value}>{children}</PublicLabelContext.Provider>;
}

/** Passthrough fallback used when `PageHero` (or any other consumer) renders
 * outside `PublicLabelProvider` — e.g. in the admin panel's landing page
 * editor preview. Tokens are left unresolved (returned as-is), which is
 * correct: the admin is looking at the raw `{{service.plural}}` token they
 * typed, and the public site resolves it at render time anyway. */
const FALLBACK_CONTEXT: PublicLabelContextValue = {
  labels: DEFAULT_ENTITY_LABELS as LabelsMap,
  label: (key, opts) => {
    const entry = (DEFAULT_ENTITY_LABELS as LabelsMap)[key];
    if (entry) return opts?.plural ? entry.plural : entry.singular;
    return opts?.fallback ?? key;
  },
  resolveTokens: (text) => text,
};

function usePublicLabelContext(): PublicLabelContextValue {
  return useContext(PublicLabelContext) ?? FALLBACK_CONTEXT;
}

/** Resolve a single entity label — e.g. `usePublicLabel("service", { plural: true })` → "Services" (or "Menu" on a Café profile). */
export function usePublicLabel(key: string, opts?: { plural?: boolean; fallback?: string }): string {
  return usePublicLabelContext().label(key, opts);
}

/** Resolve every `{{entityKey.form}}` token in a string against the current labels — see `lib/content/tokens.ts`. */
export function usePublicLabelTokens(text: string): string {
  return usePublicLabelContext().resolveTokens(text);
}

/**
 * Same as `usePublicLabelTokens`, but returns the resolver function itself
 * rather than a single resolved string — for components that need to resolve
 * a variable number of strings (e.g. mapping over `headingLines`), where
 * calling `usePublicLabelTokens` once per array item would violate the rules
 * of hooks (a hook can't be called a variable number of times per render).
 */
export function usePublicLabelResolver(): (text: string) => string {
  return usePublicLabelContext().resolveTokens;
}
