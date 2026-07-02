"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export default function PopupSettingsPage() {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <Card className="p-6 sm:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-xl font-bold text-zinc-900">
          <ShieldCheck className="h-5 w-5 text-zinc-900" />
          Website Popup Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage Website popup display settings and content.
        </p>
      </div>

      <div className="space-y-6">
        {/* Show website popup toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-zinc-800">Show website popup?</span>
          <button
            type="button"
            role="switch"
            aria-checked={showPopup}
            onClick={() => setShowPopup((v) => !v)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
              showPopup ? "bg-green-500" : "bg-zinc-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                showPopup ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Popup Content */}
        <div>
          <label className="mb-2 block text-sm font-bold text-zinc-800">
            Popup Content
          </label>
          <textarea
            rows={5}
            className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </div>
    </Card>
  );
}
