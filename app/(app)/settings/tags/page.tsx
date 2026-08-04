import { getTagVocabularies } from "@/app/actions/tags";
import { TagsClient } from "./TagsClient";

export default async function TagsSettingsPage() {
  const vocabularies = await getTagVocabularies();
  return <TagsClient initialVocabularies={vocabularies} />;
}
