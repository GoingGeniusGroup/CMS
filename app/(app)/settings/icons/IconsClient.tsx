"use client";

import { useState } from "react";
import { Loader2, Search, Shapes } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/Card";
import { saveSiteIcons } from "@/app/actions/icons";
import { getHeroStatIcon } from "@/lib/content/hero-icons";

type IconOption = { name: string; enabled: boolean };

/**
 * Settings > Icons. Admin chooses which icons are offered in section-form icon
 * dropdowns (Landing Page editor, stats/cards/timeline/two-column/careers).
 * Each row is a live preview + enable toggle; changes are saved in one pass.
 */
export function IconsClient({ initialIcons }: { initialIcons: IconOption[] }) {
  const [icons, setIcons] = useState<IconOption[]>(initialIcons);
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const selected = icons.filter((i) => i.enabled).length;
  const query = search.trim().toLowerCase();
  const filtered = query
    ? icons.filter((i) => i.name.includes(query))
    : icons;

  function setEnabled(name: string, enabled: boolean) {
    setIcons((prev) => prev.map((i) => (i.name === name ? { ...i, enabled } : i)));
  }

  function setAll(enabled: boolean) {
    setIcons((prev) => prev.map((i) => ({ ...i, enabled })));
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);
    const result = await saveSiteIcons(icons.filter((i) => i.enabled).map((i) => i.name));
    setIsSaving(false);
    setMessage(
      result.success
        ? { type: "success", text: "Icons saved successfully!" }
        : { type: "error", text: result.error || "Failed to save icons" }
    );
    setTimeout(() => setMessage(null), 3000);
  }

  const inputCls =
    "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-indigo-400 focus:bg-white";

  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar showSearch={false} />

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader
          title="Icons"
          description="Choose which icons appear in section forms (stat cards, card grids, two-column, careers). Toggle icons on or off, then save."
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAll(true)}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
          >
            Select all
          </button>
          <button
            type="button"
            onClick={() => setAll(false)}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
          >
            Clear all
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            message.type === "success"
              ? "border border-green-200 bg-green-50 text-green-700"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <Card noPadding className="overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h3 className="text-lg font-bold text-black">
            Available for section forms ({selected} of {icons.length} enabled)
          </h3>
          <div className="mt-3 max-w-sm">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search icons…"
                className={`${inputCls} pl-9`}
              />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
            <Shapes className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">No icons match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map(({ name, enabled }) => {
              const Icon = getHeroStatIcon(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setEnabled(name, !enabled)}
                  aria-pressed={enabled}
                  className={`relative flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition-all ${
                    enabled
                      ? "border-indigo-400 bg-indigo-50/60 shadow-sm"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                    {Icon && <Icon className="h-5 w-5" />}
                  </div>
                  <span className="w-full truncate text-xs font-medium text-zinc-600" title={name}>
                    {name}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      enabled
                        ? "bg-indigo-600 text-white"
                        : "bg-zinc-100 text-zinc-400"
                    }`}
                  >
                    {enabled ? "Enabled" : "Disabled"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </Card>

      <div className="flex justify-end max-md:sticky max-md:bottom-0 max-md:z-10 max-md:bg-white max-md:border-t max-md:border-gray-200 max-md:py-4 max-md:-mx-6 max-md:px-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}