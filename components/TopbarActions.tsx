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
      className={`relative flex h-10 w-10 items-center justify-center rounded-xl shadow-md transition-colors sm:h-[55px] sm:w-[55px] sm:rounded-2xl ${
        variant === "accent"
          ? "bg-red-50 text-red-400 hover:bg-red-100"
          : "bg-sky-50 text-sky-500 hover:bg-sky-100"
      }`}
    >
      {children}
      {badge ? (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-0.5 text-[9px] font-semibold text-white sm:h-5 sm:min-w-5 sm:px-1 sm:text-[10px]">
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
      <div className="flex shrink-0 items-center gap-2 sm:gap-[19px]">
        <IconButton badge={20}>
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
        </IconButton>
        <IconButton badge={40}>
          <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
        </IconButton>
        <IconButton variant="accent">
          <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
        </IconButton>
      </div>

      {/* Greeting + logo */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <p className="hidden text-sm text-zinc-600 sm:block">
          Hello,{" "}
          <span className="font-semibold text-zinc-900">Admin</span>
        </p>
        <Image
          src="/logo.png"
          alt="Logo"
          width={55}
          height={55}
          className="h-10 w-10 rounded-full object-cover sm:h-[55px] sm:w-[55px]"
        />
      </div>
    </>
  );
}
