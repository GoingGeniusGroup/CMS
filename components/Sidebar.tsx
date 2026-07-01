"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/LogoutButton";
import { UserProfile } from "@/components/UserProfile";
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

/**
 * Mobile top bar — logo + hamburger toggle.
 *
 * Rendered INSIDE the main content column (not as a sibling of the
 * sidebar/drawer) so it stacks naturally above the desktop Topbar and
 * page content, in normal document flow — no fixed positioning, no
 * manual top-padding math, no risk of overlap.
 *
 * Open/close state lives in AppLayout and is passed down as props so
 * MobileHeader and Sidebar (rendered in different places) stay in sync.
 */
export function MobileHeader({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-[#0a0a0b] px-4 py-3 md:hidden">
      <div className="flex items-center gap-2">
        <Image
          src="/logo2.png"
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
        onClick={onToggle}
        className="rounded-md p-2 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8821a]"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}

/**
 * Sidebar:
 * - Mobile (< md): an off-canvas drawer (fixed, translated off-screen
 *   until opened) plus its backdrop. Opened via MobileHeader's button.
 * - Desktop (>= md): a normal static flex column beside page content.
 */
export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const mainItems = navItems.slice(0, -1);
  const settingsItem = navItems[navItems.length - 1];

  return (
    <>
      {/* Backdrop, mobile only, shown while drawer is open */}
      <div
        aria-hidden="true"
        onClick={onClose}
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
          "md:static md:z-auto md:h-screen md:w-64 md:max-w-none md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          {/* Logo — shown here on desktop; mobile already shows it in MobileHeader */}
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

          {/* User Profile */}
          <div className="mt-6">
            <UserProfile />
          </div>

          {/* Nav */}
          <nav className="mt-2 flex flex-col gap-1 md:mt-6" aria-label="Primary">
            {mainItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
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

        {/* Settings & Logout, pinned to bottom */}
        <div className="space-y-1">
          <Link
            href={settingsItem.href}
            onClick={onClose}
            aria-current={pathname === settingsItem.href ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8821a]",
              pathname === settingsItem.href
                ? "text-[#e8821a]"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <Settings size={18} />
            Settings
          </Link>

          <LogoutButton className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg" />
        </div>
      </aside>
    </>
  );
}