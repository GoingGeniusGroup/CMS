import type { EntityLabels } from "@/lib/config/entity-labels";

/**
 * Section-level label tokens (Task 23, Phase 19). Lets any CMS text field
 * reference an entity label instead of hardcoding it, so the text survives a
 * future industry-profile switch or label rename without an admin needing to
 * re-edit every section that happens to mention "Services"/"Projects"/etc.
 *
 * Syntax: `{{entityKey.form}}`, optionally with `|lower` to lowercase the
 * result for mid-sentence use (e.g. a placeholder like "Search team
 * member..."). `form` is `singular` or `plural`.
 *
 * Unknown entity keys, or malformed tokens, are left exactly as written
 * rather than throwing or silently disappearing — per the plan's explicit
 * test requirement ("unknown tokens render literally").
 */
export type LabelsMap = Record<string, EntityLabels>;

const TOKEN_RE = /\{\{\s*([a-zA-Z]+)\.(singular|plural)(\|lower)?\s*\}\}/g;

export function resolveTokens(text: string, labels: LabelsMap): string {
  return text.replace(TOKEN_RE, (match, key: string, form: "singular" | "plural", lowerFlag?: string) => {
    const entry = labels[key];
    if (!entry) return match;
    const value = entry[form];
    return lowerFlag ? value.toLowerCase() : value;
  });
}

/** Same as `resolveTokens`, but only runs the regex/replace if `text` might contain a token — a cheap guard for the common case of plain literal strings. */
export function resolveTokensIfPresent(text: string, labels: LabelsMap): string {
  if (!text.includes("{{")) return text;
  return resolveTokens(text, labels);
}
