"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar, MobileHeader } from "@/components/Sidebar";
import { ConditionalTopbar } from "@/components/ConditionalTopbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

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

  // The content area scrolls independently (overflow-y-auto) instead of the
  // whole page, so Next.js's built-in "scroll to top on navigation" doesn't
  // reach it. Reset it manually whenever the route changes.
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div ref={scrollRef} className="flex flex-1 flex-col overflow-y-auto">
        <MobileHeader isOpen={isOpen} onToggle={() => setIsOpen((v) => !v)} />
        <ConditionalTopbar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}