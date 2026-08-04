import { getEntityLabelsArray } from "@/app/actions/labels";
import LabelsClient from "./LabelsClient";

export default async function LabelsSettingsPage() {
  const initialLabels = await getEntityLabelsArray();
  return <LabelsClient initialLabels={initialLabels} />;
}
