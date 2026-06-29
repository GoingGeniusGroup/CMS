"use client";

import { Bell, MessageSquare, Settings } from "lucide-react";
import Image from "next/image";
import { SearchBar } from "@/components/SearchBar";

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

export function Topbar({ showSearch = true }: { showSearch?: boolean }) {
  return (
    <header
      className={`mx-auto flex w-full max-w-[1490px] items-center px-6 pb-2 pt-6 ${
        showSearch ? "justify-between gap-6" : "justify-end gap-32"
      }`}
    >
      {/* Search — wide, sits left */}
      {showSearch ? (
        <SearchBar className="-ml-9 h-14 w-full min-w-0 max-w-[866px] flex-1" />
      ) : null}

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
