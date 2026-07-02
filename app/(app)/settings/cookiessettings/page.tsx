'use client';

import { useState } from 'react';
import { Cookie } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

function Toggle({
  on,
  onToggle,
  id,
}: {
  on: boolean;
  onToggle: () => void;
  id: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
        on ? 'bg-emerald-500' : 'bg-zinc-300'
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
          on ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  );
}

export default function CookiesSettingsPage() {
  const [cookiesAgreement, setCookiesAgreement] = useState(true);
  const [showCookiesAgreement, setShowCookiesAgreement] = useState(true);
  const [cookiesAgreementText, setCookiesAgreementText] = useState('');

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
            Manage cookies agreement and related settings.
          </p>
        </div>
        <Button className="shrink-0">Save Changes</Button>
      </div>

      {/* Cookies Agreement toggle */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <label
          htmlFor="cookies-agreement"
          className="text-sm font-semibold text-black cursor-pointer"
        >
          Cookies Agreement
        </label>
        <Toggle
          id="cookies-agreement"
          on={cookiesAgreement}
          onToggle={() => setCookiesAgreement((v) => !v)}
        />
      </div>

      {/* Cookies Agreement Text */}
      <div className="mt-6">
        <label
          htmlFor="cookies-text"
          className="mb-2 block text-sm font-semibold text-black"
        >
          Cookies Agreement Text
        </label>
        <textarea
          id="cookies-text"
          rows={4}
          value={cookiesAgreementText}
          onChange={(e) => setCookiesAgreementText(e.target.value)}
          className="w-full resize-none rounded-lg border border-zinc-200 p-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>

      {/* Show Cookies Agreement toggle */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <label
          htmlFor="show-cookies-agreement"
          className="text-sm font-semibold text-black cursor-pointer"
        >
          Show Cookies Agreement?
        </label>
        <Toggle
          id="show-cookies-agreement"
          on={showCookiesAgreement}
          onToggle={() => setShowCookiesAgreement((v) => !v)}
        />
      </div>
    </Card>
  );
}
