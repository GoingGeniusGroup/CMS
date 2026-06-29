"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Customer", href: "/customer" },
  { label: "Projects", href: "/projects" },
  { label: "Team", href: "/team" },
  { label: "Services", href: "/services" },
  { label: "Analytics", href: "/analytics" },
  { label: "Invoices", href: "/invoices" },
  { label: "Blog", href: "/blog" },
  { label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col gap-1 border-r border-black/10 p-4 dark:border-white/10">
      <span className="px-3 pb-4 text-lg font-semibold tracking-tight">CMS</span>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-foreground text-background"
                  : "text-zinc-600 hover:bg-black/5 dark:text-zinc-400 dark:hover:bg-white/5"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
