"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

type ModuleVisibilityContextValue = {
  disabled: string[];
};

const ModuleVisibilityContext = createContext<ModuleVisibilityContextValue>({
  disabled: [],
});

/**
 * Provides the admin's sidebar-module visibility config to the public site.
 * `initialDisabled` is fetched server-side in the (user) layout, so sections
 * render hidden from the first paint — no flash, no client refetch needed.
 */
export function PublicModuleVisibilityProvider({
  initialDisabled,
  children,
}: {
  initialDisabled: string[];
  children: ReactNode;
}) {
  const value = useMemo(() => ({ disabled: initialDisabled }), [initialDisabled]);
  return (
    <ModuleVisibilityContext.Provider value={value}>
      {children}
    </ModuleVisibilityContext.Provider>
  );
}

export function useModuleDisabled(id: string): boolean {
  const ctx = useContext(ModuleVisibilityContext);
  return ctx.disabled.includes(id);
}
