import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";

export default function AnalyticsPage() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar />
      <PageHeader title="Analytics" description="View metrics and reports." />
    </div>
  );
}
