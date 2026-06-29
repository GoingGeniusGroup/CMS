"use client";

import { Bell, MessageSquare, Search, Settings } from "lucide-react";

export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-1">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
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
      className={`relative flex h-11 w-11 items-center justify-center rounded-2xl shadow-md transition-colors ${
        variant === "accent"
          ? "bg-red-50 text-red-400 hover:bg-red-100"
          : "bg-white text-sky-400 hover:bg-sky-50 dark:bg-white/5"
      }`}
    >
      {children}
      {badge ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1 text-[10px] font-semibold text-white">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

export function Topbar() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center gap-4 px-6 py-4 md:gap-8 lg:gap-12 xl:gap-16">
      {/* Search */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search here"
          className="h-10 w-full rounded-lg bg-white pl-5 pr-12 text-sm text-zinc-700 shadow-md outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-200 dark:bg-white/5 dark:text-zinc-200"
        />
        <Search className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
      </div>

      {/* Action icons */}
      <div className="flex shrink-0 items-center gap-3">
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
<<<<<<< HEAD
      <div className="flex shrink-0 items-center gap-4">
        <p className="hidden text-sm text-zinc-600 sm:block dark:text-zinc-300">
          Hello, <span className="font-semibold text-zinc-900 dark:text-white">Admin</span>
=======
      <div className="ml-auto flex items-center gap-6">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Hello, <span className="font-semibold dark:text-white">Admin</span>
>>>>>>> 96bc35a (Topbar and teams page)
        </p>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold uppercase tracking-wide text-white">
          Logo
        </div>
      </div>
    </header>
  );
}
