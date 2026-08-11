import { auth } from "@/auth";
import { ApplicantsClient } from "./ApplicantsClient";
import { getJobApplications, getApplicationStats } from "@/app/actions/job-applications";
import prisma from "@/lib/prisma";

export default async function ApplicantsPage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [applications, stats, jobs] = await Promise.all([
    getJobApplications(),
    getApplicationStats(),
    prisma.job.findMany({ select: { id: true, title: true, department: true }, orderBy: { title: "asc" } }),
  ]);

  return (
    <ApplicantsClient
      initialApplications={JSON.parse(JSON.stringify(applications))}
      stats={stats}
      jobs={jobs}
    />
  );
}
