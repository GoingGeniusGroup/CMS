"use client";

import { useState } from "react";
import { Loader2, Plus, Search, Shapes, Trash2, X } from "lucide-react";
import { Card } from "@/components/Card";
import { ImageUploader } from "@/components/ImageUploader";
import { saveSiteIcons, saveCustomIcons, deleteCustomIcon } from "@/app/actions/icons";
import { getHeroStatIcon } from "@/lib/content/hero-icons";

type IconOption = { name: string; enabled: boolean };
export type CustomIcon = { id: string; name: string; url: string };

/**
 * Settings > Icons. Admin chooses which icons are offered in section-form icon
 * dropdowns (Landing Page editor, stats/cards/timeline/two-column/careers).
 * Each row is a live preview + enable toggle; changes are saved in one pass.
 * Admins can also upload their own custom SVG/PNG icons.
 */
export function IconsClient({
  initialIcons,
  initialCustomIcons,
}: {
  initialIcons: IconOption[];
  initialCustomIcons: CustomIcon[];
}) {
  const [icons, setIcons] = useState<IconOption[]>(initialIcons);
  const [customIcons, setCustomIcons] = useState<CustomIcon[]>(initialCustomIcons);
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Custom icon upload state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newIconName, setNewIconName] = useState("");
  const [newIconUrl, setNewIconUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const selected = icons.filter((i) => i.enabled).length;
  const query = search.trim().toLowerCase();
  const filtered = query
    ? icons.filter((i) => i.name.includes(query))
    : icons;

  function setEnabled(name: string, enabled: boolean) {
    setIcons((prev) => prev.map((i) => (i.name === name ? { ...i, enabled } : i)));
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

  async function handleAddCustomIcon() {
    if (!newIconName.trim() || !newIconUrl) return;
    setIsUploading(true);
    const result = await saveCustomIcons([
      ...customIcons,
      { id: crypto.randomUUID(), name: newIconName.trim().toLowerCase().replace(/\s+/g, "-"), url: newIconUrl },
    ]);
    setIsUploading(false);
    if (result.success && result.icons) {
      setCustomIcons(result.icons);
      setNewIconName("");
      setNewIconUrl("");
      setShowUploadForm(false);
      setMessage({ type: "success", text: "Custom icon added!" });
    } else {
      setMessage({ type: "error", text: result.error || "Failed to add icon" });
    }
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleDeleteCustomIcon(id: string) {
    const result = await deleteCustomIcon(id);
    if (result.success) {
      setCustomIcons((prev) => prev.filter((i) => i.id !== id));
      setMessage({ type: "success", text: "Custom icon removed." });
    } else {
      setMessage({ type: "error", text: result.error || "Failed to remove icon" });
    }
    setTimeout(() => setMessage(null), 3000);
  }

  const inputCls =
    "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-indigo-400 focus:bg-white";

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-10 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <Shapes className="h-4 w-4" />
            </span>
            <div>
              <h1 className="text-base font-bold text-amber-500 sm:text-lg">Icons</h1>
              <p className="text-xs text-zinc-500">Choose which icons appear in section forms. Toggle on/off, then save.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
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

      {/* Custom Icons Section */}
      <Card noPadding className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-black">Custom Icons</h3>
            <p className="mt-0.5 text-xs text-zinc-500">Upload your own icons (SVG or PNG recommended).</p>
          </div>
          <button
            type="button"
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            {showUploadForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {showUploadForm ? "Cancel" : "Add Icon"}
          </button>
        </div>

        {showUploadForm && (
          <div className="border-b border-gray-100 bg-zinc-50/50 px-6 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-zinc-800">Icon Name</label>
                <input
                  type="text"
                  value={newIconName}
                  onChange={(e) => setNewIconName(e.target.value)}
                  placeholder="e.g. custom-rocket"
                  className={inputCls}
                />
                <p className="mt-1 text-xs text-zinc-400">Lowercase, use dashes for spaces.</p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-zinc-800">Icon Image</label>
                <ImageUploader
                  value={newIconUrl || null}
                  onChange={(url) => setNewIconUrl(url ?? "")}
                  label=""
                  compact
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleAddCustomIcon}
                disabled={isUploading || !newIconName.trim() || !newIconUrl}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {isUploading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {isUploading ? "Adding..." : "Add Custom Icon"}
              </button>
            </div>
          </div>
        )}

        {customIcons.length === 0 && !showUploadForm ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <Plus className="h-8 w-8 text-zinc-200" />
            <p className="text-sm text-zinc-400">No custom icons yet.</p>
            <p className="text-xs text-zinc-300">Click &ldquo;Add Icon&rdquo; to upload your own.</p>
          </div>
        ) : customIcons.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {customIcons.map((icon) => (
              <div
                key={icon.id}
                className="relative flex flex-col items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/30 px-3 py-4 text-center"
              >
                <button
                  type="button"
                  onClick={() => handleDeleteCustomIcon(icon.id)}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                  aria-label={`Delete ${icon.name}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-zinc-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={icon.url} alt={icon.name} className="h-5 w-5 object-contain" />
                </div>
                <span className="w-full truncate text-xs font-medium text-zinc-600" title={icon.name}>
                  {icon.name}
                </span>
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-600">
                  Custom
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </Card>

      {/* Built-in Icons */}
      <Card noPadding className="overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h3 className="text-lg font-bold text-black">
            Built-in Icons ({selected} of {icons.length} enabled)
          </h3>
          <div className="mt-3 max-w-sm">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search icons..."
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
    </div>
  );
}
