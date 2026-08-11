"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";
export type ThemeArea = "client" | "admin";

export const THEME_PREFERENCE_STORAGE_KEY = "cms-theme-preference";
export const CLIENT_THEME_PREFERENCE_STORAGE_KEY = "cms-client-theme-preference";
export const ADMIN_THEME_PREFERENCE_STORAGE_KEY = "cms-admin-theme-preference";

// Admin routes share a distinct set of top-level prefixes. Used by the
// pre-paint bootstrap so the correct (client vs admin) preference is applied.
export const ADMIN_ROUTE_PREFIXES = [
  "/dashboard",
  "/analytics",
  "/blog",
  "/careers",
  "/category",
  "/customer",
  "/invoices",
  "/leads",
  "/pages",
  "/projects",
  "/services",
  "/settings",
  "/team",
  "/website-setup",
  "/login",
  "/onboarding",
] as const;

export function isAdminPath(pathname: string): boolean {
  if (pathname === "/") return false;
  return ADMIN_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function themeAreaForPath(pathname: string): ThemeArea {
  return isAdminPath(pathname) ? "admin" : "client";
}

function storageKeyFor(area: ThemeArea): string {
  return area === "admin" ? ADMIN_THEME_PREFERENCE_STORAGE_KEY : CLIENT_THEME_PREFERENCE_STORAGE_KEY;
}

type ThemeModeContextValue = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
  area: ThemeArea;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

function isThemePreference(value: string | null): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

function readPreference(area: ThemeArea, defaultPreference: ThemePreference): ThemePreference {
  try {
    const key = storageKeyFor(area);
    const stored = window.localStorage.getItem(key);
    if (isThemePreference(stored)) return stored;
    const legacy = window.localStorage.getItem(THEME_PREFERENCE_STORAGE_KEY);
    if (isThemePreference(legacy)) return legacy;
  } catch {
    // Ignore storage errors
  }
  return defaultPreference;
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  return preference === "system" ? systemTheme() : preference;
}

function applyTheme(theme: ResolvedTheme) {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
  document.documentElement.style.colorScheme = theme;
}

type ThemeModeProviderProps = {
  area: ThemeArea;
  /** Site-wide default for this area. For the client area this is the
   *  admin-controlled `clientThemeMode` setting; for the admin area it is
   *  always "system". */
  defaultPreference?: ThemePreference;
  children: ReactNode;
};

/**
 * Custom hook that subscribes to localStorage + system color scheme changes.
 * Returns both the preference and resolvedTheme, triggering re-renders when
 * either changes. Uses useSyncExternalStore for hydration safety.
 */
function useThemeStore(area: ThemeArea, defaultPreference: ThemePreference) {
  // Build a combined snapshot that covers both localStorage AND system theme.
  // This ensures a re-render when system theme changes while preference="system".
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      // Listen for localStorage changes (cross-tab and synthetic)
      const storageHandler = (e: StorageEvent) => {
        const key = storageKeyFor(area);
        if (e.key === key || e.key === THEME_PREFERENCE_STORAGE_KEY) {
          onStoreChange();
        }
      };
      window.addEventListener("storage", storageHandler);

      // Listen for system color scheme changes
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const mediaHandler = () => onStoreChange();
      media.addEventListener("change", mediaHandler);

      return () => {
        window.removeEventListener("storage", storageHandler);
        media.removeEventListener("change", mediaHandler);
      };
    },
    [area]
  );

  const getSnapshot = useCallback(() => {
    const pref = readPreference(area, defaultPreference);
    const resolved = resolveTheme(pref);
    // Return a stable string representation that changes when either value changes
    return `${pref}:${resolved}`;
  }, [area, defaultPreference]);

  const getServerSnapshot = useCallback(
    () => `${defaultPreference}:light`,
    [defaultPreference]
  );

  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [preference, resolvedTheme] = snapshot.split(":") as [ThemePreference, ResolvedTheme];
  return { preference, resolvedTheme };
}

export function ThemeModeProvider({
  area,
  defaultPreference = "system",
  children,
}: ThemeModeProviderProps) {
  const { preference, resolvedTheme } = useThemeStore(area, defaultPreference);

  // Apply the theme class to <html> whenever it changes.
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setPreference = useCallback(
    (nextPreference: ThemePreference) => {
      try {
        window.localStorage.setItem(storageKeyFor(area), nextPreference);
      } catch {
        // Preference applies for this session only when storage is unavailable.
      }
      // Apply immediately for responsiveness
      applyTheme(resolveTheme(nextPreference));
      // Trigger useSyncExternalStore re-read via synthetic storage event
      // (the real `storage` event only fires for cross-tab changes).
      window.dispatchEvent(
        new StorageEvent("storage", { key: storageKeyFor(area) })
      );
    },
    [area]
  );

  const value = useMemo(
    () => ({ preference, resolvedTheme, setPreference, area }),
    [preference, resolvedTheme, setPreference, area]
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export function useThemeMode(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext);
  if (!context) throw new Error("useThemeMode must be used within ThemeModeProvider");
  return context;
}
