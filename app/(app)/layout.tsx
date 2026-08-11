"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Sidebar, MobileHeader } from "@/components/Sidebar";
import { ConfigProvider } from "@/components/ConfigProvider";
import { ThemeModeProvider } from "@/components/ThemeModeProvider";

const SIDEBAR_KEY = "gg-sidebar-collapsed";

function useSidebarCollapsed() {
  const subscribe = useCallback((onChange: () => void) => {
    const handler = (e: StorageEvent) => {
      if (e.key === SIDEBAR_KEY) onChange();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
  const getSnapshot = useCallback(() => window.localStorage.getItem(SIDEBAR_KEY) === "1", []);
  const getServerSnapshot = useCallback(() => false, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const collapsed = useSidebarCollapsed();

  const setCollapsed = useCallback((next: boolean | ((prev: boolean) => boolean)) => {
    const value = typeof next === "function" ? next(window.localStorage.getItem(SIDEBAR_KEY) === "1") : next;
    window.localStorage.setItem(SIDEBAR_KEY, value ? "1" : "0");
    // Trigger useSyncExternalStore re-read via synthetic storage event
    window.dispatchEvent(new StorageEvent("storage", { key: SIDEBAR_KEY }));
  }, []);

  // Lock html/body scroll — the app uses its own internal scroll container
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.style.overflow = "hidden";
    html.style.height = "100%";
    body.style.overflow = "hidden";
    body.style.height = "100%";
    return () => {
      html.style.overflow = "";
      html.style.height = "";
      body.style.overflow = "";
      body.style.height = "";
    };
  }, []);

  // Allow closing the drawer with Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // The content area scrolls independently (overflow-y-auto) instead of the
  // whole page, so Next.js's built-in "scroll to top on navigation" doesn't
  // reach it. Reset it manually whenever the route changes.
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ThemeModeProvider area="admin">
    <ConfigProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((v) => !v)}
        />
        <div ref={scrollRef} className="flex-1 overflow-y-auto bg-[var(--color-page)] text-[var(--color-text)]">
          <MobileHeader isOpen={isOpen} onToggle={() => setIsOpen((v) => !v)} />
          <main className="p-4 pb-8 sm:p-6 sm:pb-10 lg:p-8 lg:pb-10">{children}</main>
        </div>
      </div>
    </ConfigProvider>
    </ThemeModeProvider>
  );
}
