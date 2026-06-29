"use client";

import { Bell, MessageSquare, Search, Settings } from "lucide-react";
import Image from "next/image";

export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-1">
      <h1 className="text-2xl font-semibold tracking-tight text-black">{title}</h1>
      {description ? (
        <p className="text-sm text-black">{description}</p>
      ) : null}
    </div>
  );
}

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
          : "bg-sky-50 text-sky-500 hover:bg-sky-100 dark:bg-white/5"
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

export function Topbar() {
  return (
    <header className="mx-auto flex w-full max-w-[1490px] items-center justify-between gap-6 px-6 pb-2 pt-6">
      {/* Search — wide, sits left */}
      <div className="relative -ml-9 h-14 w-full min-w-0 max-w-[866px] flex-1">
        <input
          type="text"
          placeholder="Search here"
          className="h-full w-full rounded-lg bg-white pl-5 pr-12 text-sm text-zinc-700 shadow-md outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-200 dark:bg-white/5 dark:text-zinc-200"
        />
        <Search className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
      </div>

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

      {/* Greeting + logo — far right */}
      <div className="-mr-6 flex shrink-0 items-center gap-3">
        <p className="hidden text-sm text-zinc-600 sm:block dark:text-zinc-300">
          Hello, <span className="font-semibold text-zinc-900 dark:text-white">Admin</span>
        </p>
        <Image
          src="/logo.png"
          alt="Logo"
          width={55}
          height={55}
          className="h-[55px] w-[55px] rounded-full object-cover"
        />
      </div>
    </header>
  );
}
