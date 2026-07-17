import { getCookieSettings } from "@/app/actions/cookie-settings";
import { CookiesSettingsClient } from "./CookiesSettingsClient";

export default async function CookiesSettingsPage() {
  const initialData = await getCookieSettings();
  return <CookiesSettingsClient initialData={initialData} />;
}
