import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";

export default function InvoicesPage() {
  return (
    <>
      <Topbar />
      <PageHeader title="Invoices" description="Manage billing and invoices." />
    </>
  );
}
