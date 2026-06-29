'use client';

import { useState } from 'react';
import { Shield, ChevronDown } from 'lucide-react';

// ─── Toggle Switch Component ───
// Uses inline styles (not Tailwind translate/width utilities) so it renders
// correctly regardless of the host project's Tailwind version/config.
function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={enabled}
      style={{
        width: '44px',
        height: '24px',
        minWidth: '44px',
        borderRadius: '9999px',
        border: 'none',
        padding: '2px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: enabled ? 'flex-end' : 'flex-start',
        backgroundColor: enabled ? '#10b981' : '#d1d5db',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        flexShrink: 0,
        boxSizing: 'border-box',
        outline: 'none',
      }}
    >
      <span
        style={{
          width: '18px',
          height: '18px',
          minWidth: '18px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
          transition: 'transform 0.2s ease',
          display: 'block',
        }}
      />
    </button>
  );
}

// ─── Dropdown Component ───
function Dropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative ${open ? 'z-30' : ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
      >
        {value}
        <ChevronDown
          className={`h-3.5 w-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full z-30 mt-1 whitespace-nowrap rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
            style={{ minWidth: '160px' }}
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-gray-50 ${
                  value === opt ? 'font-semibold text-emerald-600' : 'text-gray-700'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Security Card ───
function SecurityCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
      <div className="min-w-0">
        <h3 className="text-sm font-bold text-gray-900 sm:text-base">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-gray-500 sm:text-sm">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ─── Main Page ───
export default function SecuritySettingsPage() {
  const [twoFactor, setTwoFactor] = useState(true);
  const [passwordPolicy, setPasswordPolicy] = useState(true);
  const [activityLog, setActivityLog] = useState(true);

  const [sessionTimeout, setSessionTimeout] = useState('30 Minutes');
  const [loginAttempts, setLoginAttempts] = useState('5 Attempts');

  const sessionOptions = ['15 Minutes', '30 Minutes', '1 Hour', '2 Hours', '4 Hours'];
  const attemptsOptions = ['3 Attempts', '5 Attempts', '10 Attempts', '15 Attempts'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        {/* ─── Header ─── */}
        <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-500 sm:h-6 sm:w-6" />
              <h1 className="text-lg font-bold text-amber-500 sm:text-2xl">Security Settings</h1>
            </div>
            <p className="mt-1 text-xs text-gray-500 sm:ml-8 sm:text-sm">
              Manage your website security preferences
            </p>
          </div>
          <button className="shrink-0 rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 sm:px-4 sm:text-sm">
            Save Changes
          </button>
        </div>

        {/* ─── Cards ─── */}
        <div className="flex flex-col gap-4 sm:gap-5">
          <SecurityCard
            title="Two-Factor Authentication"
            description="Send OTP to email on login"
          >
            <Toggle enabled={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} />
          </SecurityCard>

          <SecurityCard
            title="Session Timeout"
            description="Automatically log out inactive users."
          >
            <Dropdown
              value={sessionTimeout}
              options={sessionOptions}
              onChange={setSessionTimeout}
            />
          </SecurityCard>

          <SecurityCard
            title="Login Attempts"
            description="Limit number of login attempts before lockout."
          >
            <Dropdown
              value={loginAttempts}
              options={attemptsOptions}
              onChange={setLoginAttempts}
            />
          </SecurityCard>

          <SecurityCard
            title="Password Policy"
            description="Enhance Strong password for all users."
          >
            <Toggle enabled={passwordPolicy} onToggle={() => setPasswordPolicy(!passwordPolicy)} />
          </SecurityCard>

          <SecurityCard
            title="Activity Log"
            description="Track and log users activities."
          >
            <Toggle enabled={activityLog} onToggle={() => setActivityLog(!activityLog)} />
          </SecurityCard>
        </div>
      </div>
    </div>
  );
}