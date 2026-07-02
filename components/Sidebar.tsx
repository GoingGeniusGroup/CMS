"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/components/UserProfile";
import { signOut } from "next-auth/react";

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
  ChevronDown,
  Globe,
  LayoutPanelTop,
  FilePlus2,
  LogOut,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: { label: string; href: string; icon: LucideIcon }[];
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Customer", href: "/customer", icon: UserSquare2 },
  { label: "Projects", href: "/projects", icon: Folder },
  { label: "Team", href: "/team", icon: Contact },
  { label: "Services", href: "/services", icon: Layers },
  { label: "Analytics", href: "/analytics", icon: BarChart2 },
  { label: "Invoices", href: "/invoices", icon: FileText },
  { label: "Blog", href: "/blog", icon: Newspaper },
  {
    label: "Website Setup",
    href: "/website-setup",
    icon: Globe,
    children: [
      { label: "Website Header", href: "/website-setup/header", icon: Globe },
      { label: "Footer Widgets", href: "/website-setup/footer-widgets", icon: LayoutPanelTop },
      { label: "Add New Page", href: "/website-setup/add-page", icon: FilePlus2 },
    ],
  },
  { label: "Settings", href: "/settings", icon: Settings },
];

/**
 * Mobile top bar — logo + hamburger toggle.
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
 * Logout confirmation modal.
 */
function LogoutConfirmModal({
  open,
  onCancel,
  onConfirm,
  isLoggingOut,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isLoggingOut: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-gray-900">Confirm Logout</h3>
        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to log out? You will need to sign in again to access the dashboard.
        </p>
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoggingOut}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Sidebar with user profile and logout.
 */
export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const mainItems = navItems.slice(0, -1);
  const settingsItem = navItems[navItems.length - 1];

  const toggleMenu = (href: string) => {
    setOpenMenus((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  const openMenu = (href: string) => {
    setOpenMenus((prev) => (prev[href] ? prev : { ...prev, [href]: true }));
  };

  const closeMenu = (href: string) => {
    setOpenMenus((prev) => (prev[href] ? { ...prev, [href]: false } : prev));
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: "/login", redirect: true });
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  return (
    <>
      {/* Backdrop, mobile only */}
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
          {/* Logo — desktop only */}
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
          <div className="mt-4 md:mt-5">
            <UserProfile />
          </div>

          {/* Nav */}
          <nav className="mt-2 flex flex-col gap-1" aria-label="Primary">
            {mainItems.map((item) => {
              const Icon = item.icon;

              if (item.children && item.children.length > 0) {
                const childActive = item.children.some(
                  (child) => pathname === child.href
                );
                const isMenuOpen = openMenus[item.href] ?? childActive;

                return (
                  <div
                    key={item.href}
                    onMouseEnter={() => openMenu(item.href)}
                    onMouseLeave={() => closeMenu(item.href)}
                  >
                    <button
                      type="button"
                      onClick={() => toggleMenu(item.href)}
                      aria-expanded={isMenuOpen}
                      className={cn(
                        "flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8821a]",
                        childActive
                          ? "font-semibold text-[#e8821a]"
                          : "text-white hover:text-[#e8821a]/80"
                      )}
                    >
                      <span className="flex items-center gap-4">
                        <Icon
                          size={19}
                          strokeWidth={2}
                          className={childActive ? "text-[#e8821a]" : "text-white"}
                        />
                        {item.label}
                      </span>
                      <ChevronDown
                        size={16}
                        strokeWidth={2}
                        className={cn(
                          "shrink-0 transition-transform duration-200",
                          isMenuOpen ? "rotate-180" : "rotate-0",
                          childActive ? "text-[#e8821a]" : "text-white"
                        )}
                      />
                    </button>

                    <div
                      className={cn(
                        "grid overflow-hidden transition-all duration-200 ease-in-out",
                        isMenuOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="min-h-0">
                        <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-white/10 pl-4">
                          {item.children.map((child) => {
                            const active = pathname === child.href;
                            const ChildIcon = child.icon;
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                  "flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8821a]",
                                  active
                                    ? "font-semibold text-[#e8821a]"
                                    : "text-zinc-400 hover:text-white"
                                )}
                              >
                                <ChildIcon
                                  size={16}
                                  strokeWidth={2}
                                  className={active ? "text-[#e8821a]" : "text-zinc-400"}
                                />
                                {child.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              const active = pathname === item.href;
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

        {/* Bottom section: Settings + Logout */}
        <div className="flex flex-col gap-1 border-t border-white/10 pt-3">
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

          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-red-400 transition-colors hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        open={showLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
}
