import { getEntityLabels } from "@/app/actions/labels";
import LabelsClient from "./LabelsClient";

export default async function LabelsSettingsPage() {
  const initialLabels = await getEntityLabels();
  return <LabelsClient initialLabels={initialLabels} />;
}
