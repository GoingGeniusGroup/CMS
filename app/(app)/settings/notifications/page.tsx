import { auth } from "@/auth";
import { getNotificationSettings, getNotifications } from "@/app/actions/notifications";
import { NotificationSettingsClient } from "./NotificationSettingsClient";

export default async function NotificationSettingsPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [settings, notifications] = await Promise.all([
    getNotificationSettings(),
    getNotifications(50),
  ]);

  return (
    <NotificationSettingsClient
      initialSettings={settings}
      initialNotifications={JSON.parse(JSON.stringify(notifications))}
    />
  );
}
