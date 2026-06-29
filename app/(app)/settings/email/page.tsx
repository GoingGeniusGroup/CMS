"use client";

import { useState } from "react";
import { ShieldCheck, Send, ChevronDown } from "lucide-react";

export default function EmailSettingsPage() {
  const [useSmtp, setUseSmtp] = useState(true);

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-8 text-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-amber-500">
            <ShieldCheck className="h-5 w-5" />
            Email Settings
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Configure the email settings for sending emails.
          </p>
        </div>
        <button className="rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm">
          Save Changes
        </button>
      </div>

      <div className="space-y-5">
        {/* Email sent from address */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email sent from address</label>
          <input
            type="email"
            className="w-full rounded-lg border border-black/15 bg-zinc-50/50 px-3 py-3 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        {/* Email sent from name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email sent from name</label>
          <input
            type="text"
            className="w-full rounded-lg border border-black/15 bg-zinc-50/50 px-3 py-3 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        {/* Use SMTP toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Use SMTP</span>
          <button
            type="button"
            role="switch"
            aria-checked={useSmtp}
            onClick={() => setUseSmtp((v) => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              useSmtp ? "bg-green-500" : "bg-zinc-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                useSmtp ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* SMTP Host */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">SMTP Host</label>
          <input
            type="text"
            className="w-full rounded-lg border border-black/15 bg-zinc-50/50 px-3 py-3 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        {/* SMTP User */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">SMTP User</label>
          <input
            type="text"
            className="w-full rounded-lg border border-black/15 bg-zinc-50/50 px-3 py-3 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        {/* SMTP Password */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">SMTP Password</label>
          <input
            type="password"
            className="w-full rounded-lg border border-black/15 bg-zinc-50/50 px-3 py-3 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        {/* SMTP Port + Security Type */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">SMTP Port</label>
            <input
              type="text"
              className="w-full rounded-lg border border-black/15 bg-zinc-50/50 px-3 py-3 text-sm outline-none focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Security Type</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-black/15 bg-zinc-50/50 px-3 py-3 text-sm text-zinc-500 outline-none focus:border-indigo-400">
                <option value="">Select</option>
                <option>None</option>
                <option>SSL</option>
                <option>TLS</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            </div>
          </div>
        </div>

        {/* Send a test mail */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium">Send a test mail to</label>
            <input
              type="email"
              className="w-full rounded-lg border border-black/15 bg-zinc-50/50 px-3 py-3 text-sm outline-none focus:border-indigo-400"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-4 py-3 text-sm font-semibold text-indigo-600">
            <Send className="h-4 w-4" />
            Send Test Mail
          </button>
        </div>
      </div>
    </div>
  );
}
