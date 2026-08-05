"use client";

import { useSession } from "next-auth/react";
import { User, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserProfile({ collapsed = false }: { collapsed?: boolean }) {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const isAdmin = session.user.role === "admin";

  return (
    <div
      className={cn(
        "mb-6 rounded-lg border border-white/10 bg-white/5 p-3",
        collapsed && "p-2"
      )}
    >
      <div className={cn("flex items-center gap-3", collapsed && "justify-center md:gap-0")}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8821a]/20">
          {isAdmin ? (
            <Crown className="h-5 w-5 text-[#f0b90b]" />
          ) : (
            <User className="h-5 w-5 text-white" />
          )}
        </div>
        <div
          className={cn(
            "flex-1 overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out",
            collapsed ? "md:max-w-0 md:opacity-0" : "max-w-[200px] opacity-100"
          )}
        >
          <p className="truncate text-sm font-semibold text-white">
            {session.user.name || "User"}
          </p>
          <p className="truncate text-xs text-zinc-400">
            {session.user.email}
          </p>
          {isAdmin && (
            <span className="mt-1 inline-block rounded-full bg-[#f0b90b]/20 px-2 py-0.5 text-[10px] font-medium text-[#f0b90b]">
              Administrator
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
