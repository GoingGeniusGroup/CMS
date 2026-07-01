"use client";

import { useSession } from "next-auth/react";
import { User, Crown } from "lucide-react";

export function UserProfile() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const isAdmin = session.user.role === "admin";

  return (
    <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8821a]/20">
          {isAdmin ? (
            <Crown className="h-5 w-5 text-[#f0b90b]" />
          ) : (
            <User className="h-5 w-5 text-white" />
          )}
        </div>
        <div className="flex-1 overflow-hidden">
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
