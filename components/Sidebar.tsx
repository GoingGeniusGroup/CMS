"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  UserSquare2,
  Folder,
  Contact,
  Layers,
  BarChart2,
  FileText,
  Newspaper,
  Settings,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

export const navItems: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Customer", href: "/customer", icon: UserSquare2 },
  { label: "Projects", href: "/projects", icon: Folder },
  { label: "Team", href: "/team", icon: Contact },
  { label: "Services", href: "/services", icon: Layers },
  { label: "Analytics", href: "/analytics", icon: BarChart2 },
  { label: "Invoices", href: "/invoices", icon: FileText },
  { label: "Blog", href: "/blog", icon: Newspaper },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const mainItems = navItems.slice(0, -1);
  const settingsItem = navItems[navItems.length - 1];

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Allow closing the drawer with Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      {/* Mobile top bar — visible below md breakpoint only */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#0a0a0b] px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Going Genius logo"
            width={32}
            height={36}
            className="h-9 w-8 object-contain"
            priority
          />
          <span className="text-sm font-bold text-white">
            Going <span className="text-[#f0b90b]">Genius</span>
          </span>
        </div>
        <button
          type="button"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="primary-sidebar"
          onClick={() => setIsOpen((v) => !v)}
          className="rounded-md p-2 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8821a]"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Backdrop, mobile only, shown while drawer is open */}
      <div
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {/* Sidebar / mobile drawer */}
      <aside
        id="primary-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-72 max-w-[85vw] shrink-0 flex-col justify-between overflow-y-auto bg-[#0a0a0b] px-5 py-6 transition-transform duration-300 ease-in-out",
          "md:static md:z-auto md:w-64 md:max-w-none md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          {/* Logo — shown here on desktop; mobile already shows it in the top bar */}
          <div className="hidden items-center gap-3 px-1 md:flex">
            <Image
              src="/logo2.png"
              alt="Going Genius logo"
              width={40}
              height={44}
              className="h-11 w-10 object-contain"
              priority
            />
            <div className="leading-tight">
              <p className="text-[15px] font-bold text-white">
                Going <span className="text-[#f0b90b]">Genius</span>
              </p>
              <p className="text-[11px] font-medium text-white">
                Group of <span className="text-[#f0b90b]">Companies</span>
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="mt-2 flex flex-col gap-1 md:mt-10" aria-label="Primary">
            {mainItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-4 rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8821a]",
                    active
                      ? "font-semibold text-[#e8821a]"
                      : "text-white hover:text-[#e8821a]/80"
                  )}
                >
                  <Icon
                    size={19}
                    strokeWidth={2}
                    className={active ? "text-[#e8821a]" : "text-white"}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Settings, pinned to bottom */}
        <Link
          href={settingsItem.href}
          aria-current={pathname === settingsItem.href ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8821a]",
            pathname === settingsItem.href
              ? "text-[#e8821a]"
              : "text-zinc-400 hover:text-white"
          )}
        >
          <Settings size={18} />
          Settings
        </Link>
      </aside>
    </>
  );
}