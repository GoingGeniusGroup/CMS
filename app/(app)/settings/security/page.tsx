import { getSecuritySettings } from "@/app/actions/security-settings";
import { SecuritySettingsClient } from "./SecuritySettingsClient";

export default async function SecuritySettingsPage() {
  const initialData = await getSecuritySettings();
  return <SecuritySettingsClient initialData={initialData} />;
}
