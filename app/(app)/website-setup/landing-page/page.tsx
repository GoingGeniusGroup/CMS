import { auth } from "@/auth";
import { getPageContent, type SiteContentSection } from "@/app/actions/site-content";
import { SECTION_REGISTRY, type SectionKey } from "@/lib/content/schemas";
import { LandingPageClient } from "./LandingPageClient";

/**
 * Human-friendly labels for each editable page bucket, in the order they
 * should appear as tabs in the editor. Derived list (not hardcoded) comes
 * from every distinct `pageKey` actually present in `SECTION_REGISTRY`, so a
 * new page's sections automatically get a tab here — only the *label* needs
 * adding manually, defaulting to a capitalized version of the key otherwise.
 */
const PAGE_LABELS: Record<string, string> = {
  home: "Homepage",
  shared: "Shared (Home, Company, Contact)",
  "our-services": "Services Page",
  "our-projects": "Projects Page",
  contact: "Contact Page",
  "about-us": "About Us Page",
  career: "Careers Page",
  blogs: "Blog Listing Page",
  teams: "Team Page",
};

function labelForPage(pageKey: string): string {
  return PAGE_LABELS[pageKey] ?? pageKey.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Website Setup > Landing Page editor (Phase 17, extended in Phase 18 to
 * cover every page with editable content, not just `home`/`shared`).
 *
 * Lists every editable section, grouped by page, as a reorderable,
 * toggleable, editable list — backed entirely by the `SiteContent` table +
 * `SECTION_REGISTRY`.
 */
export default async function LandingPageEditorPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const pageKeys = [...new Set(Object.values(SECTION_REGISTRY).map((entry) => entry.pageKey))];

  const sectionsByPage = await Promise.all(pageKeys.map((pageKey) => getPageContent(pageKey)));

  // getPageContent only returns rows that already exist in the DB. Any
  // registry entry with no row yet (a fresh install that hasn't run
  // `seed-site-content`) still needs to show up in the editor with its
  // default payload — otherwise a brand-new section silently disappears
  // from the list instead of being editable from its default state.
  function withMissingDefaults(pageKey: string, existing: SiteContentSection[]) {
    const present = new Set(existing.map((s) => s.sectionKey));
    const missing = (Object.keys(SECTION_REGISTRY) as SectionKey[])
      .filter((key) => SECTION_REGISTRY[key].pageKey === pageKey && !present.has(key))
      .map((key) => {
        const entry = SECTION_REGISTRY[key];
        return {
          sectionKey: key,
          pageKey,
          variant: "default",
          isVisible: true,
          order: entry.defaultOrder,
          data: entry.defaultData,
        } as SiteContentSection;
      });
    return [...existing, ...missing].sort((a, b) => a.order - b.order);
  }

  const pages = pageKeys.map((pageKey, i) => ({
    pageKey,
    label: labelForPage(pageKey),
    sections: withMissingDefaults(pageKey, sectionsByPage[i]),
  }));

  return <LandingPageClient pages={pages} />;
}
