import { getCustomers, getCustomerStats } from "@/app/actions/customers";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/Card";
import { Topbar } from "@/components/Topbar";
import { Users, UserCheck, UserPlus, TrendingUp } from "lucide-react";
import { CustomerTable } from "@/app/(app)/customer/CustomerTable";

export default async function CustomerPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));
  const search = sp.search ?? "";

  const [statsRes, listRes] = await Promise.all([
    getCustomerStats(),
    getCustomers(page, 10, search),
  ]);

  const stats = [
    { icon: Users, label: "Total Clients", value: String(statsRes.total ?? 0) },
    { icon: UserCheck, label: "Active Clients", value: String(statsRes.active ?? 0) },
    { icon: UserPlus, label: "New This Month", value: String(statsRes.newThisMonth ?? 0) },
    { icon: TrendingUp, label: "Total Revenue", value: "$0" },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar />

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader title="Customer" description="Manage your customers." />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Table */}
      <Card noPadding className="overflow-hidden">
        <CustomerTable
          customers={listRes.customers as any[]}
          total={listRes.total}
          pageCount={listRes.pageCount}
          currentPage={page}
          search={search}
        />
      </Card>
    </div>
  );
}
