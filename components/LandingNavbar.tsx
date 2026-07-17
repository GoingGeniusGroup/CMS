"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { images } from "@/lib/images";

type SubMenuItem = { label: string; path: string };
type MenuItem = { label: string; path: string; children?: SubMenuItem[] };

type LandingNavbarProps = {
  logoUrl?: string;
  siteName?: string;
  menuItems?: MenuItem[];
};

// Use menuItems from DB; fallback to these if none provided
const fallbackLinks: MenuItem[] = [
  { label: "Home", path: "/home" },
  { label: "Services", path: "/our-services" },
  {
    label: "Work",
    path: "/our-projects",
    children: [
      { label: "Projects", path: "/our-projects" },
      { label: "Blogs", path: "/blogs" },
    ],
  },
  {
    label: "Company",
    path: "/company",
    children: [
      { label: "About Us", path: "/about-us" },
      { label: "Company", path: "/company" },
      { label: "Our Team", path: "/teams" },
      { label: "Careers", path: "/career" },
    ],
  },
  { label: "Contact", path: "/contact" },
];

/** Check if a nav item (or any of its children) matches the current path */
function isActive(item: MenuItem, pathname: string): boolean {
  if (pathname === item.path) return true;
  if (item.children?.some((c) => pathname === c.path)) return true;
  // Prefix match for nested pages (e.g. /blogs/slug matches /blogs)
  if (pathname.startsWith(item.path + "/")) return true;
  if (item.children?.some((c) => pathname.startsWith(c.path + "/"))) return true;
  return false;
}

export function LandingNavbar({ logoUrl, siteName = "Going Genius", menuItems = [] }: LandingNavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mobileOpenIndex, setMobileOpenIndex] = useState<number | null>(null);

  const resolvedLogo = logoUrl || images.logo1;
  const navItems = menuItems.length > 0 ? menuItems : fallbackLinks;

  return (
    <header className="z-50 border-b border-zinc-200 bg-white/95 backdrop-blur shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/home" className="flex items-center gap-2">
          <Image
            src={resolvedLogo}
            alt={siteName}
            width={120}
            height={40}
            className="h-10 w-auto max-w-[120px] object-contain"
            unoptimized
          />
          <span className="text-sm font-bold text-zinc-900">{siteName}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item, index) => {
            const active = isActive(item, pathname);
            return item.children && item.children.length > 0 ? (
              <div
                key={`${item.label}-${index}`}
                className="relative"
                onMouseEnter={() => setOpenIndex(index)}
                onMouseLeave={() => setOpenIndex((cur) => (cur === index ? null : cur))}
              >
                <a
                  href={item.path}
                  className={`relative flex items-center gap-1 pb-1 text-sm font-medium transition-colors ${
                    active
                      ? "text-[var(--theme-color,#6366f1)]"
                      : "text-zinc-600 hover:text-[var(--theme-color,#6366f1)]"
                  }`}
                >
                  {item.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""}`} />
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[var(--theme-color,#6366f1)]" />
                  )}
                </a>

                {/* Dropdown */}
                <div className={`absolute left-1/2 top-full pt-4 -translate-x-1/2 transition-all duration-200 ease-out ${openIndex === index ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
                  <div className="min-w-[220px] rounded-xl border border-zinc-100 bg-white p-2 shadow-2xl shadow-zinc-200/60">
                    <ul className="space-y-0.5">
                      {item.children.map((sub) => (
                        <li key={`${sub.label}-${sub.path}`}>
                          <a
                            href={sub.path}
                            className={`block rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                              pathname === sub.path
                                ? "bg-[var(--theme-color,#6366f1)]/10 text-[var(--theme-color,#6366f1)]"
                                : "text-zinc-600 hover:bg-zinc-100 hover:text-[var(--theme-color,#6366f1)]"
                            }`}
                          >
                            {sub.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={`${item.label}-${index}`}
                href={item.path}
                className={`relative pb-1 flex items-center gap-1 text-sm font-medium transition-colors ${
                  active
                    ? "text-[var(--theme-color,#6366f1)]"
                    : "text-zinc-600 hover:text-[var(--theme-color,#6366f1)]"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[var(--theme-color,#6366f1)]" />
                )}
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-indigo-600"
          >
            Admin Login
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            Get in Touch
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="ml-3 inline-flex items-center rounded-md p-2 text-zinc-600 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-100 bg-white/95">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="space-y-1">
              {navItems.map((item, index) => {
                const active = isActive(item, pathname);
                return item.children && item.children.length > 0 ? (
                  <div key={`${item.label}-${index}`}>
                    <button
                      type="button"
                      onClick={() =>
                        setMobileOpenIndex((cur) => (cur === index ? null : index))
                      }
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium transition-colors ${
                        active
                          ? "text-[var(--theme-color,#6366f1)] bg-[var(--theme-color,#6366f1)]/5"
                          : "text-zinc-700 hover:bg-zinc-50 hover:text-[var(--theme-color,#6366f1)]"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${mobileOpenIndex === index ? "rotate-180" : ""}`}
                      />
                    </button>
                    {mobileOpenIndex === index && (
                      <div className="ml-3 border-l border-zinc-100 pl-3 py-1 space-y-1">
                        {item.children.map((sub) => (
                          <a
                            key={`${sub.label}-${sub.path}`}
                            href={sub.path}
                            className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                              pathname === sub.path
                                ? "text-[var(--theme-color,#6366f1)]"
                                : "text-zinc-600 hover:bg-zinc-50 hover:text-[var(--theme-color,#6366f1)]"
                            }`}
                            onClick={() => setMobileOpen(false)}
                          >
                            {sub.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    key={`${item.label}-${index}`}
                    href={item.path}
                    className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                      active
                        ? "text-[var(--theme-color,#6366f1)] bg-[var(--theme-color,#6366f1)]/5"
                        : "text-zinc-700 hover:bg-zinc-50 hover:text-[var(--theme-color,#6366f1)]"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                );
              })}
              <Link
                href="/login"
                className="block rounded-md px-3 py-2 text-base font-medium text-zinc-700 hover:bg-zinc-50"
                onClick={() => setMobileOpen(false)}
              >
                Admin Login
              </Link>
              <a
                href="#contact"
                className="mt-2 inline-block w-full rounded-full bg-indigo-600 px-5 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                onClick={() => setMobileOpen(false)}
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
