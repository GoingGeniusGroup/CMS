import { getGeneralSettings } from "@/app/actions/general-settings";
import GeneralSettingsClient from "./GeneralSettingsClient";

export default async function GeneralSettingsPage() {
  const data = await getGeneralSettings();
  return <GeneralSettingsClient initialData={data} />;
}
