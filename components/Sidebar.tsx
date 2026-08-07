"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/components/UserProfile";
import { signOut } from "next-auth/react";
import { useConfig } from "@/components/ConfigProvider";
import { ThemeSelector } from "@/components/ThemeSelector";

import {
  Home,
  UserSquare2,
  Folder,
  Contact,
  Layers,
  Briefcase,
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
  Tag,
  Handshake,
  Cpu,
  HelpCircle,
  LayoutTemplate,
  PanelLeftClose,
  PanelLeftOpen,
  Inbox,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  id?: string;
  label?: string;
  labelKey?: string;
  href: string;
  icon: LucideIcon;
  children?: { id?: string; label?: string; labelKey?: string; href: string; icon: LucideIcon }[];
};

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: Home },
  { labelKey: "customer", href: "/customer", icon: UserSquare2 },
  { labelKey: "project", href: "/projects", icon: Folder },
  { labelKey: "lead", href: "/leads", icon: Inbox },
  { labelKey: "team", href: "/team", icon: Contact },
  { labelKey: "service", href: "/services", icon: Layers },
  { labelKey: "job", href: "/careers", icon: Briefcase },
  { id: "analytics", label: "Analytics", href: "/analytics", icon: BarChart2 },
  { labelKey: "invoice", href: "/invoices", icon: FileText },
  { labelKey: "blog", href: "/blog", icon: Newspaper },
  { labelKey: "page", href: "/pages", icon: FilePlus2 },
  { labelKey: "category", href: "/category", icon: Tag },
  {
    id: "website-setup",
    label: "Website Setup",
    href: "/website-setup",
    icon: Globe,
    children: [
      { id: "landing-page", label: "Landing Page", href: "/website-setup/landing-page", icon: LayoutTemplate },
      { id: "website-header", label: "Website Header", href: "/website-setup/header", icon: Globe },
      { id: "footer-widgets", label: "Footer Widgets", href: "/website-setup/footer-widgets", icon: LayoutPanelTop },
      { id: "partners", label: "Our Partners", href: "/website-setup/partners", icon: Handshake },
      { id: "technologies", label: "Logo Showcase", href: "/website-setup/technologies", icon: Cpu },
      { labelKey: "faq", href: "/website-setup/faq", icon: HelpCircle },
      { id: "add-new-page", label: "Add New Page", href: "/website-setup/add-newpage", icon: FilePlus2 },
    ],
  },
  { label: "Settings", href: "/settings", icon: Settings },
];

/**
 * Mobile top bar—logo + hamburger toggle.
 */
export function MobileHeader({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3 md:hidden">
      <div className="flex items-center gap-2">
        <Image
          src="/logo2.png"
          alt="Going Genius logo"
          width={32}
          height={36}
          className="h-9 w-8 object-contain"
          priority
        />
        <span className="text-sm font-bold text-[var(--color-text)]">
          Going <span className="text-[#f0b90b]">Genius</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeSelector compact />
        <button
          type="button"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="primary-sidebar"
          onClick={onToggle}
          className="rounded-md p-2 text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-sunken)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
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
  collapsed = false,
  onToggleCollapsed,
}: {
  isOpen: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}) {
  const pathname = usePathname();
  const { labels, disabledNavIds } = useConfig();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const mainItems = navItems.slice(0, -1);
  const settingsItem = navItems[navItems.length - 1];

  const navItemId = (item: { id?: string; labelKey?: string; href: string }) =>
    item.id ?? item.labelKey ?? item.href;
  const isNavEnabled = (item: { id?: string; labelKey?: string; href: string }) =>
    !disabledNavIds.includes(navItemId(item));

  const resolveLabel = (item: { label?: string; labelKey?: string }) => {
    if (item.labelKey) {
      const entry = labels[item.labelKey];
      if (entry) return entry.plural ?? entry.singular;
      return item.labelKey;
    }
    return item.label ?? "";
  };

  const toggleMenu = (href: string) => {
    setOpenMenus((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: `${window.location.origin}/login`, redirect: true });
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
          "md:static md:z-auto md:h-screen md:max-w-none md:translate-x-0 md:transition-[width,transform] md:duration-300 md:ease-in-out",
          collapsed ? "md:w-[4.75rem] md:px-2" : "md:w-64",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          {/* Logo + collapse toggle — desktop only */}
          <div className="hidden items-center gap-3 px-1 md:flex">
            {!collapsed && (
              <>
                <Image
                  src="/logo2.png"
                  alt="Going Genius logo"
                  width={40}
                  height={44}
                  className="h-11 w-10 shrink-0 object-contain"
                  priority
                />
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="truncate text-[15px] font-bold text-white">
                    Going <span className="text-[#f0b90b]">Genius</span>
                  </p>
                  <p className="truncate text-[11px] font-medium text-white">
                    Group of <span className="text-[#f0b90b]">Companies</span>
                  </p>
                </div>
              </>
            )}
            <button
              type="button"
              onClick={onToggleCollapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8821a]",
                collapsed ? "mx-auto" : "ml-auto"
              )}
            >
              {collapsed ? (
                <PanelLeftOpen size={18} />
              ) : (
                <PanelLeftClose size={18} />
              )}
            </button>
          </div>

          {/* User Profile */}
          <div className="mt-4 md:mt-5">
            <UserProfile collapsed={collapsed} />
          </div>

          {/* Nav */}
          <nav className="mt-2 flex flex-col gap-1" aria-label="Primary">
            {mainItems.map((item) => {
              if (!isNavEnabled(item)) return null;

              if (item.children && item.children.length > 0) {
                const visibleChildren = item.children.filter(isNavEnabled);
                if (visibleChildren.length === 0) return null;

                const childActive = visibleChildren.some(
                  (child) => pathname === child.href
                );
                const isMenuOpen = openMenus[item.href] ?? childActive;
                const Icon = item.icon;
                const groupLabel = resolveLabel(item);

                return (
                  <div
                    key={item.href}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (collapsed) onToggleCollapsed?.();
                        toggleMenu(item.href);
                      }}
                      aria-expanded={isMenuOpen}
                      title={collapsed ? groupLabel : undefined}
                      className={cn(
                        "flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8821a]",
                        collapsed && "md:justify-center md:px-2",
                        childActive
                          ? "font-semibold text-[#e8821a]"
                          : "text-white hover:text-[#e8821a]/80"
                      )}
                    >
                      <span className={cn("flex items-center gap-4", collapsed && "md:gap-0")}>
                        <Icon
                          size={19}
                          strokeWidth={2}
                          className={childActive ? "text-[#e8821a]" : "text-white"}
                        />
                        <span
                          className={cn(
                            "whitespace-nowrap overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out",
                            collapsed ? "md:max-w-0 md:opacity-0" : "max-w-56 opacity-100"
                          )}
                        >
                          {groupLabel}
                        </span>
                      </span>
                      {!collapsed && (
                        <ChevronDown
                          size={16}
                          strokeWidth={2}
                          className={cn(
                            "shrink-0 transition-transform duration-200",
                            isMenuOpen ? "rotate-180" : "rotate-0",
                            childActive ? "text-[#e8821a]" : "text-white"
                          )}
                        />
                      )}
                    </button>

                    {!collapsed && (
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
                            {visibleChildren.map((child) => {
                              const active = pathname === child.href;
                              const ChildIcon = child.icon;
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={onClose}
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
                                  {resolveLabel(child)}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              const active = pathname === item.href;
              const Icon = item.icon;
              const linkLabel = resolveLabel(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  title={collapsed ? linkLabel : undefined}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-4 rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-color,#e8821a)]",
                    collapsed && "md:justify-center md:px-2",
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
                  <span
                    className={cn(
                      "whitespace-nowrap overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out",
                      collapsed ? "md:max-w-0 md:opacity-0" : "max-w-56 opacity-100"
                    )}
                  >
                    {linkLabel}
                  </span>
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
            title={collapsed ? "Settings" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8821a]",
              collapsed && "md:justify-center md:px-2",
              pathname === settingsItem.href
                ? "text-[#e8821a]"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <Settings size={18} />
            <span
              className={cn(
                "whitespace-nowrap overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out",
                collapsed ? "md:max-w-0 md:opacity-0" : "max-w-40 opacity-100"
              )}
            >
              Settings
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            title={collapsed ? "Logout" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-red-400 transition-colors hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500",
              collapsed && "md:justify-center md:px-2"
            )}
          >
            <LogOut size={18} />
            <span
              className={cn(
                "whitespace-nowrap overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out",
                collapsed ? "md:max-w-0 md:opacity-0" : "max-w-40 opacity-100"
              )}
            >
              Logout
            </span>
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
