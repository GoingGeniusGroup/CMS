"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, Shield, Share2, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export const settingsNavItems = [
  { label: "General", href: "/settings/general", icon: SlidersHorizontal },
  { label: "Contact", href: "/settings/contact", icon: Phone },
  { label: "Email", href: "/settings/email", icon: Mail },
  { label: "Social", href: "/settings/social", icon: Share2 },
  { label: "Security", href: "/settings/security", icon: Shield },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex w-52 shrink-0 flex-col gap-1 border-r border-black/10 px-4 py-2">
      <h2 className="px-2 pb-4 text-xl font-bold text-black">Settings</h2>
      {settingsNavItems.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors",
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
