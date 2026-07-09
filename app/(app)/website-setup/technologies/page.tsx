import { TechnologiesClient } from "./TechnologiesClient";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function TechnologiesPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const setting = await prisma.setting.findUnique({
    where: { key: "technologies-logos" },
  });

  const data = (setting?.value as { technologies?: string[] }) ?? {};

  return <TechnologiesClient initialTechnologies={data.technologies ?? []} />;
}
