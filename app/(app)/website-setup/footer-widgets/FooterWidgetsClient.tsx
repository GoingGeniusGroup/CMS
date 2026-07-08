"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ImageUploader } from "@/components/ImageUploader";
import { saveSetting } from "@/app/actions/settings";

type SocialEntry = { platform: string; url: string };

type FooterData = {
  logoUrl?: string;
  aboutDesc?: string;
  playStoreLink?: string;
  appStoreLink?: string;
  copyrightText?: string;
  socials?: SocialEntry[];
  contactAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  paymentLogoUrl?: string;
};

const PLATFORM_OPTIONS = ["Facebook", "Twitter", "GitHub", "WhatsApp", "LinkedIn", "Instagram", "YouTube"];

export function FooterWidgetsClient({ initialData }: { initialData: FooterData }) {
  // Footer Settings
  const [logoUrl, setLogoUrl] = useState<string | null>(initialData.logoUrl ?? null);
  const [aboutDesc, setAboutDesc] = useState(initialData.aboutDesc ?? "");
  const [playStoreLink, setPlayStoreLink] = useState(initialData.playStoreLink ?? "");
  const [appStoreLink, setAppStoreLink] = useState(initialData.appStoreLink ?? "");

  // Footer Button
  const [copyrightText, setCopyrightText] = useState(
    initialData.copyrightText ?? "2025 Going Genius Group of Companies. All Rights Reserved."
  );
  const [socials, setSocials] = useState<SocialEntry[]>(
    initialData.socials ?? [
      { platform: "Facebook", url: "" },
      { platform: "Twitter", url: "" },
      { platform: "LinkedIn", url: "" },
    ]
  );

  // Contact Info
  const [contactAddress, setContactAddress] = useState(initialData.contactAddress ?? "");
  const [contactPhone, setContactPhone] = useState(initialData.contactPhone ?? "");
  const [contactEmail, setContactEmail] = useState(initialData.contactEmail ?? "");

  // Payment Logo
  const [paymentLogoUrl, setPaymentLogoUrl] = useState<string | null>(initialData.paymentLogoUrl ?? null);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function addSocial() {
    setSocials((prev) => [...prev, { platform: "Facebook", url: "" }]);
  }

  function removeSocial(i: number) {
    setSocials((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateSocial(i: number, field: keyof SocialEntry, val: string) {
    setSocials((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [field]: val } : s))
    );
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);

    const data = {
      logoUrl: logoUrl || "",
      aboutDesc: aboutDesc || "",
      playStoreLink: playStoreLink || "",
      appStoreLink: appStoreLink || "",
      copyrightText: copyrightText || "",
      socials: socials,
      contactAddress: contactAddress || "",
      contactPhone: contactPhone || "",
      contactEmail: contactEmail || "",
      paymentLogoUrl: paymentLogoUrl || "",
    };

    const result = await saveSetting("footer-widgets", data);
    setIsSaving(false);

    if (result.success) {
      setMessage({ type: "success", text: "Footer settings saved successfully!" });
    } else {
      setMessage({ type: "error", text: result.error || "Failed to save" });
    }

    setTimeout(() => setMessage(null), 3000);
  }

  function handleCancel() {
    setLogoUrl(initialData.logoUrl ?? null);
    setAboutDesc(initialData.aboutDesc ?? "");
    setPlayStoreLink(initialData.playStoreLink ?? "");
    setAppStoreLink(initialData.appStoreLink ?? "");
    setCopyrightText(initialData.copyrightText ?? "2025 Going Genius Group of Companies. All Rights Reserved.");
    setSocials(initialData.socials ?? [{ platform: "Facebook", url: "" }, { platform: "Twitter", url: "" }, { platform: "LinkedIn", url: "" }]);
    setContactAddress(initialData.contactAddress ?? "");
    setContactPhone(initialData.contactPhone ?? "");
    setContactEmail(initialData.contactEmail ?? "");
    setPaymentLogoUrl(initialData.paymentLogoUrl ?? null);
    setMessage(null);
  }

  const inputCls = "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-indigo-400 focus:bg-white";

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm ${
          message.type === "success"
            ? "border border-green-200 bg-green-50 text-green-700"
            : "border border-red-200 bg-red-50 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      {/* ── Footer Settings ── */}
      <Card>
        <h2 className="text-base font-bold text-zinc-900">Footer Settings</h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Manage all footer content and appearance.
        </p>

        <div className="mt-5 space-y-5">
          <ImageUploader
            label="Footer Logo"
            value={logoUrl}
            onChange={(url) => setLogoUrl(url)}
          />

          <div>
            <p className="mb-1 text-sm font-bold text-zinc-800">About Description</p>
            <textarea
              rows={4}
              value={aboutDesc}
              onChange={(e) => setAboutDesc(e.target.value)}
              placeholder="Write a short company description..."
              className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-600 outline-none placeholder:text-zinc-400 focus:border-indigo-400"
            />
          </div>

          <div>
            <p className="mb-1 text-sm font-bold text-zinc-800">Play Store Link</p>
            <input
              type="url"
              value={playStoreLink}
              onChange={(e) => setPlayStoreLink(e.target.value)}
              placeholder="https://play.google.com/store/apps/..."
              className={inputCls}
            />
          </div>

          <div>
            <p className="mb-1 text-sm font-bold text-zinc-800">App Store Link</p>
            <input
              type="url"
              value={appStoreLink}
              onChange={(e) => setAppStoreLink(e.target.value)}
              placeholder="https://apps.apple.com/app/..."
              className={inputCls}
            />
          </div>
        </div>
      </Card>

      {/* ── Footer Button (Copyright + Socials) ── */}
      <Card>
        <h2 className="text-base font-bold text-zinc-900">Footer Bottom</h2>
        <p className="mt-0.5 text-xs text-zinc-500">Copyright text and social links.</p>

        <div className="mt-5 space-y-5">
          <div>
            <p className="mb-1 text-sm font-bold text-zinc-800">Copyright Text</p>
            <input
              type="text"
              value={copyrightText}
              onChange={(e) => setCopyrightText(e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <p className="mb-3 text-sm font-bold text-zinc-800">Social Links</p>
            <div className="space-y-2.5">
              {socials.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    value={s.platform}
                    onChange={(e) => updateSocial(i, "platform", e.target.value)}
                    className="w-32 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2 text-sm text-zinc-700 outline-none focus:border-indigo-400"
                  >
                    {PLATFORM_OPTIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <input
                    type="url"
                    value={s.url}
                    onChange={(e) => updateSocial(i, "url", e.target.value)}
                    placeholder="https://..."
                    className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:border-indigo-400"
                  />
                  <button
                    type="button"
                    onClick={() => removeSocial(i)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addSocial}
              className="mt-3 w-full rounded-lg border border-indigo-300 bg-indigo-50 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
            >
              <Plus className="mr-1 inline h-4 w-4" />
              Add Social Link
            </button>
          </div>
        </div>
      </Card>

      {/* ── Contact Info Widget ── */}
      <Card>
        <h2 className="text-base font-bold text-zinc-900">Contact Info Widget</h2>
        <p className="mt-0.5 text-xs text-zinc-500">Manage contact information in footer.</p>

        <div className="mt-5 space-y-4">
          <div>
            <p className="mb-1 text-sm font-bold text-zinc-800">Address</p>
            <input
              type="text"
              value={contactAddress}
              onChange={(e) => setContactAddress(e.target.value)}
              placeholder="City, Country"
              className={inputCls}
            />
          </div>
          <div>
            <p className="mb-1 text-sm font-bold text-zinc-800">Phone</p>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+977 9821212121"
              className={inputCls}
            />
          </div>
          <div>
            <p className="mb-1 text-sm font-bold text-zinc-800">Email</p>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="info@company.com"
              className={inputCls}
            />
          </div>
        </div>
      </Card>

      {/* ── Payment Logo Widget ── */}
      <Card>
        <h2 className="text-base font-bold text-zinc-900">Payment Logo Widget</h2>
        <p className="mt-0.5 text-xs text-zinc-500">Upload payment method logos for the footer.</p>

        <div className="mt-5">
          <ImageUploader
            label="Payment Logo"
            value={paymentLogoUrl}
            onChange={(url) => setPaymentLogoUrl(url)}
          />
        </div>
      </Card>

      {/* ── Save / Cancel ── */}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={handleCancel} disabled={isSaving}>
          Cancel
        </Button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
