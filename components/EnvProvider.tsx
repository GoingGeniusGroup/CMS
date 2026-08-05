"use client";

import { createContext, useContext } from "react";

const EnvContext = createContext<{ siteUrl: string }>({ siteUrl: "/" });

export function EnvProvider({ siteUrl, children }: { siteUrl: string; children: React.ReactNode }) {
  return <EnvContext.Provider value={{ siteUrl }}>{children}</EnvContext.Provider>;
}

export function useSiteUrl() {
  return useContext(EnvContext).siteUrl;
}