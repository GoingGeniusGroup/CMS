"use client";

import { useState, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import { SECTION_REGISTRY, type SectionDataFor, type SectionKey, type HeroData } from "@/lib/content/schemas";
import { saveSection, type SiteContentSection } from "@/app/actions/site-content";
import { PageHero } from "@/components/content/PageHero";
import { SectionHeaderForm } from "./forms/SectionHeaderForm";
import { HeroForm } from "./forms/HeroForm";
import { CardsForm } from "./forms/CardsForm";
import { StatsForm } from "./forms/StatsForm";
import { CtaForm } from "./forms/CtaForm";
import { TimelineForm } from "./forms/TimelineForm";
import { TwoColumnForm } from "./forms/TwoColumnForm";
import { CareersForm } from "./forms/CareersForm";
import { LifeForm } from "./forms/LifeForm";

const SHARED_PAGE_NOTE =
  "This section is also shown, unchanged, on the Company and Contact pages — editing it here updates all three.";

/**
 * Dispatches to the right form by the section's `kind` (Task 14: hero /
 * sectionHeader; Task 15: cards). Each form manages its own local draft state
 * and reports back a plain, schema-shaped object via `onChange` — this modal
 * only owns the save/cancel lifecycle and validation-error display, not any
 * field-level state.
 */
export function SectionEditorModal({
  row,
  onClose,
  onSaved,
}: {
  row: SiteContentSection | null;
  onClose: () => void;
  onSaved: (data: unknown) => void;
}) {
  const [draft, setDraft] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();

  if (!row) return null;

  const entry = SECTION_REGISTRY[row.sectionKey];
  const currentData = (draft ?? row.data) as SectionDataFor<SectionKey>;

  function handleSave() {
    setError(null);
    startSaving(async () => {
      const result = await saveSection(row!.pageKey, row!.sectionKey, currentData);
      if (result.success) {
        onSaved(currentData);
        setDraft(null);
      } else {
        setError(result.error ?? "Failed to save section");
      }
    });
  }

  function handleClose() {
    setDraft(null);
    setError(null);
    onClose();
  }

  const isHero = entry.kind === "hero";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className={`relative flex max-h-[90vh] w-full flex-col rounded-2xl bg-white shadow-xl ${
          isHero ? "max-w-5xl" : "max-w-2xl"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">{entry.label}</h2>
            <p className="text-xs text-zinc-500">
              {row.pageKey === "shared" ? SHARED_PAGE_NOTE : `Changes here appear on the public ${row.pageKey} page.`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-zinc-400 hover:text-zinc-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto ${isHero ? "grid gap-0 lg:grid-cols-2" : ""}`}>
          <div className="px-6 py-5">
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {entry.kind === "hero" && (
              <HeroForm data={currentData as never} onChange={(d) => setDraft(d)} />
            )}
            {entry.kind === "sectionHeader" && (
              <SectionHeaderForm data={currentData as never} onChange={(d) => setDraft(d)} />
            )}
            {entry.kind === "cards" && (
              <CardsForm data={currentData as never} onChange={(d) => setDraft(d)} />
            )}
            {entry.kind === "stats" && (
              <StatsForm data={currentData as never} onChange={(d) => setDraft(d)} />
            )}
            {entry.kind === "cta" && (
              <CtaForm data={currentData as never} onChange={(d) => setDraft(d)} />
            )}
            {entry.kind === "timeline" && (
              <TimelineForm data={currentData as never} onChange={(d) => setDraft(d)} />
            )}
            {entry.kind === "twoColumn" && (
              <TwoColumnForm data={currentData as never} onChange={(d) => setDraft(d)} />
            )}
            {entry.kind === "careers" && (
              <CareersForm data={currentData as never} onChange={(d) => setDraft(d)} />
            )}
            {entry.kind === "life" && (
              <LifeForm data={currentData as never} onChange={(d) => setDraft(d)} />
            )}
          </div>

          {/* Live preview (Task 18) — hero-only for now, since a scaled-down
              hero conveys layout/variant changes far better than a text form
              alone does; sectionHeader/cards forms already show their text
              directly, so the marginal value of a preview there is lower. */}
          {isHero && (
            <div className="hidden border-l border-zinc-100 bg-zinc-50 lg:block">
              <p className="border-b border-zinc-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                Live Preview
              </p>
              <div className="origin-top-left scale-[0.55]" style={{ width: "182%" }}>
                <PageHero data={currentData as HeroData} />
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
