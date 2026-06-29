"use client";

import { usePathname } from "next/navigation";
import { Topbar } from "@/components/PageHeader";

export function ConditionalTopbar() {
  const pathname = usePathname();

  if (pathname.startsWith("/settings")) {
    return null;
  }

  // Routes that show the topbar without the search bar
  const hideSearchRoutes = ["/services"];
  const showSearch = !hideSearchRoutes.some((route) =>
    pathname.startsWith(route)
  );

  return <Topbar showSearch={showSearch} />;
}
