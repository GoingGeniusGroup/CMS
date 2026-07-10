"use client";

import { useState, useTransition } from "react";
import { Lock } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ImageUploader } from "@/components/ImageUploader";
import { saveGeneralSettings } from "@/app/actions/general-settings";

type GeneralSettingData = {
  id: string | null;
  siteName: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  metaKeywords: string;
  themeColor: string;
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
  const [description, setDescription] = useState(initialData.description || "");
  const [metaKeywords, setMetaKeywords] = useState(initialData.metaKeywords || "");
  const [baseColorEnabled, setBaseColorEnabled] = useState(initialData.baseColorEnabled);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function set(field: keyof GeneralSettingData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
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
        baseColorEnabled,
      });
      setMessage(
        res.success
          ? { type: "success", text: "Settings saved successfully." }
          : { type: "error", text: res.error ?? "Failed to save." }
      );
    });
  }

  return (
    <Card className="lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <Lock className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-amber-500 sm:text-2xl">General Settings</h1>
          </div>
          <p className="mt-2 text-sm text-black">
            Manage the websites basic information and appearance
          </p>
        </div>
        <Button onClick={handleSave} disabled={isPending} className="shrink-0">
          {isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>

      {message && (
        <p
          className={`mt-4 rounded-lg px-4 py-2 text-sm font-medium ${
            message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          {message.text}
        </p>
      )}

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
              onChange={(e) => setThemeColor(e.target.value)}
              className="h-11 w-16 shrink-0 cursor-pointer rounded-lg border border-zinc-200 bg-white p-1 shadow-sm sm:w-24"
            />
            <input
              type="text"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              maxLength={7}
              className="h-11 w-full min-w-0 flex-1 rounded-lg border border-zinc-200 px-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200 sm:w-28 sm:flex-none"
            />
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
  );
}
