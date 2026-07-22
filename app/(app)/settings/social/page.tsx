"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Globe, Share2 } from "lucide-react";
import { Card } from "@/components/Card";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { getSocialSettings, saveSocialSettings, type SocialLinks } from "@/app/actions/social";

const socialFields = [
  { name: "facebook" as const, label: "Facebook", placeholder: "https://facebook.com/...", icon: FaFacebookF, color: "#1877f2" },
  { name: "twitter" as const, label: "Twitter URL", placeholder: "https://twitter.com/...", icon: FaXTwitter, color: "#1da1f2" },
  { name: "linkedin" as const, label: "LinkedIn URL", placeholder: "https://linkedin.com/...", icon: FaLinkedinIn, color: "#0a66c2" },
  { name: "instagram" as const, label: "Instagram URL", placeholder: "https://instagram.com/...", icon: FaInstagram, color: "#e1306c" },
  { name: "pinterest" as const, label: "Pinterest URL", placeholder: "https://pinterest.com/...", icon: FaPinterestP, color: "#e60023" },
  { name: "youtube" as const, label: "YouTube URL", placeholder: "https://youtube.com/...", icon: FaYoutube, color: "#ff0000" },
  { name: "whatsapp" as const, label: "WhatsApp No", placeholder: "+1 234 567 890", icon: FaWhatsapp, color: "#25d366" },
];

export default function SocialSettingsPage() {
  const [values, setValues] = useState<SocialLinks>({
    facebook: "", twitter: "", linkedin: "", instagram: "",
    pinterest: "", youtube: "", whatsapp: "",
  });
  const [savedValues, setSavedValues] = useState<SocialLinks | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof SocialLinks, string>>>({});
  const [toast, setToast] = useState<{ message: string; ok: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loaded, setLoaded] = useState(false);

  // Load on mount
  useEffect(() => {
    getSocialSettings().then((data) => {
      setValues(data);
      setSavedValues(data);
      setLoaded(true);
    });
  }, []);

  const hasChanges = savedValues !== null && (
    values.facebook !== savedValues.facebook ||
    values.twitter !== savedValues.twitter ||
    values.linkedin !== savedValues.linkedin ||
    values.instagram !== savedValues.instagram ||
    values.pinterest !== savedValues.pinterest ||
    values.youtube !== savedValues.youtube ||
    values.whatsapp !== savedValues.whatsapp
  );

  function handleCancel() {
    if (savedValues) {
      setValues({ ...savedValues });
    }
    setErrors({});
    setToast(null);
  }

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  function handleChange(name: keyof SocialLinks, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate(): boolean {
    const urlPattern = /^https?:\/\/.+/i;
    const newErrors: Partial<Record<keyof SocialLinks, string>> = {};

    for (const field of socialFields) {
      const val = values[field.name].trim();
      if (!val) continue; // empty is OK — optional
      if (field.name === "whatsapp") {
        // Allow phone format
        if (val.length < 5) newErrors[field.name] = "Enter a valid phone number";
      } else {
        if (!urlPattern.test(val)) newErrors[field.name] = "Enter a valid URL (https://...)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    // Don't save if all fields are empty
    const hasAnyValue = Object.values(values).some((v) => v.trim() !== "");
    if (!hasAnyValue) {
      setToast({ message: "Please fill at least one social link before saving.", ok: false });
      return;
    }

    if (!validate()) {
      setToast({ message: "Please fix the errors below before saving.", ok: false });
      return;
    }

    startTransition(async () => {
      const result = await saveSocialSettings(values);
      if (result.success) {
        setSavedValues({ ...values });
      }
      setToast(
        result.success
          ? { message: "Social settings saved successfully.", ok: true }
          : { message: result.error ?? "Failed to save.", ok: false }
      );
    });
  }

  return (
    <>
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-10 mb-6 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <Share2 className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-amber-500 sm:text-lg">Social Settings</h1>
                <Link
                  href="/settings/footer"
                  className="group relative flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-500 transition-colors hover:bg-sky-100"
                >
                  <Globe className="h-4 w-4" />
                  <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    Move to website/footer
                  </span>
                </Link>
              </div>
              <p className="text-xs text-zinc-500">Manage social media links.</p>
            </div>
          </div>
          {hasChanges && (
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleCancel} disabled={isPending}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={isPending || !loaded}
              className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`mb-6 rounded-lg px-4 py-2.5 text-sm font-medium ${
            toast.ok
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {toast.message}
        </div>
      )}

    <Card className="lg:p-8">
      <div className="flex flex-col gap-5">
        {socialFields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.name} className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" style={{ color: field.color }} />
                <label htmlFor={field.name} className="text-sm font-semibold text-black">
                  {field.label}
                </label>
              </div>
              <input
                id={field.name}
                name={field.name}
                type="text"
                value={values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={`h-11 w-full rounded-lg border px-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200 ${
                  errors[field.name] ? "border-red-400" : "border-zinc-200"
                }`}
              />
              {errors[field.name] && (
                <p className="text-xs text-red-500">{errors[field.name]}</p>
              )}
            </div>
          );
        })}

        {!loaded && (
          <p className="text-sm text-zinc-400 text-center py-4">Loading settings...</p>
        )}
      </div>
    </Card>
    </>
  );
}
