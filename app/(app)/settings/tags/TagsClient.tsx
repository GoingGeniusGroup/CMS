"use client";

import { useState, useTransition } from "react";
import { Tags, Plus, X } from "lucide-react";
import { Card } from "@/components/Card";
import { useConfig } from "@/components/ConfigProvider";
import { addTag, removeTag, type TagVocabularies } from "@/app/actions/tags";

// Modules that support a tag vocabulary. Keyed by entity label key so the
// displayed module name always matches the active industry profile.
const TAG_MODULES: Array<{ moduleKey: string; labelKey: string; fallback: string }> = [
  { moduleKey: "project", labelKey: "project", fallback: "Projects" },
  { moduleKey: "service", labelKey: "service", fallback: "Services" },
  { moduleKey: "customer", labelKey: "customer", fallback: "Customers" },
  { moduleKey: "blog", labelKey: "blog", fallback: "Blog" },
];

export function TagsClient({ initialVocabularies }: { initialVocabularies: TagVocabularies }) {
  const { entityLabel } = useConfig();
  const [vocabularies, setVocabularies] = useState(initialVocabularies);
  const [activeModule, setActiveModule] = useState(TAG_MODULES[0].moduleKey);
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentTags = vocabularies[activeModule] ?? [];

  function handleAdd() {
    const trimmed = newTag.trim();
    if (!trimmed) {
      setError("Tag cannot be empty");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await addTag(activeModule, trimmed);
      if (result.success && result.tags) {
        setVocabularies((prev) => ({ ...prev, [activeModule]: result.tags! }));
        setNewTag("");
      } else {
        setError(result.error ?? "Failed to add tag");
      }
    });
  }

  function handleRemove(tag: string) {
    startTransition(async () => {
      const result = await removeTag(activeModule, tag);
      if (result.success) {
        setVocabularies((prev) => ({
          ...prev,
          [activeModule]: (prev[activeModule] ?? []).filter((t) => t !== tag),
        }));
      }
    });
  }

  return (
    <>
      <div className="sticky top-0 z-10 mb-6 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
            <Tags className="h-4 w-4" />
          </span>
          <div>
            <h1 className="text-base font-bold text-amber-500 sm:text-lg">Tag Vocabularies</h1>
            <p className="text-xs text-zinc-500">
              Manage suggested tags per module. These appear as quick-add options when tagging records.
            </p>
          </div>
        </div>
      </div>

      {/* Module tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TAG_MODULES.map((m) => {
          const label = entityLabel(m.labelKey, { plural: true, fallback: m.fallback });
          const active = activeModule === m.moduleKey;
          return (
            <button
              key={m.moduleKey}
              type="button"
              onClick={() => {
                setActiveModule(m.moduleKey);
                setError(null);
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active ? "bg-amber-500 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <Card className="mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-semibold text-black">New Tag</label>
            <input
              type="text"
              value={newTag}
              onChange={(e) => {
                setNewTag(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              placeholder="e.g. Featured"
              className="h-11 w-full rounded-lg border border-zinc-200 px-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
            />
            {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-4 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add Tag
          </button>
        </div>
      </Card>

      <Card>
        {currentTags.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
            <Tags className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">No tags yet for this module. Add your first one above.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {currentTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemove(tag)}
                  disabled={isPending}
                  className="text-indigo-400 hover:text-indigo-700 disabled:opacity-50"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
