import { WebsiteHeaderClient } from "./WebsiteHeaderClient";
import { getWebsiteHeader } from "@/app/actions/website-header";

export default async function WebsiteHeaderPage() {
  const initialData = await getWebsiteHeader();
  return <WebsiteHeaderClient initialData={initialData} />;
}
