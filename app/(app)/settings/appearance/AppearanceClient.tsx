"use client";

import { useState, useTransition } from "react";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { saveAppearanceSettings, type AppearanceData } from "@/app/actions/appearance";

const TIMEZONES = [
  "(GMT-12:00) International Date Line West",
  "(GMT-11:00) Midway Island, Samoa",
  "(GMT-10:00) Hawaii",
  "(GMT-09:00) Alaska",
  "(GMT-08:00) Pacific Time (US & Canada)",
  "(GMT-07:00) Mountain Time (US & Canada)",
  "(GMT-06:00) Central Time (US & Canada)",
  "(GMT-05:00) Eastern Time (US & Canada)",
  "(GMT-04:00) Atlantic Time (Canada)",
  "(GMT-03:00) Buenos Aires, Georgetown",
  "(GMT-02:00) Mid-Atlantic",
  "(GMT-01:00) Azores",
  "(GMT+00:00) UTC",
  "(GMT+01:00) London, Dublin",
  "(GMT+02:00) Berlin, Paris, Rome",
  "(GMT+03:00) Moscow, Kuwait",
  "(GMT+04:00) Abu Dhabi, Dubai",
  "(GMT+05:00) Karachi, Islamabad",
  "(GMT+05:30) Mumbai, New Delhi",
  "(GMT+05:45) Asia/Kathmandu",
  "(GMT+06:00) Dhaka, Almaty",
  "(GMT+06:45) Asia/Kathmandu",
  "(GMT+07:00) Bangkok, Jakarta",
  "(GMT+08:00) Beijing, Singapore",
  "(GMT+09:00) Tokyo, Seoul",
  "(GMT+10:00) Sydney, Melbourne",
  "(GMT+11:00) Solomon Islands",
  "(GMT+12:00) Auckland, Fiji",
];

function ColorField({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-zinc-900">{label}</label>
      <div className="flex items-center gap-3">
        <label className={disabled ? "cursor-default" : "cursor-pointer"}>
          <span
            className="block h-12 w-12 shrink-0 rounded-lg border border-zinc-200 shadow-sm"
            style={{ backgroundColor: value }}
          />
          {!disabled && (
            <input
              type="color"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              className="sr-only"
            />
          )}
        </label>
        <input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          maxLength={7}
          className={`h-12 flex-1 rounded-lg border border-zinc-200 px-4 text-sm text-zinc-800 outline-none focus:ring-2 focus:ring-indigo-200 ${
            disabled ? "bg-zinc-50 text-zinc-500" : ""
          }`}
        />
      </div>
    </div>
  );
}

export default function AppearanceClient({
  initialData,
  baseColor,
}: {
  initialData: AppearanceData;
  baseColor: string;
}) {
  const [hoverColor, setHoverColor] = useState(initialData.hoverColor);
  const [hoverEnabled, setHoverEnabled] = useState(initialData.hoverEnabled);
  const [timezone, setTimezone] = useState(initialData.timezone);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  // Baseline of the last-saved values, advanced after every successful save so
  // re-entering a previously-saved value is still detected as a change.
  const [baseline, setBaseline] = useState({
    hoverColor: initialData.hoverColor,
    hoverEnabled: initialData.hoverEnabled,
    timezone: initialData.timezone,
  });

  const hasChanges =
    hoverColor !== baseline.hoverColor ||
    hoverEnabled !== baseline.hoverEnabled ||
    timezone !== baseline.timezone;

  function handleCancel() {
    setHoverColor(baseline.hoverColor);
    setHoverEnabled(baseline.hoverEnabled);
    setTimezone(baseline.timezone);
    setMessage(null);
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveAppearanceSettings({ hoverColor, hoverEnabled, timezone });
      if (result.success) {
        setBaseline({ hoverColor, hoverEnabled, timezone });
      }
      setMessage(result.success ? "Settings saved." : (result.error ?? "Failed to save."));
      setTimeout(() => setMessage(null), 3000);
    });
  }

  return (
    <>
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-10 mb-6 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <h1 className="text-base font-bold text-amber-500 sm:text-lg">Appearance Settings</h1>
              <p className="text-xs text-zinc-500">Manage website colors and timezone settings.</p>
            </div>
          </div>
          {hasChanges && (
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleCancel} disabled={isPending}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={isPending}
              className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
          )}
        </div>
      </div>

      {message && (
        <div className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
          message.includes("Failed") || message.includes("error")
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-green-200 bg-green-50 text-green-700"
        }`}>
          {message}
        </div>
      )}

    <Card className="lg:p-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Base color — read-only, synced from General Settings theme color */}
        <div>
          <ColorField label="Light Theme Color" value={baseColor} disabled />
          <p className="mt-2 text-xs text-zinc-400">
            Light and dark brand colors are controlled in{" "}
            <Link href="/settings/general" className="font-medium text-indigo-600 hover:underline">
              General Settings
            </Link>
            .
          </p>
        </div>

        {/* Hover color */}
        <div>
          <ColorField
            label="Website Hover Color"
            value={hoverColor}
            onChange={setHoverColor}
            disabled={!hoverEnabled}
          />
          <p className="mt-2 text-xs text-zinc-400">
            Applied when hovering over buttons, cards and links.
          </p>
        </div>
      </div>

      {/* Hover enable toggle */}
      <div className="mt-6 flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3">
        <div>
          <p className="text-sm font-bold text-zinc-900">Enable Hover Color</p>
          <p className="text-xs text-zinc-400">
            When disabled, hovering keeps the base color (no color change).
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={hoverEnabled}
          onClick={() => setHoverEnabled((v) => !v)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
            hoverEnabled ? "bg-indigo-600" : "bg-zinc-300"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              hoverEnabled ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-zinc-900">
          System Timezone
        </label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="h-14 w-full rounded-lg border border-zinc-200 bg-white px-4 text-sm text-zinc-700 outline-none focus:ring-2 focus:ring-indigo-200"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
        <p className="mt-2 text-xs text-zinc-400">Select the timezone for your system.</p>
      </div>

    </Card>
    </>
  );
}
