import { getEmailSettings } from "@/app/actions/email-settings";
import { EmailSettingsClient } from "./EmailSettingsClient";

export default async function EmailSettingsPage() {
  const initialData = await getEmailSettings();
  return <EmailSettingsClient initialData={initialData} />;
}
