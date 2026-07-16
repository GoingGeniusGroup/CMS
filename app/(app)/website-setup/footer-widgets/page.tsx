import { FooterWidgetsClient } from "./FooterWidgetsClient";
import { getFooterSettings } from "@/app/actions/footer-settings";

export default async function FooterWidgetsPage() {
  const initialData = await getFooterSettings();
  return <FooterWidgetsClient initialData={initialData} />;
}
