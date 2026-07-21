"use client";

import { useState } from "react";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { Card } from "@/components/Card";
import { ImageUploader } from "@/components/ImageUploader";
import { saveWebsiteHeader, type WebsiteHeaderData, type MenuItem } from "@/app/actions/website-header";

export function WebsiteHeaderClient({ initialData }: { initialData: WebsiteHeaderData }) {
  const [stickyHeader, setStickyHeader] = useState(initialData.stickyHeader);
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(initialData.bannerImageUrl || null);
  const [bannerLink, setBannerLink] = useState(initialData.bannerLink);
  const [helpNumber, setHelpNumber] = useState(initialData.helpNumber);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(
    initialData.menuItems.length > 0 ? initialData.menuItems : [{ label: "Home", path: "/home" }]
  );

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const addMenuItem = () => setMenuItems((prev) => [...prev, { label: "", path: "" }]);
  const removeMenuItem = (i: number) => setMenuItems((prev) => prev.filter((_, idx) => idx !== i));
  const updateMenuItem = (i: number, field: "label" | "path", val: string) =>
    setMenuItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)));

  const addSubItem = (i: number) =>
    setMenuItems((prev) =>
      prev.map((item, idx) =>
        idx === i
          ? { ...item, children: [...(item.children ?? []), { label: "", path: "" }] }
          : item
      )
    );
  const removeSubItem = (i: number, j: number) =>
    setMenuItems((prev) =>
      prev.map((item, idx) =>
        idx === i
          ? { ...item, children: (item.children ?? []).filter((_, k) => k !== j) }
          : item
      )
    );
  const updateSubItem = (i: number, j: number, field: "label" | "path", val: string) =>
    setMenuItems((prev) =>
      prev.map((item, idx) =>
        idx === i
          ? {
              ...item,
              children: (item.children ?? []).map((c, k) =>
                k === j ? { ...c, [field]: val } : c
              ),
            }
          : item
      )
    );

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);

    const result = await saveWebsiteHeader({
      stickyHeader,
      bannerImageUrl: bannerImageUrl || "",
      bannerLink,
      helpNumber,
      menuItems: menuItems
        .filter((m) => m.label.trim() || m.path.trim())
        .map((m) => {
          const children = (m.children ?? []).filter(
            (c) => c.label.trim() || c.path.trim()
          );
          return children.length > 0
            ? { label: m.label, path: m.path, children }
            : { label: m.label, path: m.path };
        }),
    });

    setIsSaving(false);
    setMessage(result.success
      ? { type: "success", text: "Header settings saved!" }
      : { type: "error", text: result.error || "Failed to save" }
    );
    setTimeout(() => setMessage(null), 3000);
  }

  function handleCancel() {
    setStickyHeader(initialData.stickyHeader);
    setBannerImageUrl(initialData.bannerImageUrl || null);
    setBannerLink(initialData.bannerLink);
    setHelpNumber(initialData.helpNumber);
    setMenuItems(initialData.menuItems.length > 0 ? initialData.menuItems : [{ label: "Home", path: "/home" }]);
    setMessage(null);
  }

  return (
    <div className="flex flex-col">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-10 -mx-6 -mt-5 mb-6 border-b border-zinc-200 bg-white px-6 py-4 sm:-mx-8 sm:-mt-6 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Website Header</h1>
            <p className="mt-0.5 text-sm text-zinc-500">
              Manage sticky navbar, top banner ad, and navigation menu.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={handleCancel} disabled={isSaving}
              className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className={`mb-6 rounded-lg px-4 py-3 text-sm ${
          message.type === "success"
            ? "border border-green-200 bg-green-50 text-green-700"
            : "border border-red-200 bg-red-50 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      <Card className="p-6 sm:p-8">
        <div className="space-y-6">
          {/* Sticky Header Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-zinc-800">Enable Sticky Header</p>
              <p className="text-xs text-zinc-400">Keeps the navbar fixed at the top while scrolling.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={stickyHeader}
              onClick={() => setStickyHeader((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                stickyHeader ? "bg-indigo-500" : "bg-zinc-300"
              }`}
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                stickyHeader ? "translate-x-5" : "translate-x-0.5"
              }`} />
            </button>
          </div>

          {/* Topbar Banner Ad */}
          <div className="rounded-xl border border-zinc-200 p-4 space-y-4">
            <div>
              <p className="text-sm font-bold text-zinc-800">Topbar Banner Ad</p>
              <p className="text-xs text-zinc-400">Appears above the navbar. Users can close it.</p>
            </div>
            <ImageUploader label="Banner Image" value={bannerImageUrl} onChange={(url) => setBannerImageUrl(url)} />
            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-800">Banner Link (URL)</label>
              <input
                type="text"
                value={bannerLink}
                onChange={(e) => setBannerLink(e.target.value)}
                placeholder="https://example.com/promo"
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm text-zinc-700 outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          {/* Help Number */}
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

          {/* Navigation Menu */}
          <div>
            <p className="mb-1 text-sm font-bold text-zinc-800">Navigation Menu</p>
            <p className="mb-3 text-xs text-zinc-400">
              Add sub-links to a menu item to turn it into a dropdown. Group similar
              pages under one menu to keep the navbar clean.
            </p>
            <div className="space-y-3">
              {menuItems.map((item, i) => (
                <div key={i} className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={item.label}
                      placeholder="Label"
                      onChange={(e) => updateMenuItem(i, "label", e.target.value)}
                      className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 placeholder:text-zinc-400 outline-none focus:border-indigo-400"
                    />
                    <input
                      type="text"
                      value={item.path}
                      placeholder="/path"
                      onChange={(e) => updateMenuItem(i, "path", e.target.value)}
                      className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 placeholder:text-zinc-400 outline-none focus:border-indigo-400"
                    />
                    <button type="button" onClick={() => removeMenuItem(i)} className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Sub-links (dropdown children) */}
                  {(item.children?.length ?? 0) > 0 && (
                    <div className="mt-3 space-y-2 border-l-2 border-zinc-200 pl-3">
                      {item.children!.map((sub, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <span className="text-xs text-zinc-400">↳</span>
                          <input
                            type="text"
                            value={sub.label}
                            placeholder="Sub-label"
                            onChange={(e) => updateSubItem(i, j, "label", e.target.value)}
                            className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 placeholder:text-zinc-400 outline-none focus:border-indigo-400"
                          />
                          <input
                            type="text"
                            value={sub.path}
                            placeholder="/path"
                            onChange={(e) => updateSubItem(i, j, "path", e.target.value)}
                            className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 placeholder:text-zinc-400 outline-none focus:border-indigo-400"
                          />
                          <button type="button" onClick={() => removeSubItem(i, j)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => addSubItem(i)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add sub-link (dropdown)
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addMenuItem}
                className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                <Plus className="mr-1 inline h-4 w-4" /> Add Menu Link
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
