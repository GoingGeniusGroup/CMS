"use client";

import { useState, useTransition } from "react";
import { Lock, Sparkles } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ImageUploader } from "@/components/ImageUploader";
import { saveGeneralSettings } from "@/app/actions/general-settings";
import { getReadableTextColor } from "@/lib/color-contrast";

type GeneralSettingData = {
  id: string | null;
  siteName: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  metaKeywords: string;
  themeColor: string;
  themeTextColor: string;
  baseColorEnabled: boolean;
};

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative h-7 w-12 rounded-full transition-colors ${on ? "bg-emerald-500" : "bg-zinc-300"}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${on ? "left-6" : "left-1"}`}
      />
    </button>
  );
}

export default function GeneralSettingsClient({ initialData }: { initialData: GeneralSettingData }) {
  const [form, setForm] = useState(initialData);
  const [themeColor, setThemeColor] = useState(initialData.themeColor || "#6366f1");
  const [themeTextColor, setThemeTextColor] = useState(
    initialData.themeTextColor || "#ffffff"
  );
  const [description, setDescription] = useState(initialData.description || "");
  const [metaKeywords, setMetaKeywords] = useState(initialData.metaKeywords || "");
  const [baseColorEnabled, setBaseColorEnabled] = useState(initialData.baseColorEnabled);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // The best-contrast text color for the current theme color.
  const recommendedTextColor = getReadableTextColor(themeColor);
  const isUsingRecommended =
    themeTextColor.toLowerCase() === recommendedTextColor.toLowerCase();

  // Baseline of the last-saved values, advanced after every successful save so
  // re-entering a previously-saved value is still detected as a change.
  const [baseline, setBaseline] = useState({
    siteName: initialData.siteName,
    logoUrl: initialData.logoUrl,
    faviconUrl: initialData.faviconUrl,
    themeColor: initialData.themeColor || "#6366f1",
    themeTextColor: initialData.themeTextColor || "#ffffff",
    description: initialData.description || "",
    metaKeywords: initialData.metaKeywords || "",
    baseColorEnabled: initialData.baseColorEnabled,
  });

  const hasChanges =
    form.siteName !== baseline.siteName ||
    form.logoUrl !== baseline.logoUrl ||
    form.faviconUrl !== baseline.faviconUrl ||
    themeColor !== baseline.themeColor ||
    themeTextColor !== baseline.themeTextColor ||
    description !== baseline.description ||
    metaKeywords !== baseline.metaKeywords ||
    baseColorEnabled !== baseline.baseColorEnabled;

  function set(field: keyof GeneralSettingData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // When the theme color changes, always update the text color to the best-contrast
  // match for the new theme. The user can still manually override it afterwards.
  function handleThemeColorChange(value: string) {
    setThemeColor(value);
    if (/^#[0-9a-fA-F]{6}$/.test(value) || /^#[0-9a-fA-F]{3}$/.test(value)) {
      setThemeTextColor(getReadableTextColor(value));
    }
  }

  function handleCancel() {
    setForm((prev) => ({
      ...prev,
      siteName: baseline.siteName,
      logoUrl: baseline.logoUrl,
      faviconUrl: baseline.faviconUrl,
    }));
    setThemeColor(baseline.themeColor);
    setThemeTextColor(baseline.themeTextColor);
    setDescription(baseline.description);
    setMetaKeywords(baseline.metaKeywords);
    setBaseColorEnabled(baseline.baseColorEnabled);
    setMessage(null);
  }

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      const res = await saveGeneralSettings({
        siteName: form.siteName,
        description,
        logoUrl: form.logoUrl,
        faviconUrl: form.faviconUrl,
        metaKeywords,
        themeColor,
        themeTextColor,
        baseColorEnabled,
      });
      if (res.success) {
        setBaseline({
          siteName: form.siteName,
          logoUrl: form.logoUrl,
          faviconUrl: form.faviconUrl,
          themeColor,
          themeTextColor,
          description,
          metaKeywords,
          baseColorEnabled,
        });
      }
      setMessage(
        res.success
          ? { type: "success", text: "Settings saved successfully." }
          : { type: "error", text: res.error ?? "Failed to save." }
      );
    });
  }

  return (
    <>
      <div className="sticky top-0 z-10 mb-6 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <Lock className="h-4 w-4" />
            </span>
            <div>
              <h1 className="text-base font-bold text-amber-500 sm:text-lg">General Settings</h1>
              <p className="text-xs text-zinc-500">Manage the websites basic information and appearance</p>
            </div>
          </div>
          {hasChanges && (
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleCancel} disabled={isPending}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={isPending}
              className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
              {isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>
          )}
        </div>
      </div>

      {message && (
        <p
          className={`mb-6 rounded-lg px-4 py-2 text-sm font-medium ${
            message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          {message.text}
        </p>
      )}

    <Card className="lg:p-8">
      {/* Logo + Favicon */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">Site Logo</label>
          <ImageUploader
            value={form.logoUrl || null}
            onChange={(url) => set("logoUrl", url ?? "")}
            label="Site Logo"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">Favicon</label>
          <ImageUploader
            value={form.faviconUrl || null}
            onChange={(url) => set("faviconUrl", url ?? "")}
            label="Favicon"
          />
        </div>
      </div>

      {/* Title + Theme color */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            App/Site Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={form.siteName}
            onChange={(e) => set("siteName", e.target.value)}
            className="h-11 w-full rounded-lg border border-zinc-200 px-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Default Theme Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={themeColor}
              onChange={(e) => handleThemeColorChange(e.target.value)}
              className="h-11 w-16 shrink-0 cursor-pointer rounded-lg border border-zinc-200 bg-white p-1 shadow-sm sm:w-24"
            />
            <input
              type="text"
              value={themeColor}
              onChange={(e) => handleThemeColorChange(e.target.value)}
              maxLength={7}
              className="h-11 w-full min-w-0 flex-1 rounded-lg border border-zinc-200 px-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200 sm:w-28 sm:flex-none"
            />
          </div>
        </div>
      </div>

      {/* Theme Text Color */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Default Text Color
          </label>
          <p className="mb-2 text-xs text-zinc-500">
            Text color used on top of the theme color (buttons, badges, banners).
          </p>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={themeTextColor}
              onChange={(e) => setThemeTextColor(e.target.value)}
              className="h-11 w-16 shrink-0 cursor-pointer rounded-lg border border-zinc-200 bg-white p-1 shadow-sm sm:w-24"
            />
            <input
              type="text"
              value={themeTextColor}
              onChange={(e) => setThemeTextColor(e.target.value)}
              maxLength={7}
              className="h-11 w-full min-w-0 flex-1 rounded-lg border border-zinc-200 px-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200 sm:w-28 sm:flex-none"
            />
          </div>

          {/* Recommendation hint */}
          {!isUsingRecommended && (
            <button
              type="button"
              onClick={() => setThemeTextColor(recommendedTextColor)}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Use recommended ({recommendedTextColor === "#000000" ? "Black" : "White"})
            </button>
          )}
          {isUsingRecommended && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <Sparkles className="h-3.5 w-3.5" />
              Best contrast for this theme color
            </p>
          )}
        </div>

        {/* Live preview */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">Preview</label>
          <div
            className="flex h-[92px] items-center justify-center gap-3 rounded-lg border border-zinc-200 shadow-sm"
            style={{ backgroundColor: themeColor }}
          >
            <span className="text-base font-bold" style={{ color: themeTextColor }}>
              {form.siteName || "Sample Text"}
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: themeTextColor, color: themeColor }}
            >
              Button
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-semibold text-black">Description</label>
        <div className="relative">
          <textarea
            rows={4}
            maxLength={160}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full resize-none rounded-lg border border-zinc-200 p-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
          />
          <span className="pointer-events-none absolute bottom-3 right-4 text-xs text-zinc-400">
            {description.length}/160
          </span>
        </div>
      </div>

      {/* Meta keywords */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-semibold text-black">Meta Keywords</label>
        <input
          type="text"
          value={metaKeywords}
          onChange={(e) => setMetaKeywords(e.target.value)}
          className="h-11 w-full rounded-lg border border-zinc-200 px-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>

      {/* Base color toggle */}
      <div className="mt-6 flex items-center gap-4">
        <span className="text-sm font-semibold text-black">Website Base Color</span>
        <Toggle on={baseColorEnabled} onToggle={() => setBaseColorEnabled((v) => !v)} />
        <span className="text-sm font-semibold text-black">Enable</span>
      </div>
    </Card>
    </>
  );
}
