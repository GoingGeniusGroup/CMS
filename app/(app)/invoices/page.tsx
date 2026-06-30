import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";

export default function InvoicesPage() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar />
      <PageHeader title="Invoices" description="Manage billing and invoices." />
    </div>
  );
}
