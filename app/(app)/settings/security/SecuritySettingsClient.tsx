"use client";

import { useState } from "react";
import { Shield, Loader2 } from "lucide-react";
import { Card } from "@/components/Card";
import { saveSecuritySettings } from "@/app/actions/security-settings";

type SecurityData = {
  twoFactorEnabled: boolean;
  loginAttempts: number;
  sessionTimeout: number;
  passwordMinLength: number;
};

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        enabled ? "bg-green-500" : "bg-zinc-300"
      }`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

export function SecuritySettingsClient({ initialData }: { initialData: SecurityData }) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(initialData.twoFactorEnabled);
  const [loginAttempts, setLoginAttempts] = useState(initialData.loginAttempts);
  const [sessionTimeout, setSessionTimeout] = useState(initialData.sessionTimeout);
  const [passwordMinLength, setPasswordMinLength] = useState(initialData.passwordMinLength);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Baseline of the last-saved values, advanced after every successful save so
  // re-entering a previously-saved value is still detected as a change.
  const [baseline, setBaseline] = useState({
    twoFactorEnabled: initialData.twoFactorEnabled,
    loginAttempts: initialData.loginAttempts,
    sessionTimeout: initialData.sessionTimeout,
    passwordMinLength: initialData.passwordMinLength,
  });

  const hasChanges =
    twoFactorEnabled !== baseline.twoFactorEnabled ||
    loginAttempts !== baseline.loginAttempts ||
    sessionTimeout !== baseline.sessionTimeout ||
    passwordMinLength !== baseline.passwordMinLength;

  function handleCancel() {
    setTwoFactorEnabled(baseline.twoFactorEnabled);
    setLoginAttempts(baseline.loginAttempts);
    setSessionTimeout(baseline.sessionTimeout);
    setPasswordMinLength(baseline.passwordMinLength);
    setMessage(null);
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);
    const result = await saveSecuritySettings({
      twoFactorEnabled,
      loginAttempts,
      sessionTimeout,
      passwordMinLength,
    });
    setIsSaving(false);
    if (result.success) {
      setBaseline({ twoFactorEnabled, loginAttempts, sessionTimeout, passwordMinLength });
      setMessage({ type: "success", text: "Security settings saved!" });
    } else {
      setMessage({ type: "error", text: result.error || "Failed to save" });
    }
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <>
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-10 mb-6 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <Shield className="h-4 w-4" />
            </span>
            <div>
              <h1 className="text-base font-bold text-amber-500 sm:text-lg">Security Settings</h1>
              <p className="text-xs text-zinc-500">Manage your website security preferences</p>
            </div>
          </div>
          {hasChanges && (
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleCancel} disabled={isSaving}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={isSaving}
              className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
          )}
        </div>
      </div>

      {message && (
        <div className={`mb-5 rounded-lg px-4 py-3 text-sm ${message.type === "success" ? "border border-green-200 bg-green-50 text-green-700" : "border border-red-200 bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}

      <Card className="lg:p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Two-Factor Authentication</h3>
              <p className="mt-1 text-xs text-zinc-500">Send OTP to email on login</p>
            </div>
            <Toggle enabled={twoFactorEnabled} onToggle={() => setTwoFactorEnabled((v) => !v)} />
          </div>

          <hr className="border-zinc-200" />

          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Session Timeout</h3>
              <p className="mt-1 text-xs text-zinc-500">Auto logout after inactivity (minutes)</p>
            </div>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(Number(e.target.value))}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            >
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          <hr className="border-zinc-200" />

          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Login Attempts</h3>
              <p className="mt-1 text-xs text-zinc-500">Max failed attempts before lockout</p>
            </div>
            <select
              value={loginAttempts}
              onChange={(e) => setLoginAttempts(Number(e.target.value))}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            >
              <option value={3}>3 attempts</option>
              <option value={5}>5 attempts</option>
              <option value={10}>10 attempts</option>
            </select>
          </div>

          <hr className="border-zinc-200" />

          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Password Min Length</h3>
              <p className="mt-1 text-xs text-zinc-500">Minimum characters required</p>
            </div>
            <select
              value={passwordMinLength}
              onChange={(e) => setPasswordMinLength(Number(e.target.value))}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            >
              <option value={6}>6 chars</option>
              <option value={8}>8 chars</option>
              <option value={10}>10 chars</option>
              <option value={12}>12 chars</option>
            </select>
          </div>
        </div>
      </Card>
    </>
  );
}
