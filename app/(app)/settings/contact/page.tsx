import { ContactSettingsClient } from "./ContactSettingsClient";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function ContactSettingsPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const data = await prisma.contactSetting.findFirst();

  return <ContactSettingsClient initialData={data} />;
}
