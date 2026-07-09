import { WebsiteHeaderClient } from "./WebsiteHeaderClient";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function WebsiteHeaderPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const setting = await prisma.setting.findUnique({
    where: { key: "website-header" },
  });

  const initialData = (setting?.value as {
    logoUrl?: string;
    stickyHeader?: boolean;
    bannerImageUrl?: string;
    bannerLink?: string;
    helpNumber?: string;
    menuItems?: { label: string; path: string }[];
    partners?: string[];
    technologies?: string[];
  }) ?? {};

  return <WebsiteHeaderClient initialData={initialData} />;
}
