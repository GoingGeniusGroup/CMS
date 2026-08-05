import { getSidebarModuleConfig } from "@/app/actions/sidebar-nav";
import NavigationClient from "./NavigationClient";

export default async function NavigationSettingsPage() {
  const { disabled } = await getSidebarModuleConfig();
  return <NavigationClient initialDisabled={disabled} />;
}