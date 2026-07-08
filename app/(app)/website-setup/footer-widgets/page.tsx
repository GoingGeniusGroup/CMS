import { FooterWidgetsClient } from "./FooterWidgetsClient";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function FooterWidgetsPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const setting = await prisma.setting.findUnique({
    where: { key: "footer-widgets" },
  });

  const initialData = (setting?.value as {
    logoUrl?: string;
    aboutDesc?: string;
    playStoreLink?: string;
    appStoreLink?: string;
    copyrightText?: string;
    socials?: { platform: string; url: string }[];
    contactAddress?: string;
    contactPhone?: string;
    contactEmail?: string;
    paymentLogoUrl?: string;
  }) ?? {};

  return <FooterWidgetsClient initialData={initialData} />;
}
