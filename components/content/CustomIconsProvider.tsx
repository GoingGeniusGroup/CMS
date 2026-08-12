"use client";

import { createContext, useContext } from "react";
import type { CustomIconData } from "@/app/actions/icons";

const CustomIconsContext = createContext<CustomIconData[]>([]);

export function CustomIconsProvider({
  icons,
  children,
}: {
  icons: CustomIconData[];
  children: React.ReactNode;
}) {
  return (
    <CustomIconsContext.Provider value={icons}>
      {children}
    </CustomIconsContext.Provider>
  );
}

export function useCustomIcons(): CustomIconData[] {
  return useContext(CustomIconsContext);
}
