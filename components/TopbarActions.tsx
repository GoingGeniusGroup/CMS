"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Globe, Settings } from "lucide-react";
import Image from "next/image";
import { useSiteUrl } from "@/components/EnvProvider";

function IconButton({
  children,
  badge,
  variant = "default",
  onClick,
}: {
  children: React.ReactNode;
  badge?: number;
  variant?: "default" | "accent";
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
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

export function TopbarActions() {
  const siteUrl = useSiteUrl();
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <>
      {/* Action icons */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-[19px]">
        <IconButton badge={20} onClick={() => setToast("Coming soon")}>
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
        </IconButton>
        <IconButton onClick={() => window.open(siteUrl, "_blank", "noopener,noreferrer")}>
          <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
        </IconButton>
        <IconButton variant="accent" onClick={() => router.push("/settings/general")}>
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

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}
