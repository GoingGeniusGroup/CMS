import { getAppearanceSettings } from "@/app/actions/appearance";
import { getSiteSettings } from "@/lib/site-settings";
import AppearanceClient from "./AppearanceClient";

export default async function AppearanceSettingsPage() {
  const [initialData, siteSettings] = await Promise.all([
    getAppearanceSettings(),
    getSiteSettings(),
  ]);
  return <AppearanceClient initialData={initialData} baseColor={siteSettings.lightThemeColor} />;
}
