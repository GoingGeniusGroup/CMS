import { getProjects } from "@/app/actions/projects";
import { ProjectsClient } from "./ProjectsClient";

export default async function ProjectsPage() {
  const data = await getProjects(1, 10);
  return <ProjectsClient initialData={data} />;
}
