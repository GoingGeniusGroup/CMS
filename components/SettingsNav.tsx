"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import {
  Cookie,
  LayoutTemplate,
  Mail,
  Paintbrush,
  Phone,
  Search,
  Share2,
  Shield,
  SlidersHorizontal,
  ChevronRight,
  Type,
  ListChecks,
  GitBranch,
  Building2,
  Tags,
  FileJson,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const settingsNavItems = [
  { label: "General", href: "/settings/general", icon: SlidersHorizontal },
  { label: "Labels", href: "/settings/labels", icon: Type },
  { label: "Custom Fields", href: "/settings/custom-fields", icon: ListChecks },
  { label: "Status Workflows", href: "/settings/status", icon: GitBranch },
  { label: "Departments", href: "/settings/departments", icon: Building2 },
  { label: "Tags", href: "/settings/tags", icon: Tags },
  { label: "Import / Export", href: "/settings/import-export", icon: FileJson },
  { label: "Contact", href: "/settings/contact", icon: Phone },
  { label: "Email", href: "/settings/email", icon: Mail },
  { label: "Social", href: "/settings/social", icon: Share2 },
  { label: "Security", href: "/settings/security", icon: Shield },
  { label: "Appearance", href: "/settings/appearance", icon: Paintbrush },
  { label: "SEO", href: "/settings/seo", icon: Search },
  { label: "Popup", href: "/settings/popup", icon: LayoutTemplate },
  { label: "Cookies", href: "/settings/cookies", icon: Cookie },
];

export function SettingsNav() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    function checkScroll() {
      const el = scrollRef.current;
      if (el) {
        setCanScrollRight(el.scrollWidth > el.clientWidth && el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
      }
    }
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  function scrollRight() {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <nav
        ref={scrollRef}
        className="flex w-full shrink-0 flex-row gap-1 overflow-x-auto pb-2 scrollbar-hide md:w-52 md:flex-col md:overflow-visible md:border-r md:px-4 md:py-2 md:pb-0"
      >
        <h2 className="hidden px-2 pb-4 text-xl font-bold text-black md:block">
          Settings
        </h2>
        {settingsNavItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-2 px-3 py-2 text-sm font-medium transition-colors md:gap-3 md:px-2",
                active
                  ? "text-amber-500 border-b-2 border-amber-500 md:border-b-0 md:border-l-2 md:border-amber-500"
                  : "text-zinc-600 hover:bg-black/5 hover:text-black rounded-lg",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      {canScrollRight && (
        <button
          type="button"
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md border border-zinc-200 text-zinc-500 hover:text-zinc-800 md:hidden"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
