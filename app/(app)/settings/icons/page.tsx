import { auth } from "@/auth";
import { getAllIconNames, getSiteIcons, getCustomIcons } from "@/app/actions/icons";
import { IconsClient } from "./IconsClient";

export default async function IconsSettingsPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [all, enabled, customIcons] = await Promise.all([
    getAllIconNames(),
    getSiteIcons(),
    getCustomIcons(),
  ]);
  const enabledSet = new Set(enabled);

  const icons = all.map((name) => ({ name, enabled: enabledSet.has(name) }));

  return <IconsClient initialIcons={icons} initialCustomIcons={customIcons} />;
}
