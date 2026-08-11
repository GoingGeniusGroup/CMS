"use client";

import { useState, useRef, useEffect } from "react";
import { Cpu, Trash2, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/Card";
import { ImageUploader } from "@/components/ImageUploader";
import { saveSetting } from "@/app/actions/settings";

export function TechnologiesClient({ initialTechnologies, initialBgColor, initialTextColor }: { initialTechnologies: string[]; initialBgColor?: string; initialTextColor?: string }) {
  const [technologies, setTechnologies] = useState<string[]>(initialTechnologies);
  const [bgColor, setBgColor] = useState(initialBgColor || "#ffffff");
  const [textColor, setTextColor] = useState(initialTextColor || "#18181b");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const techRef = useRef(technologies);
  useEffect(() => {
    techRef.current = technologies;
  }, [technologies]);

  function handleUpdate(url: string) {
    if (editingIndex === null) return;
    const updated = techRef.current.map((u, idx) => (idx === editingIndex ? url : u));
    setTechnologies(updated);
    techRef.current = updated;
    setEditingIndex(null);
  }

  async function handleRemove(i: number) {
    const updated = technologies.filter((_, idx) => idx !== i);
    setTechnologies(updated);

    // Auto-save so it's also removed from user side immediately
    setIsSaving(true);
    const result = await saveSetting("technologies-logos", { technologies: updated, bgColor, textColor });
    setIsSaving(false);
    if (result.success) {
      setMessage({ type: "success", text: "Technology removed and saved!" });
    } else {
      setMessage({ type: "error", text: "Removed locally but failed to save to database." });
    }
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);
    const result = await saveSetting("technologies-logos", { technologies, bgColor, textColor });
    setIsSaving(false);
    if (result.success) {
      setMessage({ type: "success", text: "Technologies saved successfully!" });
    } else {
      setMessage({ type: "error", text: result.error || "Failed to save" });
    }
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar showSearch={false} />

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader title="Logo Showcase / Certifications" description="Manage partner, technology, or certification logos displayed on the website." />
      </div>

      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm ${message.type === "success" ? "border border-green-200 bg-green-50 text-green-700" : "border border-red-200 bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}

      {/* Upload Section */}
      <Card className="p-6">
        <h3 className="mb-4 text-sm font-bold text-zinc-800">Upload Logo</h3>
        {editingIndex !== null ? (
          <div className="space-y-3">
            <p className="text-xs font-medium text-amber-700">
              Changing logo {editingIndex + 1} — upload a new image to replace it
            </p>
            <div className="max-w-sm">
              <ImageUploader
                label="Replace Logo"
                value={technologies[editingIndex]}
                onChange={(url) => {
                  if (url) handleUpdate(url);
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => setEditingIndex(null)}
              className="text-xs text-amber-600 hover:text-amber-800"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="max-w-sm">
            <ImageUploader
              label="Logo"
              required
              value={null}
              multiple
              onChange={(url) => {
                if (url) {
                  const updated = [...techRef.current, url];
                  setTechnologies(updated);
                  techRef.current = updated;
                }
              }}
            />
          </div>
        )}
      </Card>

      {/* Section Colors */}
      <Card className="p-6">
        <h3 className="mb-4 text-sm font-bold text-zinc-800">Section Colors</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-600">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-lg border border-zinc-200 p-0.5"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-28 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-600">Text / Heading Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-lg border border-zinc-200 p-0.5"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-28 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-xl p-4" style={{ backgroundColor: bgColor }}>
          <p className="text-center text-sm font-bold" style={{ color: textColor }}>Preview: Trusted & Recognized By</p>
        </div>
      </Card>

      {/* List */}
      <Card noPadding className="overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h3 className="text-lg font-bold text-black">Added Logos ({technologies.length})</h3>
        </div>
        {technologies.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
            <Cpu className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">No logos added yet. Upload one above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 lg:grid-cols-4">
            {technologies.map((url, i) => (
              <div key={i} className="group relative flex items-center justify-center rounded-xl border border-zinc-200 bg-[#1e1e2e] p-5 transition-all hover:shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Tech ${i + 1}`} className="h-12 max-w-full object-contain" />
                <div className="absolute inset-0 flex items-center justify-center gap-1 rounded-xl bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => setEditingIndex(i)}
                    className="flex items-center gap-1 rounded bg-white/20 px-2 py-1 text-xs hover:bg-white/30"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(i)}
                    className="flex items-center gap-1 rounded bg-white/20 px-2 py-1 text-xs hover:bg-white/30"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="sticky bottom-4 z-10 flex items-center justify-end gap-2 rounded-2xl border border-zinc-200 bg-white px-6 py-3 shadow-sm">
        <button
          type="button"
          onClick={() => {
            setTechnologies(initialTechnologies);
            setBgColor(initialBgColor || "#ffffff");
            setTextColor(initialTextColor || "#18181b");
            techRef.current = initialTechnologies;
          }}
          disabled={isSaving}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
