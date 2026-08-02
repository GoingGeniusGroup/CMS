import {
  getCustomFieldsForAdmin,
  getModuleKeysForAdmin,
} from "@/app/actions/custom-fields";
import CustomFieldsClient from "./CustomFieldsClient";

export default async function CustomFieldsSettingsPage() {
  const [fields, modules] = await Promise.all([getCustomFieldsForAdmin(), getModuleKeysForAdmin()]);
  return <CustomFieldsClient initialFields={fields} modules={modules} />;
}
