"use client";

import { useRef, useState } from "react";
import { Trash2, Upload, Plus } from "lucide-react";
import { Card } from "@/components/Card";

type MenuItem = { label: string; path: string };

export default function WebsiteHeaderPage() {
  const [logo, setLogo] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [stickyHeader, setStickyHeader] = useState(true);
  const [bannerLink, setBannerLink] = useState("https://www.figma.com/design");
  const [helpNumber, setHelpNumber] = useState("9898989898");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { label: "Home", path: "/" },
  ]);

  const logoRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogo(URL.createObjectURL(file));
  };

  const handleBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setBannerImage(URL.createObjectURL(file));
  };

  const addMenuItem = () =>
    setMenuItems((prev) => [...prev, { label: "", path: "" }]);

  const removeMenuItem = (i: number) =>
    setMenuItems((prev) => prev.filter((_, idx) => idx !== i));

  const updateMenuItem = (i: number, field: keyof MenuItem, val: string) =>
    setMenuItems((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, [field]: val } : item))
    );

  return (
    <Card className="p-6 sm:p-8">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-zinc-900">Website Header</h1>
        <p className="mt-0.5 text-sm text-zinc-500">
          Manage your website header settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Header Logo */}
        <div>
          <p className="mb-2 text-sm font-bold text-zinc-800">Header Logo</p>
          <div className="relative w-full rounded-lg border border-zinc-200 bg-white p-4 sm:w-96">
            {logo && (
              <button
                type="button"
                onClick={() => setLogo(null)}
                className="absolute right-3 top-3 text-red-500 hover:text-red-600"
                aria-label="Remove logo"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            <div className="flex flex-col items-center gap-3">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt="Logo" className="h-20 w-auto object-contain" />
              ) : (
                <div className="h-16 w-16 rounded bg-zinc-100" />
              )}
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
              <button
                type="button"
                onClick={() => logoRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-200"
              >
                <Upload className="h-4 w-4" />
                Change Logo
              </button>
              <p className="text-xs text-zinc-400">PNG, JPG, WebP (Max 2MB)</p>
            </div>
          </div>
        </div>

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
        <div>
          <p className="mb-2 text-sm font-bold text-zinc-800">Topbar Banner Image</p>
          <div className="relative w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 sm:w-96">
            {bannerImage && (
              <button
                type="button"
                onClick={() => setBannerImage(null)}
                aria-label="Remove banner"
                className="absolute right-3 top-3 z-10 rounded bg-white/80 p-1 text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <div className="relative">
              {bannerImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={bannerImage} alt="Banner" className="h-36 w-full object-cover" />
              ) : (
                <div className="h-36 w-full bg-zinc-100" />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/20">
                <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={handleBanner} />
                <button
                  type="button"
                  onClick={() => bannerRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-md bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-white"
                >
                  <Upload className="h-4 w-4" />
                  Change Image
                </button>
                <p className="text-xs text-white drop-shadow">PNG, JPG, WebP (Max 2MB)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Topbar Banner Link */}
        <div>
          <label className="mb-2 block text-sm font-bold text-zinc-800">Topbar Banner Link</label>
          <input
            type="text"
            value={bannerLink}
            onChange={(e) => setBannerLink(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm text-zinc-500 outline-none focus:border-indigo-400"
          />
        </div>

        {/* Help Link Number */}
        <div>
          <label className="mb-2 block text-sm font-bold text-zinc-800">Help Link Number</label>
          <input
            type="text"
            value={helpNumber}
            onChange={(e) => setHelpNumber(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm text-zinc-500 outline-none focus:border-indigo-400"
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
                  className="flex-1 rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2.5 text-sm font-bold text-zinc-600 placeholder:font-bold placeholder:text-zinc-500 outline-none focus:border-indigo-400"
                />
                <input
                  type="text"
                  value={item.path}
                  placeholder="Link"
                  onChange={(e) => updateMenuItem(i, "path", e.target.value)}
                  className="flex-1 rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2.5 text-sm font-bold text-zinc-600 placeholder:font-bold placeholder:text-zinc-500 outline-none focus:border-indigo-400"
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

        {/* Cancel / Update */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
          >
            Update
          </button>
        </div>
      </div>
    </Card>
  );
}
