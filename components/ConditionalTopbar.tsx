"use client";

import { usePathname } from "next/navigation";
import { Topbar } from "@/components/PageHeader";

export function ConditionalTopbar() {
  const pathname = usePathname();

  if (pathname.startsWith("/settings")) {
    return null;
  }

  return <Topbar />;
}
