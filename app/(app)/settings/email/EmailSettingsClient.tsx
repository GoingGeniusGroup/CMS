"use client";

import { useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Card } from "@/components/Card";
import { saveEmailSettings, type EmailSettingInput } from "@/app/actions/email-settings";

type EmailData = {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  fromName: string;
  fromEmail: string;
  encryption: string;
};

export function EmailSettingsClient({ initialData }: { initialData: EmailData }) {
  const [smtpHost, setSmtpHost] = useState(initialData.smtpHost);
  const [smtpPort, setSmtpPort] = useState(initialData.smtpPort);
  const [smtpUser, setSmtpUser] = useState(initialData.smtpUser);
  const [smtpPassword, setSmtpPassword] = useState(initialData.smtpPassword);
  const [fromName, setFromName] = useState(initialData.fromName);
  const [fromEmail, setFromEmail] = useState(initialData.fromEmail);
  const [encryption, setEncryption] = useState(initialData.encryption);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Baseline of the last-saved values, advanced after every successful save so
  // re-entering a previously-saved value is still detected as a change.
  const [baseline, setBaseline] = useState({
    smtpHost: initialData.smtpHost,
    smtpPort: initialData.smtpPort,
    smtpUser: initialData.smtpUser,
    smtpPassword: initialData.smtpPassword,
    fromName: initialData.fromName,
    fromEmail: initialData.fromEmail,
    encryption: initialData.encryption,
  });

  const hasChanges =
    smtpHost !== baseline.smtpHost ||
    smtpPort !== baseline.smtpPort ||
    smtpUser !== baseline.smtpUser ||
    smtpPassword !== baseline.smtpPassword ||
    fromName !== baseline.fromName ||
    fromEmail !== baseline.fromEmail ||
    encryption !== baseline.encryption;

  function handleCancel() {
    setSmtpHost(baseline.smtpHost);
    setSmtpPort(baseline.smtpPort);
    setSmtpUser(baseline.smtpUser);
    setSmtpPassword(baseline.smtpPassword);
    setFromName(baseline.fromName);
    setFromEmail(baseline.fromEmail);
    setEncryption(baseline.encryption);
    setMessage(null);
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);
    const result = await saveEmailSettings({
      smtpHost, smtpPort, smtpUser, smtpPassword, fromName, fromEmail, encryption,
    });
    setIsSaving(false);
    if (result.success) {
      setBaseline({ smtpHost, smtpPort, smtpUser, smtpPassword, fromName, fromEmail, encryption });
      setMessage({ type: "success", text: "Email settings saved!" });
    } else {
      setMessage({ type: "error", text: result.error || "Failed to save" });
    }
    setTimeout(() => setMessage(null), 3000);
  }

  const inputCls = "w-full rounded-lg border border-black/15 bg-zinc-50/50 px-3 py-3 text-sm outline-none focus:border-indigo-400";

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
              <h1 className="text-base font-bold text-amber-500 sm:text-lg">Email Settings</h1>
              <p className="text-xs text-zinc-500">Configure the email settings for sending emails.</p>
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
        <div className={`mb-6 rounded-lg px-4 py-3 text-sm ${message.type === "success" ? "border border-green-200 bg-green-50 text-green-700" : "border border-red-200 bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}

    <Card className="text-zinc-800 sm:p-8">
      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email sent from address</label>
          <input type="email" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} placeholder="noreply@company.com" className={inputCls} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email sent from name</label>
          <input type="text" value={fromName} onChange={(e) => setFromName(e.target.value)} placeholder="Going Genius" className={inputCls} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">SMTP Host</label>
          <input type="text" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} placeholder="smtp.gmail.com" className={inputCls} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">SMTP User</label>
          <input type="text" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} placeholder="user@gmail.com" className={inputCls} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">SMTP Password</label>
          <input type="password" value={smtpPassword} onChange={(e) => setSmtpPassword(e.target.value)} placeholder="••••••••" className={inputCls} />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">SMTP Port</label>
            <input type="text" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} placeholder="587" className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Security Type</label>
            <select value={encryption} onChange={(e) => setEncryption(e.target.value)} className={inputCls}>
              <option value="none">None</option>
              <option value="ssl">SSL</option>
              <option value="tls">TLS</option>
            </select>
          </div>
        </div>
      </div>
    </Card>
    </>
  );
}
