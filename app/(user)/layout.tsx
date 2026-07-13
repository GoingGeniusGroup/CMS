import type { Metadata } from "next";
import { LandingNavbar } from "@/components/LandingNavbar";
import Footer from "@/components/footer";
import { getSiteSettings } from "@/lib/site-settings";
import { getPublicContactSettings } from "@/app/actions/contact-settings";

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
  const [settings, contactSettings] = await Promise.all([
    getSiteSettings(),
    getPublicContactSettings(),
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
    </div>
  );
}
