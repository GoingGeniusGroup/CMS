import { getPopupSettings } from "@/app/actions/popup";
import PopupSettingsClient from "./PopupSettingsClient";

export default async function PopupSettingsPage() {
  const data = await getPopupSettings();
  return <PopupSettingsClient initialData={{ showPopup: data.showPopup, content: data.content as Record<string, unknown> }} />;
}
