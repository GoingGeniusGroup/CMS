"use client";

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

const socialFields = [
  {
    name: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/...",
    icon: FaFacebookF,
    color: "#1877f2",
  },
  {
    name: "twitter",
    label: "Twitter URL",
    placeholder: "https://twitter.com/...",
    icon: FaXTwitter,
    color: "#1da1f2",
  },
  {
    name: "linkedin",
    label: "LinkedIn URL",
    placeholder: "https://linkedin.com/...",
    icon: FaLinkedinIn,
    color: "#0a66c2",
  },
  {
    name: "instagram",
    label: "Instagram URL",
    placeholder: "https://instagram.com/...",
    icon: FaInstagram,
    color: "#e1306c",
  },
  {
    name: "pinterest",
    label: "Pinterest URL",
    placeholder: "https://pinterest.com/...",
    icon: FaPinterestP,
    color: "#e60023",
  },
  {
    name: "youtube",
    label: "YouTube URL",
    placeholder: "https://youtube.com/...",
    icon: FaYoutube,
    color: "#ff0000",
  },
  {
    name: "whatsapp",
    label: "WhatsApp No",
    placeholder: "+1 234 567 890",
    icon: FaWhatsapp,
    color: "#25d366",
  },
];

export default function SocialSettingsPage() {
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
        <Button className="shrink-0">Save Changes</Button>
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {socialFields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.name} className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" style={{ color: field.color }} />
                <label
                  htmlFor={field.name}
                  className="text-sm font-semibold text-black"
                >
                  {field.label}
                </label>
              </div>
              <input
                id={field.name}
                name={field.name}
                type="text"
                placeholder={field.placeholder}
                className="h-11 w-full rounded-lg border border-zinc-200 px-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
