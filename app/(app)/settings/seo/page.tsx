import { getSeoSettings } from "@/app/actions/seo";
import SeoClient from "./SeoClient";

export default async function SeoSettingsPage() {
  const initialData = await getSeoSettings();
  return <SeoClient initialData={initialData} />;
}
