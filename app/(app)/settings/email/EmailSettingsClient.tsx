"use client";

import { useState } from "react";
import { ShieldCheck, Send, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/Button";
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

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);
    const result = await saveEmailSettings({
      smtpHost, smtpPort, smtpUser, smtpPassword, fromName, fromEmail, encryption,
    });
    setIsSaving(false);
    if (result.success) {
      setMessage({ type: "success", text: "Email settings saved!" });
    } else {
      setMessage({ type: "error", text: result.error || "Failed to save" });
    }
    setTimeout(() => setMessage(null), 3000);
  }

  const inputCls = "w-full rounded-lg border border-black/15 bg-zinc-50/50 px-3 py-3 text-sm outline-none focus:border-indigo-400";

  return (
    <Card className="text-zinc-800 sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-amber-500">
            <ShieldCheck className="h-5 w-5" />
            Email Settings
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Configure the email settings for sending emails.</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <div className={`mb-5 rounded-lg px-4 py-3 text-sm ${message.type === "success" ? "border border-green-200 bg-green-50 text-green-700" : "border border-red-200 bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}

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
  );
}
