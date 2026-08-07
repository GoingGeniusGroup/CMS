import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { EnvProvider } from "@/components/EnvProvider";
import { getSiteSettings } from "@/lib/site-settings";
import { ThemeModeProvider } from "@/components/ThemeModeProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
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

const themeBootstrapScript = `(() => {
  try {
    const key = "cms-theme-preference";
    const stored = localStorage.getItem(key);
    const preference = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    const resolved = preference === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : preference;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolved);
    document.documentElement.style.colorScheme = resolved;
  } catch {
    document.documentElement.classList.add("light");
  }
})();`;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  // Simple default title — the (user) layout provides its own template for client pages.
  return {
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
          {themeBootstrapScript}
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
        <ThemeModeProvider>
          <EnvProvider siteUrl={process.env.AUTH_URL || "/"}>
            <AuthProvider>{children}</AuthProvider>
          </EnvProvider>
        </ThemeModeProvider>
      </body>
    </html>
  );
}
