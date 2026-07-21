"use client";

import { useState, useRef, useEffect } from "react";
import { Handshake, Trash2, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/Card";
import { ImageUploader } from "@/components/ImageUploader";
import { saveSetting } from "@/app/actions/settings";

export function PartnersClient({ initialPartners }: { initialPartners: string[] }) {
  const [partners, setPartners] = useState<string[]>(initialPartners);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const partnersRef = useRef(partners);
  useEffect(() => {
    partnersRef.current = partners;
  }, [partners]);

  function handleUpdate(url: string) {
    if (editingIndex === null) return;
    const updated = partnersRef.current.map((u, idx) => (idx === editingIndex ? url : u));
    setPartners(updated);
    partnersRef.current = updated;
    setEditingIndex(null);
  }

  function handleRemove(i: number) {
    const updated = partnersRef.current.filter((_, idx) => idx !== i);
    setPartners(updated);
    partnersRef.current = updated;
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);
    const result = await saveSetting("partners-logos", { partners });
    setIsSaving(false);
    if (result.success) {
      setMessage({ type: "success", text: "Partners saved successfully!" });
    } else {
      setMessage({ type: "error", text: result.error || "Failed to save" });
    }
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar showSearch={false} />

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader title="Our Partners" description="Manage partner company logos displayed on the website." />
      </div>

      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm ${message.type === "success" ? "border border-green-200 bg-green-50 text-green-700" : "border border-red-200 bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}

      {/* Upload Section */}
      <Card className="p-6">
        <h3 className="mb-4 text-sm font-bold text-zinc-800">Upload Partner Logo</h3>
        {editingIndex !== null ? (
          <div className="space-y-3">
            <p className="text-xs font-medium text-amber-700">
              Changing logo {editingIndex + 1} — upload a new image to replace it
            </p>
            <div className="max-w-sm">
              <ImageUploader
                label="Replace Logo"
                value={partners[editingIndex]}
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
              label="Partner Logo"
              required
              value={null}
              multiple
              onChange={(url) => {
                if (url) {
                  const updated = [...partnersRef.current, url];
                  setPartners(updated);
                  partnersRef.current = updated;
                }
              }}
            />
          </div>
        )}
      </Card>

      {/* List */}
      <Card noPadding className="overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h3 className="text-lg font-bold text-black">Added Partners ({partners.length})</h3>
        </div>
        {partners.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
            <Handshake className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">No partners added yet. Upload a logo above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 lg:grid-cols-4">
            {partners.map((url, i) => (
              <div key={i} className="group relative flex items-center justify-center rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Partner ${i + 1}`} className="h-12 max-w-full object-contain" />
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

      {/* Save */}
      <div className="flex justify-end">
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
  );
}
