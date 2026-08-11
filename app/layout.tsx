import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { EnvProvider } from "@/components/EnvProvider";
import { getSiteSettings } from "@/lib/site-settings";
import { ThemeProvider } from "@/components/ThemeProvider";
import {
  ADMIN_THEME_PREFERENCE_STORAGE_KEY,
  CLIENT_THEME_PREFERENCE_STORAGE_KEY,
  THEME_PREFERENCE_STORAGE_KEY,
  ADMIN_ROUTE_PREFIXES,
} from "@/components/ThemeModeProvider";
import { getPublicAppearanceSettings } from "@/app/actions/appearance";
import "./globals.css";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function buildThemeBootstrapScript(clientThemeMode: "system" | "light" | "dark") {
  const adminPrefixes = JSON.stringify(ADMIN_ROUTE_PREFIXES);
  return `(() => {
  try {
    var adminPrefixes = ${adminPrefixes};
    var path = window.location.pathname;
    var isAdmin = path === "/" ? false : adminPrefixes.some(function (p) {
      return path === p || path.indexOf(p + "/") === 0;
    });
    var key = isAdmin ? ${JSON.stringify(ADMIN_THEME_PREFERENCE_STORAGE_KEY)} : ${JSON.stringify(CLIENT_THEME_PREFERENCE_STORAGE_KEY)};
    var legacy = null;
    try { legacy = localStorage.getItem(${JSON.stringify(THEME_PREFERENCE_STORAGE_KEY)}); } catch (e) {}
    var stored = null;
    try { stored = localStorage.getItem(key) || legacy; } catch (e) {}
    var preference = stored === "light" || stored === "dark" || stored === "system"
      ? stored
      : (isAdmin ? "system" : ${JSON.stringify(clientThemeMode)});
    var resolved = preference === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : preference;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolved);
    document.documentElement.style.colorScheme = resolved;
  } catch {
    document.documentElement.classList.add("light");
  }
})();`;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  // Simple default title — the (user) layout provides its own template for client pages.
  return {
    metadataBase: new URL(process.env.AUTH_URL || "http://localhost:3000"),
    title: settings.siteName,
    description: settings.description,
    icons: {
      icon: settings.faviconUrl || "/favicon.ico",
      shortcut: settings.faviconUrl || "/favicon.ico",
      apple: settings.faviconUrl || "/favicon.ico",
    },
    openGraph: {
      title: settings.siteName,
      description: settings.description,
      siteName: settings.siteName,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, appearance] = await Promise.all([
    getSiteSettings(),
    getPublicAppearanceSettings(),
  ]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {buildThemeBootstrapScript(settings.clientThemeMode)}
        </Script>
        {/* Strip browser-extension attributes (e.g. Bitdefender TrafficLight's
            bis_skin_checked) before React hydration to prevent false hydration
            mismatch warnings. These attributes are injected into the DOM by
            extensions, not by our application. */}
        <Script id="strip-extension-attrs" strategy="beforeInteractive">
          {`(function(){try{document.querySelectorAll('[bis_skin_checked]').forEach(function(el){el.removeAttribute('bis_skin_checked')});}catch(e){}})();`}
        </Script>
        <link rel="icon" href={settings.faviconUrl || "/favicon.ico"} />
        <link rel="shortcut icon" href={settings.faviconUrl || "/favicon.ico"} />
        <link rel="apple-touch-icon" href={settings.faviconUrl || "/favicon.ico"} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider
          lightThemeColor={settings.lightThemeColor}
          lightThemeTextColor={settings.lightThemeTextColor}
          darkThemeColor={settings.darkThemeColor}
          darkThemeTextColor={settings.darkThemeTextColor}
          hoverColor={appearance.hoverColor}
          hoverEnabled={appearance.hoverEnabled}
          baseColorEnabled={settings.baseColorEnabled}
        />
        <EnvProvider siteUrl={process.env.AUTH_URL || "/"}>
          <AuthProvider>{children}</AuthProvider>
        </EnvProvider>
      </body>
    </html>
  );
}
