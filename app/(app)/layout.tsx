"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar, MobileHeader } from "@/components/Sidebar";
import { ConfigProvider } from "@/components/ConfigProvider";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

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
    <ConfigProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <div ref={scrollRef} className="flex-1 overflow-y-auto bg-[#f5f3f3]">
          <MobileHeader isOpen={isOpen} onToggle={() => setIsOpen((v) => !v)} />
          <main className="p-4 pb-8 sm:p-6 sm:pb-10 lg:p-8 lg:pb-10">{children}</main>
        </div>
      </div>
    </ConfigProvider>
  );
}
