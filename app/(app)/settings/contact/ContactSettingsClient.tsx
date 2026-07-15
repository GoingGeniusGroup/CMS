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
} | null;

// ─── Validation helpers ──────────────────────────────────────────────────────

const phoneRegex = /^[0-9+\-\s()]*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  } else if (!phoneRegex.test(fields.phone1)) {
    errors.phone1 = "Only digits, +, -, spaces, and parentheses allowed";
  }

  if (fields.phone2 && !phoneRegex.test(fields.phone2)) {
    errors.phone2 = "Only digits, +, -, spaces, and parentheses allowed";
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

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    });

    setIsSaving(false);

    if (result.success) {
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
    <Card>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <Phone className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold text-amber-500">
              Contact Settings
            </h1>
          </div>
          <p className="mt-2 text-sm text-black">
            Manage your contact information that will be displayed on websites.
          </p>
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

      {/* Message */}
      {message && (
        <div className={`mt-4 rounded-lg px-4 py-3 text-sm ${
          message.type === "success"
            ? "border border-green-200 bg-green-50 text-green-700"
            : "border border-red-200 bg-red-50 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

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
              setPhone1(e.target.value);
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
              setPhone2(e.target.value);
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
  );
}
