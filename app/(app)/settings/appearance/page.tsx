import { getAppearanceSettings } from "@/app/actions/appearance";
import AppearanceClient from "./AppearanceClient";

export default async function AppearanceSettingsPage() {
  const initialData = await getAppearanceSettings();
  return <AppearanceClient initialData={initialData} />;
}
