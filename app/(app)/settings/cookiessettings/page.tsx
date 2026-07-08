"use client";

import { useEffect, useState, useTransition } from "react";
import { Cookie, Loader2 } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import {
  getCookieSettings,
  updateCookieSettings,
  type CookieSettings,
} from "@/app/actions/settings";

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({
  id,
  on,
  onToggle,
  disabled,
}: {
  id: string;
  on: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      disabled={disabled}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
        on ? "bg-emerald-500" : "bg-zinc-300"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
          on ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

// ─── Row ─────────────────────────────────────────────────────────────────────

function ToggleRow({
  id,
  label,
  description,
  on,
  onToggle,
  disabled,
}: {
  id: string;
  label: string;
  description?: string;
  on: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <label htmlFor={id} className="block cursor-pointer text-sm font-semibold text-black">
          {label}
        </label>
        {description && (
          <p className="mt-0.5 text-xs text-zinc-500">{description}</p>
        )}
      </div>
      <Toggle id={id} on={on} onToggle={onToggle} disabled={disabled} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CookiesSettingsPage() {
  const [form, setForm] = useState<CookieSettings>({
    bannerEnabled: false,
    agreementRequired: false,
    agreementText: "",
  });
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  // ── Load current settings on mount ──────────────────────────────────────────
  useEffect(() => {
    getCookieSettings().then((res) => {
      if (res.success) {
        setForm(res.data);
      } else {
        setLoadError(res.error);
      }
    });
  }, []);

  // ── Save ────────────────────────────────────────────────────────────────────
  function handleSave() {
    setSaveError(null);
    setSaved(false);
    startTransition(async () => {
      const res = await updateCookieSettings(form);
      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setSaveError(res.error);
      }
    });
  }

  const charCount = (form.agreementText ?? "").length;

  return (
    <Card className="lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <Cookie className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-amber-500 sm:text-2xl">
              Cookies Settings
            </h1>
          </div>
          <p className="mt-2 text-sm text-black">
            Manage cookies consent banner, agreement text, and tracking gating.
          </p>
        </div>

        <Button
          className="shrink-0"
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </span>
          ) : saved ? (
            "Saved ✓"
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

      {/* Load error */}
      {loadError && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {loadError}
        </p>
      )}

      {/* Save error */}
      {saveError && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {saveError}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-6">
        {/* Banner toggle */}
        <ToggleRow
          id="banner-enabled"
          label="Show Cookie Banner"
          description="Display the consent banner to visitors on your public site."
          on={form.bannerEnabled}
          onToggle={() =>
            setForm((prev) => ({ ...prev, bannerEnabled: !prev.bannerEnabled }))
          }
          disabled={isPending}
        />

        {/* Agreement text — only editable when banner is on */}
        <div className={form.bannerEnabled ? "" : "opacity-50 pointer-events-none"}>
          <label
            htmlFor="agreement-text"
            className="mb-2 block text-sm font-semibold text-black"
          >
            Cookie Agreement Text
            {form.bannerEnabled && (
              <span className="ml-1 text-red-500">*</span>
            )}
          </label>
          <div className="relative">
            <textarea
              id="agreement-text"
              rows={5}
              value={form.agreementText ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, agreementText: e.target.value }))
              }
              placeholder="We use cookies to improve your experience. By continuing to browse this site you accept our use of cookies."
              className="w-full resize-none rounded-lg border border-zinc-200 p-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
            />
            <span className="pointer-events-none absolute bottom-3 right-4 text-xs text-zinc-400">
              {charCount}
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            This text appears inside the banner. HTML is supported.
          </p>
        </div>

        {/* Agreement required toggle */}
        <ToggleRow
          id="agreement-required"
          label="Require Explicit Consent"
          description="Block analytics and tracking scripts until the visitor explicitly accepts. If off, scripts load on first visit."
          on={form.agreementRequired}
          onToggle={() =>
            setForm((prev) => ({
              ...prev,
              agreementRequired: !prev.agreementRequired,
            }))
          }
          disabled={isPending}
        />
      </div>

      {/* Usage note */}
      <p className="mt-8 rounded-lg bg-zinc-50 px-4 py-3 text-xs text-zinc-500 leading-relaxed">
        <strong>Note:</strong> Call{" "}
        <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono">
          getPublicCookieConfig()
        </code>{" "}
        from{" "}
        <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono">
          app/actions/settings.ts
        </code>{" "}
        in your public pages to read these settings and conditionally render the
        banner / gate tracking scripts.
      </p>
    </Card>
  );
}
