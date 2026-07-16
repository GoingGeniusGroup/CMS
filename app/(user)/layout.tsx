import type { Metadata } from "next";
import { LandingNavbar } from "@/components/LandingNavbar";
import Footer from "@/components/footer";
import { CookieBanner } from "@/components/CookieBanner";
import { SitePopup } from "@/components/SitePopup";
import { getSiteSettings } from "@/lib/site-settings";
import { getPublicContactSettings } from "@/app/actions/contact-settings";
import { getPublicCookieSettings } from "@/app/actions/cookie-settings";
import { getPublicPopupSettings } from "@/app/actions/popup";
import { getPublicSeoSettings } from "@/app/actions/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, seoSettings] = await Promise.all([
    getSiteSettings(),
    getPublicSeoSettings(),
  ]);

  const title = seoSettings.metaTitle || settings.siteName;
  const description = seoSettings.metaDescription || settings.description;
  const keywords = seoSettings.metaKeywords || settings.metaKeywords || "";

  return {
    title: {
      default: title,
      template: `%s | ${settings.siteName}`,
    },
    description,
    keywords: keywords ? keywords.split(",").map((k) => k.trim()) : [],
    icons: {
      icon: settings.faviconUrl || "/favicon.ico",
      shortcut: settings.faviconUrl || "/favicon.ico",
      apple: settings.faviconUrl || "/favicon.ico",
    },
    openGraph: {
      title,
      description,
      ...(seoSettings.metaImage ? { images: [{ url: seoSettings.metaImage }] } : {}),
    },
  };
}

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, contactSettings, cookieSettings, popupSettings] = await Promise.all([
    getSiteSettings(),
    getPublicContactSettings(),
    getPublicCookieSettings(),
    getPublicPopupSettings(),
  ]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <LandingNavbar logoUrl={settings.logoUrl} siteName={settings.siteName} />
      <main className="flex-1">{children}</main>
      <Footer
        logoUrl={settings.logoUrl}
        siteName={settings.siteName}
        contactEmail={contactSettings?.email1 || undefined}
        contactPhone={contactSettings?.phone1 || undefined}
        contactAddress={contactSettings?.address || undefined}
      />
      {cookieSettings.cookiesAgreement && (
        <CookieBanner
          showCookiesAgreement={cookieSettings.showCookiesAgreement}
          cookiesAgreementText={cookieSettings.cookiesAgreementText}
        />
      )}
      <SitePopup
        showPopup={popupSettings.showPopup}
        content={popupSettings.content}
      />
    </div>
  );
}
