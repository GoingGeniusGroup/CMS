"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-zinc-900">{label}</label>
      <div className="flex items-center gap-3">
        {/* Color swatch — clicking it opens the native color picker */}
        <label className="cursor-pointer">
          <span
            className="block h-12 w-12 shrink-0 rounded-lg border border-zinc-200 shadow-sm"
            style={{ backgroundColor: value }}
          />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
        </label>
        {/* Hex text input */}
        <input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => onChange(e.target.value)}
          maxLength={7}
          className="h-12 flex-1 rounded-lg border border-zinc-200 px-4 text-sm text-zinc-800 outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>
    </div>
  );
}

export default function AppearanceSettingsPage() {
  const [baseColor, setBaseColor]       = useState("#825DD2");
  const [hoverColor, setHoverColor]     = useState("#D78539");
  const [timezone, setTimezone]         = useState("(GMT+06:45) Asia/Kathmandu");

  return (
    <Card className="lg:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-800">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl">
              Appearance Settings
            </h1>
          </div>
          <p className="mt-2 text-sm text-zinc-500">
            Manage website colors and timezone settings.
          </p>
        </div>
      </div>

      {/* Color fields */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ColorField
          label="Website Base Color"
          value={baseColor}
          onChange={setBaseColor}
        />
        <ColorField
          label="Website Base Hover Color"
          value={hoverColor}
          onChange={setHoverColor}
        />
      </div>

      {/* Timezone */}
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
        <p className="mt-2 text-xs text-zinc-400">
          Select the timezone for your system.
        </p>
      </div>

      {/* Save */}
      <div className="mt-8 flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </Card>
  );
}
