import { getCustomers, getCustomerStats } from "@/app/actions/customers";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/Card";
import { Users, UserCheck, UserPlus, TrendingUp } from "lucide-react";
import { CustomerTable } from "./CustomerTable";

export default async function CustomerPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const search = params.search ?? "";

  const [statsResult, listResult] = await Promise.all([
    getCustomerStats(),
    getCustomers(page, 10, search),
  ]);

const stats = [
  {
    icon: Users,
    label: "Total Clients",
    value: "375",
  },
  {
    icon: UserCheck,
    label: "Active Clients",
    value: "200",
  },
  {
    icon: UserPlus,
    label: "New Clients",
    value: "50",
  },
  {
    icon: TrendingUp,
    label: "Total Revenue",
    value: "$128",
  }
];

const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "Jhon Deo",
    email: "Jhondeo@gmail.com",
    phone: "9898989898",
    gender: "Male",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John1",
    services: "Web Development",
    status: "Active",
    invoiceStatus: "Paid"
  },
  {
    id: 2,
    name: "Jhon Deo",
    email: "Jhondeo@gmail.com",
    phone: "9898989898",
    gender: "Female",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane2",
    services: "Web Development",
    status: "Inactive",
    invoiceStatus: "Paid"
  },
  {
    id: 3,
    name: "Jhon Deo",
    email: "Jhondeo@gmail.com",
    phone: "9898989898",
    gender: "Male",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John3",
    services: "Web Development",
    status: "Active",
    invoiceStatus: "Paid"
  },
  {
    id: 4,
    name: "Jhon Deo",
    email: "Jhondeo@gmail.com",
    phone: "9898989898",
    gender: "Female",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane4",
    services: "Web Development",
    status: "Inactive",
    invoiceStatus: "Paid"
  }
];

function FilterPeriod() {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-2.5 text-left shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.14)] sm:w-auto"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
        <CalendarDays className="h-5 w-5" />
      </span>
      <span className="flex flex-1 flex-col">
        <span className="text-sm font-semibold text-black">
          Filter Period
        </span>
        <span className="text-xs text-zinc-500">17 April 2021 - 21 May 2021</span>
      </span>
      <ChevronDown className="h-4 w-4 shrink-0 text-black" />
    </button>
  );
}

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCustomer = (customerData: CustomerFormData) => {
    const newCustomer: Customer = {
      ...customerData,
      id: customers.length + 1,
      avatar: customerData.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
      gender: customerData.gender === "Female" ? "Female" : "Male",
      status: customerData.status,
      invoiceStatus: customerData.invoiceStatus
    };
    setCustomers([...customers, newCustomer]);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar />

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader title="Customer" description="Manage your customers." />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Table */}
      <Card noPadding className="overflow-hidden">
        <CustomerTable
          customers={listResult.customers as any}
          total={listResult.total}
          pageCount={listResult.pageCount}
          currentPage={page}
          search={search}
        />
      </Card>
    </div>
  );
}
