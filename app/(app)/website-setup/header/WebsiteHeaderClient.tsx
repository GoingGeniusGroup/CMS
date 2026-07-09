"use client";

import { useState } from "react";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { Card } from "@/components/Card";
import { ImageUploader } from "@/components/ImageUploader";
import { saveSetting } from "@/app/actions/settings";

type MenuItem = { label: string; path: string };

type HeaderData = {
  logoUrl?: string;
  stickyHeader?: boolean;
  bannerImageUrl?: string;
  bannerLink?: string;
  helpNumber?: string;
  menuItems?: MenuItem[];
  partners?: string[];
  technologies?: string[];
};

export function WebsiteHeaderClient({ initialData }: { initialData: HeaderData }) {
  const [logoUrl, setLogoUrl] = useState<string | null>(initialData.logoUrl ?? null);
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(initialData.bannerImageUrl ?? null);
  const [stickyHeader, setStickyHeader] = useState(initialData.stickyHeader ?? true);
  const [bannerLink, setBannerLink] = useState(initialData.bannerLink ?? "");
  const [helpNumber, setHelpNumber] = useState(initialData.helpNumber ?? "");
  const [menuItems, setMenuItems] = useState<MenuItem[]>(
    initialData.menuItems ?? [{ label: "Home", path: "/" }]
  );

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Partners & Technologies
  const [partners, setPartners] = useState<string[]>(initialData.partners ?? []);
  const [technologies, setTechnologies] = useState<string[]>(initialData.technologies ?? []);
  const [newPartnerLogo, setNewPartnerLogo] = useState<string | null>(null);
  const [newTechLogo, setNewTechLogo] = useState<string | null>(null);

  const addMenuItem = () =>
    setMenuItems((prev) => [...prev, { label: "", path: "" }]);

  const removeMenuItem = (i: number) =>
    setMenuItems((prev) => prev.filter((_, idx) => idx !== i));

  const updateMenuItem = (i: number, field: keyof MenuItem, val: string) =>
    setMenuItems((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, [field]: val } : item))
    );

  function handleAddPartner() {
    if (!newPartnerLogo) return;
    setPartners((prev) => [...prev, newPartnerLogo]);
    setNewPartnerLogo(null);
  }

  function handleRemovePartner(i: number) {
    setPartners((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleAddTech() {
    if (!newTechLogo) return;
    setTechnologies((prev) => [...prev, newTechLogo]);
    setNewTechLogo(null);
  }

  function handleRemoveTech(i: number) {
    setTechnologies((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);

    const data = {
      logoUrl: logoUrl || "",
      stickyHeader,
      bannerImageUrl: bannerImageUrl || "",
      bannerLink: bannerLink || "",
      helpNumber: helpNumber || "",
      menuItems: menuItems.filter((m) => m.label.trim() || m.path.trim()),
      partners,
      technologies,
    };

    const result = await saveSetting("website-header", data);
    setIsSaving(false);

    if (result.success) {
      setMessage({ type: "success", text: "Header settings saved successfully!" });
    } else {
      setMessage({ type: "error", text: result.error || "Failed to save" });
    }

    setTimeout(() => setMessage(null), 3000);
  }

  function handleCancel() {
    setLogoUrl(initialData.logoUrl ?? null);
    setBannerImageUrl(initialData.bannerImageUrl ?? null);
    setStickyHeader(initialData.stickyHeader ?? true);
    setBannerLink(initialData.bannerLink ?? "");
    setHelpNumber(initialData.helpNumber ?? "");
    setMenuItems(initialData.menuItems ?? [{ label: "Home", path: "/" }]);
    setPartners(initialData.partners ?? []);
    setTechnologies(initialData.technologies ?? []);
    setNewPartnerLogo(null);
    setNewTechLogo(null);
    setMessage(null);
  }

  return (
    <div className="space-y-6">
    <Card className="p-6 sm:p-8">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-zinc-900">Website Header</h1>
        <p className="mt-0.5 text-sm text-zinc-500">
          Manage your website header settings
        </p>
      </div>

      {/* Success/Error message */}
      {message && (
        <div className={`mb-6 rounded-lg px-4 py-3 text-sm ${
          message.type === "success"
            ? "border border-green-200 bg-green-50 text-green-700"
            : "border border-red-200 bg-red-50 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Header Logo */}
        <ImageUploader
          label="Header Logo"
          value={logoUrl}
          onChange={(url) => setLogoUrl(url)}
        />

        {/* Enable Sticky Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-zinc-800">Enable Sticky Header</span>
          <button
            type="button"
            role="switch"
            aria-checked={stickyHeader}
            onClick={() => setStickyHeader((v) => !v)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
              stickyHeader ? "bg-indigo-500" : "bg-zinc-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                stickyHeader ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Topbar Banner Image */}
        <ImageUploader
          label="Topbar Banner Image"
          value={bannerImageUrl}
          onChange={(url) => setBannerImageUrl(url)}
        />

        {/* Topbar Banner Link */}
        <div>
          <label className="mb-2 block text-sm font-bold text-zinc-800">Topbar Banner Link</label>
          <input
            type="text"
            value={bannerLink}
            onChange={(e) => setBannerLink(e.target.value)}
            placeholder="https://example.com"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm text-zinc-700 outline-none focus:border-indigo-400"
          />
        </div>

        {/* Help Link Number */}
        <div>
          <label className="mb-2 block text-sm font-bold text-zinc-800">Help Link Number</label>
          <input
            type="text"
            value={helpNumber}
            onChange={(e) => setHelpNumber(e.target.value)}
            placeholder="9898989898"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm text-zinc-700 outline-none focus:border-indigo-400"
          />
        </div>

        {/* Header Navigation Menu */}
        <div>
          <p className="mb-3 text-sm font-bold text-zinc-800">Header Navigation Menu</p>
          <div className="space-y-3">
            {menuItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item.label}
                  placeholder="Label"
                  onChange={(e) => updateMenuItem(i, "label", e.target.value)}
                  className="flex-1 rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2.5 text-sm font-medium text-zinc-700 placeholder:text-zinc-400 outline-none focus:border-indigo-400"
                />
                <input
                  type="text"
                  value={item.path}
                  placeholder="Link path (e.g. /about)"
                  onChange={(e) => updateMenuItem(i, "path", e.target.value)}
                  className="flex-1 rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2.5 text-sm font-medium text-zinc-700 placeholder:text-zinc-400 outline-none focus:border-indigo-400"
                />
                <button
                  type="button"
                  onClick={() => removeMenuItem(i)}
                  aria-label="Remove menu item"
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addMenuItem}
              className="w-full rounded-lg border border-indigo-300 bg-indigo-50 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
            >
              <Plus className="mr-1 inline h-4 w-4" />
              Add Menu Link
            </button>
          </div>
        </div>

        {/* Cancel / Save */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
          >
            Cancel
          </button>
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
    </Card>

    {/* ─── Our Partners Section ─── */}
    <Card className="p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-zinc-900">Our Partners</h2>
        <p className="mt-0.5 text-sm text-zinc-500">Add partner company logos to display on the website.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Upload */}
        <div>
          <ImageUploader
            label="Upload Partner Logo"
            required
            value={newPartnerLogo}
            onChange={(url) => setNewPartnerLogo(url)}
          />
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setNewPartnerLogo(null)}
              className="rounded-lg border border-zinc-300 bg-white px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddPartner}
              disabled={!newPartnerLogo}
              className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
            >
              Add Partner
            </button>
          </div>
        </div>

        {/* List */}
        <div>
          <p className="mb-3 text-sm font-bold text-zinc-800">Added Partners</p>
          {partners.length === 0 ? (
            <p className="text-sm text-zinc-400">No partners added yet.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {partners.map((url, i) => (
                <div key={i} className="group relative rounded-lg border border-zinc-200 bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Partner ${i + 1}`} className="h-10 w-full object-contain" />
                  <button
                    type="button"
                    onClick={() => handleRemovePartner(i)}
                    className="absolute -right-2 -top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white group-hover:flex"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>

    {/* ─── Technologies Used Section ─── */}
    <Card className="p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-zinc-900">Technologies Used</h2>
        <p className="mt-0.5 text-sm text-zinc-500">Add technology logos to showcase on the website.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Upload */}
        <div>
          <ImageUploader
            label="Upload Technology Logo"
            required
            value={newTechLogo}
            onChange={(url) => setNewTechLogo(url)}
          />
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setNewTechLogo(null)}
              className="rounded-lg border border-zinc-300 bg-white px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddTech}
              disabled={!newTechLogo}
              className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
            >
              Add Technology
            </button>
          </div>
        </div>

        {/* List */}
        <div>
          <p className="mb-3 text-sm font-bold text-zinc-800">Added Technologies</p>
          {technologies.length === 0 ? (
            <p className="text-sm text-zinc-400">No technologies added yet.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {technologies.map((url, i) => (
                <div key={i} className="group relative rounded-lg border border-zinc-200 bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Tech ${i + 1}`} className="h-10 w-full object-contain" />
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(i)}
                    className="absolute -right-2 -top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white group-hover:flex"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
    </div>
  );
}
