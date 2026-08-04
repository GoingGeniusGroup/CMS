import { getPublicEntityLabels } from "@/app/actions/labels";
import { resolveTokensIfPresent } from "@/lib/content/tokens";

/**
 * Server-side counterpart to `usePublicLabelTokens` (Task 24, Phase 19) — for
 * use in `generateMetadata`, which runs on the server and has no access to
 * `PublicLabelProvider`'s React context. Fetches the same cached, tagged
 * label read used everywhere else on the public site.
 */
export async function resolveTokensOnServer(text: string): Promise<string> {
  if (!text.includes("{{")) return text;
  const labels = await getPublicEntityLabels();
  return resolveTokensIfPresent(text, labels);
}
