"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Globe, Share2 } from "lucide-react";
import { Button } from "@/components/Button";
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
  const [errors, setErrors] = useState<Partial<Record<keyof SocialLinks, string>>>({});
  const [toast, setToast] = useState<{ message: string; ok: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loaded, setLoaded] = useState(false);

  // Load on mount
  useEffect(() => {
    getSocialSettings().then((data) => {
      setValues(data);
      setLoaded(true);
    });
  }, []);

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
      setToast(
        result.success
          ? { message: "Social settings saved successfully.", ok: true }
          : { message: result.error ?? "Failed to save.", ok: false }
      );
    });
  }

  return (
    <Card className="lg:p-8">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <Share2 className="h-4 w-4" />
            </span>
            <h1 className="text-lg font-bold text-amber-500">Social Settings</h1>
            <Link
              href="/settings/footer"
              className="group relative ml-1 flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-500 transition-colors hover:bg-sky-100"
            >
              <Globe className="h-4 w-4 animate-spin-slow" />
              <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                Move to website/footer
              </span>
            </Link>
          </div>
          <p className="text-sm text-zinc-500">Manage social media links.</p>
        </div>
        <Button className="shrink-0" onClick={handleSave} disabled={isPending || !loaded}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`mt-4 rounded-lg px-4 py-2.5 text-sm font-medium ${
            toast.ok
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-5">
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
  );
}
