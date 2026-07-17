import type { Metadata } from "next";
import { LandingNavbar } from "@/components/LandingNavbar";
import { TopBanner } from "@/components/TopBanner";
import Footer from "@/components/footer";
import { CookieBanner } from "@/components/CookieBanner";
import { SitePopup } from "@/components/SitePopup";
import { getSiteSettings } from "@/lib/site-settings";
import { getPublicContactSettings } from "@/app/actions/contact-settings";
import { getPublicWebsiteHeader } from "@/app/actions/website-header";
import { getPublicFooterSettings } from "@/app/actions/footer-settings";
import { getPublicSeoSettings } from "@/app/actions/seo";
import { getPublicCookieSettings } from "@/app/actions/cookie-settings";
import { getPublicPopupSettings } from "@/app/actions/popup";
import { getPublicAppearanceSettings } from "@/app/actions/appearance";
import { ThemeProvider } from "@/components/ThemeProvider";

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
      default: settings.siteName,
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
  const [
    settings,
    contactSettings,
    headerSettings,
    footerSettings,
    cookieSettings,
    popupSettings,
    appearance,
  ] = await Promise.all([
    getSiteSettings(),
    getPublicContactSettings(),
    getPublicWebsiteHeader(),
    getPublicFooterSettings(),
    getPublicCookieSettings(),
    getPublicPopupSettings(),
    getPublicAppearanceSettings(),
  ]);

  const hasBanner = !!headerSettings.bannerImageUrl;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Theme is applied to the client-facing site ONLY (not the admin panel) */}
      <ThemeProvider
        themeColor={settings.themeColor}
        themeTextColor={settings.themeTextColor}
        hoverColor={appearance.hoverColor}
        hoverEnabled={appearance.hoverEnabled}
        baseColorEnabled={settings.baseColorEnabled}
      />
      {/* Sticky wrapper — banner + navbar stick together */}
      <div className={headerSettings.stickyHeader ? "sticky top-0 z-50" : ""}>
        {/* Top Banner Ad */}
        {hasBanner && (
          <TopBanner
            imageUrl={headerSettings.bannerImageUrl}
            link={headerSettings.bannerLink || null}
          />
        )}

        {/* Navbar — always directly below banner */}
        <LandingNavbar
          logoUrl={settings.logoUrl}
          siteName={settings.siteName}
          menuItems={headerSettings.menuItems}
        />
      </div>

      <main className="flex-1">{children}</main>
      <Footer
        logoUrl={settings.logoUrl}
        siteName={settings.siteName}
        contactEmail={contactSettings?.email1 || undefined}
        contactPhone={contactSettings?.phone1 || undefined}
        contactAddress={contactSettings?.address || undefined}
        aboutDesc={footerSettings.aboutDesc || undefined}
        brandText={footerSettings.brandText || undefined}
        copyrightText={footerSettings.copyrightText || undefined}
        linkColumns={footerSettings.linkColumns}
        socials={footerSettings.socials}
        paymentLogoUrl={footerSettings.paymentLogoUrl || undefined}
        footerLogoUrl={footerSettings.footerLogoUrl || undefined}
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
