import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { EnvProvider } from "@/components/EnvProvider";
import { getSiteSettings } from "@/lib/site-settings";
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
  const settings = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href={settings.faviconUrl || "/favicon.ico"} />
        <link rel="shortcut icon" href={settings.faviconUrl || "/favicon.ico"} />
        <link rel="apple-touch-icon" href={settings.faviconUrl || "/favicon.ico"} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <EnvProvider siteUrl={process.env.AUTH_URL || "/"}>
          <AuthProvider>{children}</AuthProvider>
        </EnvProvider>
      </body>
    </html>
  );
}
