/**
 * Pure text logic extracted out of `PageHero` so it's unit-testable without a
 * DOM (this repo's Vitest setup runs in a plain Node environment — see
 * `vitest.config.mts` — with no jsdom/testing-library, so `.tsx` component
 * logic generally isn't directly testable; this file exists specifically to
 * pull the one piece of `PageHero` with real edge cases out into something
 * that is).
 */

export type HighlightSplit = { before: string; match: string; after: string };

/**
 * Splits `line` around the first occurrence of `highlight`, so the caller can
 * render the matched portion in an accent color. Returns `null` when there's
 * nothing to highlight — either `highlight` is falsy/empty, or it doesn't
 * appear in `line` at all — so the caller can fall back to plain text.
 *
 * Only the first occurrence is highlighted even if `highlight` appears
 * multiple times in `line`, matching how a heading like "Build Smarter,
 * Build Faster" with highlight "Build" should accent just the first "Build".
 */
export function splitHighlight(line: string, highlight?: string): HighlightSplit | null {
  if (!highlight) return null;
  const index = line.indexOf(highlight);
  if (index === -1) return null;

  return {
    before: line.slice(0, index),
    match: highlight,
    after: line.slice(index + highlight.length),
  };
}
