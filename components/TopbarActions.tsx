"use client";

import { Bell, MessageSquare, Settings } from "lucide-react";
import Image from "next/image";

function IconButton({
  children,
  badge,
  variant = "default",
}: {
  children: React.ReactNode;
  badge?: number;
  variant?: "default" | "accent";
}) {
  return (
    <button
      type="button"
      className={`relative flex h-[55px] w-[55px] items-center justify-center rounded-2xl shadow-md transition-colors ${
        variant === "accent"
          ? "bg-red-50 text-red-400 hover:bg-red-100"
          : "bg-sky-50 text-sky-500 hover:bg-sky-100"
      }`}
    >
      {children}
      {badge ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-semibold text-white">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

/**
 * The notification / message / settings buttons plus the greeting and logo.
 * Always shown in the topbar — with or without the search bar.
 */
export function TopbarActions() {
  return (
    <>
      {/* Action icons */}
      <div className="flex shrink-0 items-center gap-[19px]">
        <IconButton badge={20}>
          <Bell className="h-5 w-5" />
        </IconButton>
        <IconButton badge={40}>
          <MessageSquare className="h-5 w-5" />
        </IconButton>
        <IconButton variant="accent">
          <Settings className="h-5 w-5" />
        </IconButton>
      </div>

      {/* Greeting + logo */}
      <div className="flex shrink-0 items-center gap-3">
        <p className="hidden text-sm text-zinc-600 sm:block">
          Hello,{" "}
          <span className="font-semibold text-zinc-900">
            Admin
          </span>
        </p>
        <Image
          src="/logo.png"
          alt="Logo"
          width={55}
          height={55}
          className="h-[55px] w-[55px] rounded-full object-cover"
        />
      </div>
    </>
  );
}
