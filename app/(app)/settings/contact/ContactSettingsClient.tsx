"use client";

import { useState } from "react";
import { Phone, Loader2 } from "lucide-react";
import { Card } from "@/components/Card";
import { saveContactSettings } from "@/app/actions/contact-settings";

type ContactData = {
  phone1?: string;
  phone2?: string;
  email1?: string;
  email2?: string;
  address?: string;
  contactMail?: string;
  officeHours?: string;
  googleMapEmbed?: string;
  floatingChatEnabled?: boolean;
  floatingChatPlatform?: string;
  floatingChatValue?: string;
  floatingChatLabel?: string;
} | null;

// ─── Validation helpers ──────────────────────────────────────────────────────

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPhone(val: string) {
  const cleaned = val.replace(/[\s\-()]/g, "");
  return /^\+\d{1,3}\d{6,14}$/.test(cleaned);
}

function validateFields(fields: {
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
  contactMail: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!fields.phone1.trim()) {
    errors.phone1 = "Phone number 1 is required";
  } else if (!isValidPhone(fields.phone1)) {
    errors.phone1 = "Enter a valid number with country code (e.g. +977 9800000000)";
  }

  if (fields.phone2 && !isValidPhone(fields.phone2)) {
    errors.phone2 = "Enter a valid number with country code (e.g. +977 9800000001)";
  }

  if (!fields.email1.trim()) {
    errors.email1 = "Email address 1 is required";
  } else if (!emailRegex.test(fields.email1)) {
    errors.email1 = "Please enter a valid email address";
  }

  if (fields.email2 && !emailRegex.test(fields.email2)) {
    errors.email2 = "Please enter a valid email address";
  }

  if (!fields.contactMail.trim()) {
    errors.contactMail = "Contact mail is required";
  } else if (!emailRegex.test(fields.contactMail)) {
    errors.contactMail = "Please enter a valid email address";
  }

  return errors;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ContactSettingsClient({ initialData }: { initialData: ContactData }) {
  const [phone1, setPhone1] = useState(initialData?.phone1 ?? "");
  const [phone2, setPhone2] = useState(initialData?.phone2 ?? "");
  const [email1, setEmail1] = useState(initialData?.email1 ?? "");
  const [email2, setEmail2] = useState(initialData?.email2 ?? "");
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [contactMail, setContactMail] = useState(initialData?.contactMail ?? "");
  const [officeHours, setOfficeHours] = useState(initialData?.officeHours ?? "");
  const [googleMapEmbed, setGoogleMapEmbed] = useState(initialData?.googleMapEmbed ?? "");
  const [floatingChatEnabled, setFloatingChatEnabled] = useState(initialData?.floatingChatEnabled ?? false);
  const [floatingChatPlatform, setFloatingChatPlatform] = useState(initialData?.floatingChatPlatform ?? "whatsapp");
  const [floatingChatValue, setFloatingChatValue] = useState(initialData?.floatingChatValue ?? "");
  const [floatingChatLabel, setFloatingChatLabel] = useState(initialData?.floatingChatLabel ?? "Chat with us");

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Baseline of the last-saved values, advanced after every successful save so
  // re-entering a previously-saved value is still detected as a change.
  const [baseline, setBaseline] = useState({
    phone1: initialData?.phone1 ?? "",
    phone2: initialData?.phone2 ?? "",
    email1: initialData?.email1 ?? "",
    email2: initialData?.email2 ?? "",
    address: initialData?.address ?? "",
    contactMail: initialData?.contactMail ?? "",
    officeHours: initialData?.officeHours ?? "",
    googleMapEmbed: initialData?.googleMapEmbed ?? "",
    floatingChatEnabled: initialData?.floatingChatEnabled ?? false,
    floatingChatPlatform: initialData?.floatingChatPlatform ?? "whatsapp",
    floatingChatValue: initialData?.floatingChatValue ?? "",
    floatingChatLabel: initialData?.floatingChatLabel ?? "Chat with us",
  });

  const hasChanges =
    phone1 !== baseline.phone1 ||
    phone2 !== baseline.phone2 ||
    email1 !== baseline.email1 ||
    email2 !== baseline.email2 ||
    address !== baseline.address ||
    contactMail !== baseline.contactMail ||
    officeHours !== baseline.officeHours ||
    googleMapEmbed !== baseline.googleMapEmbed ||
    floatingChatEnabled !== baseline.floatingChatEnabled ||
    floatingChatPlatform !== baseline.floatingChatPlatform ||
    floatingChatValue !== baseline.floatingChatValue ||
    floatingChatLabel !== baseline.floatingChatLabel;

  function handleCancel() {
    setPhone1(baseline.phone1);
    setPhone2(baseline.phone2);
    setEmail1(baseline.email1);
    setEmail2(baseline.email2);
    setAddress(baseline.address);
    setContactMail(baseline.contactMail);
    setOfficeHours(baseline.officeHours);
    setGoogleMapEmbed(baseline.googleMapEmbed);
    setFloatingChatEnabled(baseline.floatingChatEnabled);
    setFloatingChatPlatform(baseline.floatingChatPlatform);
    setFloatingChatValue(baseline.floatingChatValue);
    setFloatingChatLabel(baseline.floatingChatLabel);
    setMessage(null);
    setFieldErrors({});
  }

  async function handleSave() {
    // Client-side validation first
    const errors = validateFields({ phone1, phone2, email1, email2, contactMail });
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setMessage({ type: "error", text: "Please fix the errors below" });
      setTimeout(() => setMessage(null), 4000);
      return;
    }

    setIsSaving(true);
    setMessage(null);

    const result = await saveContactSettings({
      phone1,
      phone2,
      email1,
      email2,
      address,
      contactMail,
      officeHours,
      googleMapEmbed,
      floatingChatEnabled,
      floatingChatPlatform: floatingChatPlatform as "whatsapp" | "messenger" | "custom",
      floatingChatValue,
      floatingChatLabel,
    });

    setIsSaving(false);

    if (result.success) {
      setBaseline({ phone1, phone2, email1, email2, address, contactMail, officeHours, googleMapEmbed, floatingChatEnabled, floatingChatPlatform, floatingChatValue, floatingChatLabel });
      setMessage({ type: "success", text: "Contact settings saved!" });
      setFieldErrors({});
    } else {
      // Show server-side field errors if returned
      if ("fieldErrors" in result && result.fieldErrors) {
        setFieldErrors(result.fieldErrors as Record<string, string>);
      }
      setMessage({ type: "error", text: result.error || "Failed to save" });
    }
    setTimeout(() => setMessage(null), 4000);
  }

  const inputCls = (field: string) =>
    `h-11 w-full rounded-lg border px-4 text-sm text-black shadow-sm outline-none focus:ring-2 ${
      fieldErrors[field]
        ? "border-red-300 focus:ring-red-200"
        : "border-zinc-200 focus:ring-sky-200"
    }`;

  return (
    <>
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-10 mb-6 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <Phone className="h-4 w-4" />
            </span>
            <div>
              <h1 className="text-base font-bold text-amber-500 sm:text-lg">Contact Settings</h1>
              <p className="text-xs text-zinc-500">Manage your contact information that will be displayed on websites.</p>
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

      {/* Message */}
      {message && (
        <div className={`mb-6 rounded-lg px-4 py-3 text-sm ${
          message.type === "success"
            ? "border border-green-200 bg-green-50 text-green-700"
            : "border border-red-200 bg-red-50 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

    <Card>
      {/* Phone numbers */}
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Phone No 1 <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            value={phone1}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^\d+\s\-()]/g, "");
              const plusCount = (cleaned.match(/\+/g) || []).length;
              setPhone1(plusCount > 1 ? "+" + cleaned.replace(/\+/g, "") : cleaned);
              if (fieldErrors.phone1) setFieldErrors((prev) => ({ ...prev, phone1: "" }));
            }}
            placeholder="+977 9800000000"
            className={inputCls("phone1")}
          />
          {fieldErrors.phone1 && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.phone1}</p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Phone No 2
          </label>
          <input
            type="tel"
            value={phone2}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^\d+\s\-()]/g, "");
              const plusCount = (cleaned.match(/\+/g) || []).length;
              setPhone2(plusCount > 1 ? "+" + cleaned.replace(/\+/g, "") : cleaned);
              if (fieldErrors.phone2) setFieldErrors((prev) => ({ ...prev, phone2: "" }));
            }}
            placeholder="+977 9800000001"
            className={inputCls("phone2")}
          />
          {fieldErrors.phone2 && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.phone2}</p>
          )}
        </div>
      </div>

      {/* Email addresses */}
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Email Address 1 <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            value={email1}
            onChange={(e) => {
              setEmail1(e.target.value);
              if (fieldErrors.email1) setFieldErrors((prev) => ({ ...prev, email1: "" }));
            }}
            placeholder="info@company.com"
            className={inputCls("email1")}
          />
          {fieldErrors.email1 && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.email1}</p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Email Address 2
          </label>
          <input
            type="email"
            value={email2}
            onChange={(e) => {
              setEmail2(e.target.value);
              if (fieldErrors.email2) setFieldErrors((prev) => ({ ...prev, email2: "" }));
            }}
            placeholder="support@company.com"
            className={inputCls("email2")}
          />
          {fieldErrors.email2 && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.email2}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-semibold text-black">
          Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Kathmandu, Nepal"
          className={inputCls("address")}
        />
      </div>

      {/* Contact Mail */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-semibold text-black">
          Contact Mail <span className="text-rose-500">*</span>
        </label>
        <input
          type="email"
          value={contactMail}
          onChange={(e) => {
            setContactMail(e.target.value);
            if (fieldErrors.contactMail) setFieldErrors((prev) => ({ ...prev, contactMail: "" }));
          }}
          placeholder="contact@company.com"
          className={inputCls("contactMail")}
        />
        {fieldErrors.contactMail && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.contactMail}</p>
        )}
        <p className="mt-1 text-xs text-zinc-400">
          This email receives messages from the contact form.
        </p>
      </div>

      {/* Office Hours */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-semibold text-black">
          Office Hours Open-Close Times
        </label>
        <input
          type="text"
          value={officeHours}
          onChange={(e) => setOfficeHours(e.target.value)}
          placeholder="Monday to Friday 9:00am - 6:00pm"
          className={inputCls("officeHours")}
        />
      </div>

      {/* Google Map */}
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Google Map Embed Code
          </label>
          <textarea
            value={googleMapEmbed}
            onChange={(e) => setGoogleMapEmbed(e.target.value)}
            placeholder='<iframe src="https://maps.google.com/..." ...></iframe>'
            className="h-56 w-full resize-none rounded-xl border border-zinc-200 p-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Google Map Preview
          </label>
          {googleMapEmbed ? (
            <div
              className="h-56 w-full overflow-hidden rounded-xl border border-zinc-200"
              dangerouslySetInnerHTML={{ __html: googleMapEmbed }}
            />
          ) : (
            <div className="flex h-56 w-full items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-sm text-zinc-400">
              Paste embed code to preview
            </div>
          )}
        </div>
      </div>
    </Card>

    {/* Floating Chat Widget */}
    <Card className="mt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-zinc-900">Floating Chat Widget</h3>
          <p className="text-xs text-zinc-500">Show a floating chat button on the website for quick messaging.</p>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={floatingChatEnabled}
            onChange={(e) => setFloatingChatEnabled(e.target.checked)}
            className="peer sr-only"
          />
          <div className="peer h-6 w-11 rounded-full bg-zinc-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full" />
        </label>
      </div>

      {floatingChatEnabled && (
        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-black">Platform</label>
            <div className="flex flex-wrap gap-2">
              {([
                { value: "whatsapp", label: "WhatsApp", color: "bg-[#25D366]" },
                { value: "messenger", label: "Messenger", color: "bg-[#0084FF]" },
                { value: "custom", label: "Custom Link", color: "bg-indigo-600" },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFloatingChatPlatform(opt.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    floatingChatPlatform === opt.value
                      ? `${opt.color} text-white shadow-md`
                      : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-black">
              {floatingChatPlatform === "whatsapp"
                ? "WhatsApp Number (with country code)"
                : floatingChatPlatform === "messenger"
                  ? "Facebook Page Username or ID"
                  : "Chat URL"}
            </label>
            <input
              type="text"
              value={floatingChatValue}
              onChange={(e) => setFloatingChatValue(e.target.value)}
              placeholder={
                floatingChatPlatform === "whatsapp"
                  ? "+977 9800000000"
                  : floatingChatPlatform === "messenger"
                    ? "yourpagename"
                    : "https://tawk.to/chat/..."
              }
              className={inputCls("floatingChatValue")}
            />
            <p className="mt-1 text-xs text-zinc-400">
              {floatingChatPlatform === "whatsapp"
                ? "Include country code. Example: +977 9812345678"
                : floatingChatPlatform === "messenger"
                  ? "Your Facebook page username (the part after facebook.com/)"
                  : "Full URL to your chat service"}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-black">Tooltip Label</label>
            <input
              type="text"
              value={floatingChatLabel}
              onChange={(e) => setFloatingChatLabel(e.target.value)}
              placeholder="Chat with us"
              className={inputCls("floatingChatLabel")}
            />
            <p className="mt-1 text-xs text-zinc-400">
              Shown when hovering over the floating button.
            </p>
          </div>
        </div>
      )}
    </Card>
    </>
  );
}
