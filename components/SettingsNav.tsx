"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cookie, Mail, Phone, Shield, Share2, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export const settingsNavItems = [
  { label: "General", href: "/settings/general", icon: SlidersHorizontal },
  { label: "Contact", href: "/settings/contact", icon: Phone },
  { label: "Email", href: "/settings/email", icon: Mail },
  { label: "Social", href: "/settings/social", icon: Share2 },
  { label: "Security", href: "/settings/security", icon: Shield },
  { label: "SEO", href: "/settings/seo", icon: Cookie },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex w-full shrink-0 flex-row gap-1 overflow-x-auto border-b border-black/10 pb-2 md:w-52 md:flex-col md:border-b-0 md:border-r md:px-4 md:py-2 md:pb-0">
      <h2 className="hidden px-2 pb-4 text-xl font-bold text-black md:block">Settings</h2>
      {settingsNavItems.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors md:gap-3 md:px-2",
              active
                ? "text-amber-500"
                : "text-zinc-600 hover:bg-black/5 hover:text-black"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
