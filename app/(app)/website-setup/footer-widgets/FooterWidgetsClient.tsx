"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/Card";
import { ImageUploader } from "@/components/ImageUploader";
import { saveFooterSettings, type FooterSettingData, type SocialEntry, type LinkColumn } from "@/app/actions/footer-settings";

const PLATFORM_OPTIONS = ["Facebook", "Twitter", "GitHub", "WhatsApp", "LinkedIn", "Instagram", "YouTube"];

export function FooterWidgetsClient({ initialData }: { initialData: FooterSettingData }) {
  const [footerLogoUrl, setFooterLogoUrl] = useState<string | null>(initialData.footerLogoUrl || null);
  const [brandText, setBrandText] = useState(initialData.brandText);
  const [aboutDesc, setAboutDesc] = useState(initialData.aboutDesc);
  const [copyrightText, setCopyrightText] = useState(initialData.copyrightText);
  const [playStoreLink, setPlayStoreLink] = useState(initialData.playStoreLink);
  const [appStoreLink, setAppStoreLink] = useState(initialData.appStoreLink);
  const [paymentLogoUrl, setPaymentLogoUrl] = useState<string | null>(initialData.paymentLogoUrl || null);
  const [socials, setSocials] = useState<SocialEntry[]>(initialData.socials);
  const [linkColumns, setLinkColumns] = useState<LinkColumn[]>(initialData.linkColumns);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Social helpers
  function addSocial() { setSocials((prev) => [...prev, { platform: "Facebook", url: "" }]); }
  function removeSocial(i: number) { setSocials((prev) => prev.filter((_, idx) => idx !== i)); }
  function updateSocial(i: number, field: keyof SocialEntry, val: string) {
    setSocials((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));
  }

  // Link column helpers
  function addColumn() { setLinkColumns((prev) => [...prev, { title: "", links: [{ label: "", href: "" }] }]); }
  function removeColumn(i: number) { setLinkColumns((prev) => prev.filter((_, idx) => idx !== i)); }
  function updateColumnTitle(i: number, val: string) {
    setLinkColumns((prev) => prev.map((c, idx) => (idx === i ? { ...c, title: val } : c)));
  }
  function addLinkToColumn(colIdx: number) {
    setLinkColumns((prev) => prev.map((c, idx) => (idx === colIdx ? { ...c, links: [...c.links, { label: "", href: "" }] } : c)));
  }
  function removeLinkFromColumn(colIdx: number, linkIdx: number) {
    setLinkColumns((prev) => prev.map((c, idx) => (idx === colIdx ? { ...c, links: c.links.filter((_, li) => li !== linkIdx) } : c)));
  }
  function updateLink(colIdx: number, linkIdx: number, field: "label" | "href", val: string) {
    setLinkColumns((prev) => prev.map((c, idx) => (idx === colIdx ? { ...c, links: c.links.map((l, li) => (li === linkIdx ? { ...l, [field]: val } : l)) } : c)));
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);
    const result = await saveFooterSettings({
      footerLogoUrl: footerLogoUrl || "",
      brandText,
      aboutDesc, copyrightText, playStoreLink, appStoreLink,
      paymentLogoUrl: paymentLogoUrl || "",
      socials, linkColumns,
    });
    setIsSaving(false);
    setMessage(result.success ? { type: "success", text: "Footer settings saved!" } : { type: "error", text: result.error || "Failed to save" });
    setTimeout(() => setMessage(null), 3000);
  }

  const inputCls = "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-indigo-400 focus:bg-white";

  return (
    <div className="space-y-6">
      {/* ── Header with Save button ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Footer Widgets</h1>
          <p className="text-sm text-zinc-500">Manage all footer content and appearance.</p>
        </div>
        <button type="button" onClick={handleSave} disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm ${message.type === "success" ? "border border-green-200 bg-green-50 text-green-700" : "border border-red-200 bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}

      {/* ── Footer Logo + Brand + About ── */}
      <Card>
        <h2 className="text-base font-bold text-zinc-900">Footer Branding</h2>
        <p className="mt-0.5 text-xs text-zinc-500">Logo, brand text and description shown in the footer.</p>
        <div className="mt-4 space-y-5">
          <ImageUploader label="Footer Logo" value={footerLogoUrl} onChange={(url) => setFooterLogoUrl(url)} />
          <div>
            <p className="mb-1 text-sm font-bold text-zinc-800">Brand Text</p>
            <input type="text" value={brandText} onChange={(e) => setBrandText(e.target.value)} placeholder="e.g. Going Genius Group of Companies" className={inputCls} />
            <p className="mt-1 text-xs text-zinc-400">The company name/tagline shown next to the footer logo.</p>
          </div>
          <div>
            <p className="mb-1 text-sm font-bold text-zinc-800">About Description</p>
            <textarea rows={3} value={aboutDesc} onChange={(e) => setAboutDesc(e.target.value)} placeholder="Company description..." className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-600 outline-none placeholder:text-zinc-400 focus:border-indigo-400" />
          </div>
        </div>
      </Card>

      {/* ── Link Columns ── */}
      <Card>
        <h2 className="text-base font-bold text-zinc-900">Footer Link Columns</h2>
        <p className="mt-0.5 text-xs text-zinc-500">Manage the link columns displayed in the footer.</p>

        <div className="mt-4 space-y-5">
          {linkColumns.map((col, colIdx) => (
            <div key={colIdx} className="rounded-xl border border-zinc-200 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <input type="text" value={col.title} onChange={(e) => updateColumnTitle(colIdx, e.target.value)} placeholder="Column title" className="flex-1 rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 outline-none focus:border-indigo-400" />
                <button type="button" onClick={() => removeColumn(colIdx)} className="text-red-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {col.links.map((link, linkIdx) => (
                <div key={linkIdx} className="flex items-center gap-2 pl-4">
                  <input type="text" value={link.label} onChange={(e) => updateLink(colIdx, linkIdx, "label", e.target.value)} placeholder="Label" className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 outline-none focus:border-indigo-400" />
                  <input type="text" value={link.href} onChange={(e) => updateLink(colIdx, linkIdx, "href", e.target.value)} placeholder="/path or URL" className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 outline-none focus:border-indigo-400" />
                  <button type="button" onClick={() => removeLinkFromColumn(colIdx, linkIdx)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addLinkToColumn(colIdx)} className="ml-4 text-xs font-medium text-zinc-500 hover:text-zinc-700">
                + Add link
              </button>
            </div>
          ))}
          <button type="button" onClick={addColumn} className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">
            <Plus className="mr-1 inline h-4 w-4" /> Add Column
          </button>
        </div>
      </Card>

      {/* ── Copyright + Socials ── */}
      <Card>
        <h2 className="text-base font-bold text-zinc-900">Footer Bottom</h2>
        <p className="mt-0.5 text-xs text-zinc-500">Copyright text and social links.</p>
        <div className="mt-4 space-y-4">
          <div>
            <p className="mb-1 text-sm font-bold text-zinc-800">Copyright Text</p>
            <input type="text" value={copyrightText} onChange={(e) => setCopyrightText(e.target.value)} className={inputCls} />
          </div>
          <div>
            <p className="mb-2 text-sm font-bold text-zinc-800">Social Links</p>
            <div className="space-y-2">
              {socials.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select value={s.platform} onChange={(e) => updateSocial(i, "platform", e.target.value)} className="w-32 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2 text-sm text-zinc-700 outline-none">
                    {PLATFORM_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <input type="url" value={s.url} onChange={(e) => updateSocial(i, "url", e.target.value)} placeholder="https://..." className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 outline-none placeholder:text-zinc-400" />
                  <button type="button" onClick={() => removeSocial(i)} className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addSocial} className="mt-3 w-full rounded-lg border border-zinc-300 bg-white py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">
              <Plus className="mr-1 inline h-4 w-4" /> Add Social Link
            </button>
          </div>
        </div>
      </Card>

      {/* ── App Store Links ── */}
      <Card>
        <h2 className="text-base font-bold text-zinc-900">App Links</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-bold text-zinc-800">Play Store Link</p>
            <input type="url" value={playStoreLink} onChange={(e) => setPlayStoreLink(e.target.value)} placeholder="https://play.google.com/..." className={inputCls} />
          </div>
          <div>
            <p className="mb-1 text-sm font-bold text-zinc-800">App Store Link</p>
            <input type="url" value={appStoreLink} onChange={(e) => setAppStoreLink(e.target.value)} placeholder="https://apps.apple.com/..." className={inputCls} />
          </div>
        </div>
      </Card>

      {/* ── Payment Logo ── */}
      <Card>
        <h2 className="text-base font-bold text-zinc-900">Payment Logo</h2>
        <div className="mt-4">
          <ImageUploader label="Payment Methods Logo" value={paymentLogoUrl} onChange={(url) => setPaymentLogoUrl(url)} />
        </div>
      </Card>

    </div>
  );
}
