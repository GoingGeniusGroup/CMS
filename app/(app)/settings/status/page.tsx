import { getStatusOptionsForAdmin, getStatusModulesForAdmin } from "@/app/actions/status-options";
import StatusWorkflowsClient from "./StatusWorkflowsClient";

export default async function StatusWorkflowsSettingsPage() {
  const [statusOptions, modules] = await Promise.all([
    getStatusOptionsForAdmin(),
    getStatusModulesForAdmin(),
  ]);
  return <StatusWorkflowsClient initialStatusOptions={statusOptions} modules={modules} />;
}
