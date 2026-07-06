"use client";

import { useRef, useState } from "react";
import { Upload, Plus } from "lucide-react";
import { FaFacebook, FaGithub, FaTwitter, FaWhatsapp, FaLinkedin } from "react-icons/fa";

type SocialLink = { icon: React.ReactNode; placeholder: string; value: string };

const defaultSocials: SocialLink[] = [
  { icon: <FaFacebook className="h-5 w-5" />, placeholder: "link here", value: "" },
  { icon: <FaGithub className="h-5 w-5" />, placeholder: "link here", value: "" },
  { icon: <FaTwitter className="h-5 w-5" />, placeholder: "link here", value: "" },
  { icon: <FaWhatsapp className="h-5 w-5" />, placeholder: "link here", value: "" },
  { icon: <FaLinkedin className="h-5 w-5" />, placeholder: "link here", value: "" },
];

export default function FooterWidgetsPage() {
  // Footer Settings state
  const [logo, setLogo] = useState<string | null>(null);
  const [aboutDesc, setAboutDesc] = useState("");
  const [playStoreLink, setPlayStoreLink] = useState("");
  const [appStoreLink, setAppStoreLink] = useState("");
  const logoRef = useRef<HTMLInputElement>(null);

  // Footer Button state
  const [copyrightText, setCopyrightText] = useState(
    "2025 Going Genius Group of Companies. All Rights Reserved."
  );
  const [socials, setSocials] = useState<SocialLink[]>(defaultSocials);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogo(URL.createObjectURL(file));
  };

  const updateSocial = (i: number, value: string) =>
    setSocials((prev) => prev.map((s, idx) => (idx === i ? { ...s, value } : s)));

  const addSocialLink = () =>
    setSocials((prev) => [
      ...prev,
      { icon: <FaFacebook className="h-5 w-5" />, placeholder: "link here", value: "" },
    ]);

  return (
    <div className="space-y-6">
      {/* ── Footer Settings card ── */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-zinc-900">Footer Settings</h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Manage all footer content and appearance that appears on the website.
        </p>

        <div className="mt-5 space-y-5">
          {/* Footer Logo */}
          <div>
            <p className="mb-1 text-sm font-bold text-zinc-800">Footer Logo</p>
            <p className="mb-2 text-xs text-zinc-400">Upload your company logo to display in the footer.</p>
            <div
              onClick={() => logoRef.current?.click()}
              className="relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-[repeating-linear-gradient(45deg,#f3f3f3,#f3f3f3_6px,#e8e8e8_6px,#e8e8e8_12px)] py-8 sm:w-96"
            >
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt="Footer logo" className="max-h-20 object-contain" />
              ) : null}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); logoRef.current?.click(); }}
                className="absolute right-3 top-3 rounded bg-white/80 p-1.5 text-zinc-600 hover:bg-white"
                aria-label="Upload logo"
              >
                <Upload className="h-4 w-4" />
              </button>
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            </div>
          </div>

          {/* About Description */}
          <div>
            <p className="mb-1 text-sm font-bold text-zinc-800">About Description</p>
            <p className="mb-2 text-xs text-zinc-400">Write a short description about the company.</p>
            {/* Toolbar row */}
            <div className="flex items-center gap-1.5 rounded-t-lg border border-b-0 border-zinc-200 bg-zinc-50 px-2 py-1.5">
            {["B", "I", "U", "A·", "≡", "≡·", "≡··", "⊞", "<>"].map((t, i) => (
                <button
                  key={i}
                  type="button"
                  className="rounded px-1.5 py-0.5 text-xs font-medium text-zinc-500 hover:bg-zinc-200"
                >
                  {t}
                </button>
              ))}
            </div>
            <textarea
              rows={4}
              value={aboutDesc}
              onChange={(e) => setAboutDesc(e.target.value)}
              placeholder="About Description"
              className="w-full resize-none rounded-b-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-600 outline-none placeholder:text-zinc-400 focus:border-indigo-400"
            />
          </div>

          {/* Play Store Link */}
          <div>
            <p className="mb-1 text-sm font-bold text-zinc-800">Play Store Link</p>
            <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2.5">
              <span className="text-zinc-400">▶</span>
              <input
                type="text"
                value={playStoreLink}
                onChange={(e) => setPlayStoreLink(e.target.value)}
                placeholder="Link"
                className="flex-1 bg-transparent text-sm text-zinc-600 outline-none placeholder:text-zinc-400"
              />
            </div>
          </div>

          {/* App Store Link */}
          <div>
            <p className="mb-1 text-sm font-bold text-zinc-800">App Store Link</p>
            <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2.5">
              <span className="text-zinc-400">▶</span>
              <input
                type="text"
                value={appStoreLink}
                onChange={(e) => setAppStoreLink(e.target.value)}
                placeholder="Link"
                className="flex-1 bg-transparent text-sm text-zinc-600 outline-none placeholder:text-zinc-400"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-zinc-300 bg-white px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600"
          >
            Update
          </button>
        </div>
      </div>

      {/* ── Footer Button card ── */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-zinc-900">Footer Button</h2>

        <div className="mt-4 rounded-xl border border-zinc-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-zinc-800">Footer Button</p>
          <p className="text-xs text-zinc-400">Manage footer button section.</p>

          <div className="mt-4 space-y-5">
            {/* Copyright Text */}
            <div>
              <p className="mb-1 text-sm font-bold text-zinc-800">Copyright Text</p>
              <input
                type="text"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-500 outline-none focus:border-indigo-400"
              />
            </div>

            {/* Social Links */}
            <div>
              <p className="mb-3 text-sm font-bold text-zinc-800">Social Links</p>
              <div className="space-y-2.5">
                {socials.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-zinc-500">{s.icon}</span>
                    <input
                      type="text"
                      value={s.value}
                      onChange={(e) => updateSocial(i, e.target.value)}
                      placeholder={s.placeholder}
                      className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-500 outline-none placeholder:text-zinc-400 focus:border-indigo-400"
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addSocialLink}
                className="mt-3 w-full rounded-lg border border-indigo-300 bg-indigo-50 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
              >
                <Plus className="mr-1 inline h-4 w-4" />
                Add Social Link
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-zinc-300 bg-white px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
