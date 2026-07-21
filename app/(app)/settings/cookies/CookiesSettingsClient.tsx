"use client";

import { useState } from "react";
import { Cookie, Loader2 } from "lucide-react";
import { Card } from "@/components/Card";
import { saveCookieSettings } from "@/app/actions/cookie-settings";

function Toggle({ on, onToggle, id }: { on: boolean; onToggle: () => void; id: string }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-emerald-500" : "bg-zinc-300"}`}
    >
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${on ? "left-6" : "left-1"}`} />
    </button>
  );
}

type CookieData = {
  cookiesAgreement: boolean;
  showCookiesAgreement: boolean;
  cookiesAgreementText: string;
};

export function CookiesSettingsClient({ initialData }: { initialData: CookieData }) {
  const [cookiesAgreement, setCookiesAgreement] = useState(initialData.cookiesAgreement);
  const [showCookiesAgreement, setShowCookiesAgreement] = useState(initialData.showCookiesAgreement);
  const [cookiesAgreementText, setCookiesAgreementText] = useState(initialData.cookiesAgreementText);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const hasChanges =
    cookiesAgreement !== initialData.cookiesAgreement ||
    showCookiesAgreement !== initialData.showCookiesAgreement ||
    cookiesAgreementText !== initialData.cookiesAgreementText;

  function handleCancel() {
    setCookiesAgreement(initialData.cookiesAgreement);
    setShowCookiesAgreement(initialData.showCookiesAgreement);
    setCookiesAgreementText(initialData.cookiesAgreementText);
    setMessage(null);
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);
    const result = await saveCookieSettings({ cookiesAgreement, showCookiesAgreement, cookiesAgreementText });
    setIsSaving(false);
    if (result.success) {
      setMessage({ type: "success", text: "Cookie settings saved!" });
    } else {
      setMessage({ type: "error", text: result.error || "Failed to save" });
    }
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <>
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-10 mb-6 rounded-lg border border-zinc-200 bg-white px-6 py-4 shadow-sm sm:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <Cookie className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-amber-500 sm:text-2xl">Cookies Settings</h1>
              <p className="text-xs text-zinc-500">Manage cookies agreement and related settings.</p>
            </div>
          </div>
          {hasChanges && (
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
          )}
        </div>
      </div>

      {message && (
        <div className={`mb-6 rounded-lg px-4 py-3 text-sm ${message.type === "success" ? "border border-green-200 bg-green-50 text-green-700" : "border border-red-200 bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}

    <Card className="lg:p-8">
      <div className="mt-6 flex items-center justify-between gap-4">
        <label htmlFor="cookies-agreement" className="cursor-pointer text-sm font-semibold text-black">
          Cookies Agreement
        </label>
        <Toggle id="cookies-agreement" on={cookiesAgreement} onToggle={() => setCookiesAgreement((v) => !v)} />
      </div>

      <div className="mt-6">
        <label htmlFor="cookies-text" className="mb-2 block text-sm font-semibold text-black">
          Cookies Agreement Text
        </label>
        <textarea
          id="cookies-text"
          rows={4}
          value={cookiesAgreementText}
          onChange={(e) => setCookiesAgreementText(e.target.value)}
          placeholder="We use cookies to improve your experience..."
          className="w-full resize-none rounded-lg border border-zinc-200 p-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <label htmlFor="show-cookies-agreement" className="cursor-pointer text-sm font-semibold text-black">
          Show Cookies Agreement?
        </label>
        <Toggle id="show-cookies-agreement" on={showCookiesAgreement} onToggle={() => setShowCookiesAgreement((v) => !v)} />
      </div>
    </Card>
    </>
  );
}
