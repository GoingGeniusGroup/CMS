/**
 * Single source of truth for turning a service name into its public URL
 * slug (`/servicedetail/[slug]`).
 *
 * Previously this logic was duplicated in 4 different places, and two
 * different orderings of the same two operations were used:
 *   - some call sites replaced whitespace with "-" BEFORE stripping
 *     non-alphanumeric characters, so "Cloud & DevOps" -> "cloud-&-devops"
 *     -> "cloud--devops" (the "&" is stripped, leaving a double hyphen)
 *   - the lookup in app/actions/services.ts stripped non-alphanumeric
 *     characters FIRST, then collapsed whitespace and repeated hyphens, so
 *     the same name became "cloud-devops"
 *
 * Because the generated links never matched what the detail page looked up,
 * visiting a service card 404'd. All slug generation and lookup must go
 * through this single function.
 */
export function serviceSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
