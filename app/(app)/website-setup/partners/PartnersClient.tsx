"use client";

import { useState } from "react";
import { Handshake, Trash2, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/Card";
import { ImageUploader } from "@/components/ImageUploader";
import { saveSetting } from "@/app/actions/settings";

export function PartnersClient({ initialPartners }: { initialPartners: string[] }) {
  const [partners, setPartners] = useState<string[]>(initialPartners);
  const [newLogo, setNewLogo] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleAdd() {
    if (!newLogo) return;
    setPartners((prev) => [...prev, newLogo]);
    setNewLogo(null);
  }

  function handleRemove(i: number) {
    setPartners((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);
    // We save to the same website-header key, merging with existing data
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
        <div className="max-w-sm">
          <ImageUploader label="Partner Logo" required value={newLogo} onChange={(url) => setNewLogo(url)} />
        </div>
        <div className="mt-4 flex gap-3">
          <button type="button" onClick={() => setNewLogo(null)} className="rounded-lg border border-zinc-300 bg-white px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            Cancel
          </button>
          <button type="button" onClick={handleAdd} disabled={!newLogo} className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
            Add Partner
          </button>
        </div>
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
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="absolute right-2 top-2 hidden h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition-all group-hover:flex hover:bg-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
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
