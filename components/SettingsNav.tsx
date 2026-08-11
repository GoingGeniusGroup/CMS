"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import {
  Bell,
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
  FileJson,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Shapes,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const settingsNavItems = [
  { label: "General", href: "/settings/general", icon: SlidersHorizontal },
  { label: "Labels", href: "/settings/labels", icon: Type },
  { label: "Custom Fields", href: "/settings/custom-fields", icon: ListChecks },
  { label: "Status Workflows", href: "/settings/status", icon: GitBranch },
  { label: "Sidebar Modules", href: "/settings/navigation", icon: PanelLeft },
  { label: "Departments", href: "/settings/departments", icon: Building2 },
  { label: "Icons", href: "/settings/icons", icon: Shapes },
  { label: "Import / Export", href: "/settings/import-export", icon: FileJson },
  { label: "Contact", href: "/settings/contact", icon: Phone },
  { label: "Email", href: "/settings/email", icon: Mail },
  { label: "Social", href: "/settings/social", icon: Share2 },
  { label: "Security", href: "/settings/security", icon: Shield },
  { label: "Appearance", href: "/settings/appearance", icon: Paintbrush },
  { label: "SEO", href: "/settings/seo", icon: Search },
  { label: "Popup", href: "/settings/popup", icon: LayoutTemplate },
  { label: "Cookies", href: "/settings/cookies", icon: Cookie },
  { label: "Notifications", href: "/settings/notifications", icon: Bell },
];

export function SettingsNav() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  // Persisted collapse preference for the settings sidebar (desktop).
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("gg-settings-nav-collapsed") === "1";
  });

  useEffect(() => {
    window.localStorage.setItem("gg-settings-nav-collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

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
      {/* Desktop header row: heading + collapse toggle */}
      <div className="hidden items-center justify-between md:flex">
        {!collapsed && (
          <h2 className="px-2 py-1 text-xl font-bold text-black">Settings</h2>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand settings menu" : "Collapse settings menu"}
          title={collapsed ? "Expand settings menu" : "Collapse settings menu"}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-black/5 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav
        ref={scrollRef}
        className={cn(
          "flex w-full shrink-0 flex-row gap-1 overflow-x-auto pb-2 scrollbar-hide md:flex-col md:overflow-visible md:border-r md:px-4 md:py-2 md:pb-0 md:transition-[width] md:duration-300 md:ease-in-out",
          collapsed ? "md:w-16 md:px-1" : "md:w-52"
        )}
      >
        {settingsNavItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2 px-3 py-2 text-sm font-medium transition-colors md:gap-3 md:px-2",
                collapsed && "md:justify-center md:gap-0 md:px-0",
                active
                  ? "text-amber-500 border-b-2 border-amber-500 md:border-b-0 md:border-l-2 md:border-amber-500"
                  : "text-zinc-600 hover:bg-black/5 hover:text-black rounded-lg",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out",
                  collapsed ? "md:max-w-0 md:opacity-0" : "max-w-40 opacity-100"
                )}
              >
                {item.label}
              </span>
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
