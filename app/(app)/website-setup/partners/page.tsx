import { PartnersClient } from "./PartnersClient";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function PartnersPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const setting = await prisma.setting.findUnique({
    where: { key: "website-header" },
  });

  const data = (setting?.value as { partners?: string[] }) ?? {};

  return <PartnersClient initialPartners={data.partners ?? []} />;
}
