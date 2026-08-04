import { getDepartments } from "@/app/actions/team";
import { DepartmentsClient } from "./DepartmentsClient";

export default async function DepartmentsSettingsPage() {
  const departments = await getDepartments();
  return <DepartmentsClient initialDepartments={departments} />;
}
