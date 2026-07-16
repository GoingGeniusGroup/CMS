import type { Metadata } from "next";
import { LandingNavbar } from "@/components/LandingNavbar";
import { TopBanner } from "@/components/TopBanner";
import Footer from "@/components/footer";
import { getSiteSettings } from "@/lib/site-settings";
import { getPublicContactSettings } from "@/app/actions/contact-settings";
import { getPublicWebsiteHeader } from "@/app/actions/website-header";
import { getPublicFooterSettings } from "@/app/actions/footer-settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.description,
    keywords: settings.metaKeywords ? settings.metaKeywords.split(",").map((k) => k.trim()) : [],
    icons: {
      icon: settings.faviconUrl || "/favicon.ico",
      shortcut: settings.faviconUrl || "/favicon.ico",
      apple: settings.faviconUrl || "/favicon.ico",
    },
    openGraph: {
      title: settings.siteName,
      description: settings.description,
    },
  };
}

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, contactSettings, headerSettings, footerSettings] = await Promise.all([
    getSiteSettings(),
    getPublicContactSettings(),
    getPublicWebsiteHeader(),
    getPublicFooterSettings(),
  ]);

  const hasBanner = !!headerSettings.bannerImageUrl;

  return (
    <div className="min-h-screen bg-white flex flex-col">
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
    </div>
  );
}
