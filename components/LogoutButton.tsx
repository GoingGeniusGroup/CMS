"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function LogoutButton({ className = "" }: { className?: string }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({
        callbackUrl: "/login",
        redirect: true
      });
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`flex items-center gap-3 px-3 py-2.5 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8821a] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <LogOut size={18} className={isLoggingOut ? "animate-spin" : ""} />
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  );
}
