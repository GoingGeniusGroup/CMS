"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import {
  CalendarDays,
  ChevronDown,
  Download,
  Eye,
  FolderClosed,
  MoreHorizontal,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";

type RevenueDatum = {
  month: string;
  value: number;
  status: "received" | "pending" | "overdue";
  badge?: string;
};

const revenueData: RevenueDatum[] = [
  { month: "Jan", value: 32, status: "received" },
  { month: "Feb", value: 58, status: "received", badge: "12k" },
  { month: "Mar", value: 24, status: "pending" },
  { month: "Apr", value: 46, status: "received" },
  { month: "May", value: 70, status: "received" },
  { month: "Jun", value: 88, status: "received", badge: "47k" },
  { month: "Jul", value: 54, status: "received" },
  { month: "Aug", value: 60, status: "received" },
  { month: "Sep", value: 18, status: "received" },
  { month: "Oct", value: 52, status: "overdue", badge: "27k" },
  { month: "Nov", value: 30, status: "received" },
  { month: "Dec", value: 40, status: "received" },
];

const statusColors: Record<RevenueDatum["status"], string> = {
  received: "#facc15",
  pending: "#34d399",
  overdue: "#f43f5e",
};

const growthData = [
  { label: "Web & Software", value: 81, color: "#f43f5e", track: "#fee2e2" },
  { label: "Customer Growth", value: 22, color: "#10b981", track: "#d1fae5" },
  { label: "On-time Projects", value: 62, color: "#0ea5e9", track: "#e0f2fe" },
];

const stats = [
  {
    icon: FolderClosed,
    value: "75",
    label: "Active Projects",
    delta: "4% (30 days)",
    up: true,
  },
  {
    icon: Users,
    value: "357",
    label: "Total Clients",
    delta: "4% (30 days)",
    up: true,
  },
  {
    icon: CalendarDays,
    value: "65",
    label: "Pending Tasks",
    delta: "25% (30 days)",
    up: true,
  },
  {
    icon: TrendingUp,
    value: "$128",
    label: "Total Revenue",
    delta: "12% (30 days)",
    up: false,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar showSearch={false}/>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader title="Dashboard" description="Hi, Admin. Welcome back to Admin!" />
        <FilterPeriod />
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
        <RevenueCard />
        <GrowthCard />
      </section>
    </div>
  );
}

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

function StatCard({
  icon: Icon,
  value,
  label,
  delta,
  up,
}: {
  icon: typeof FolderClosed;
  value: string;
  label: string;
  delta: string;
  up: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:p-5">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
        <Icon className="h-6 w-6" />
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="text-2xl font-bold tracking-tight text-black">
          {value}
        </span>
        <span className="text-sm text-black">{label}</span>
        <span className="mt-1 flex items-center gap-1 text-xs">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              up ? "bg-emerald-400" : "bg-rose-400"
            }`}
          />
          <span className="text-black">{delta}</span>
        </span>
      </div>
    </div>
  );
}

function RevenueTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: RevenueDatum }>;
}) {
  if (!active || !payload?.length) return null;
  const datum = payload[0].payload;
  return (
    <div className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
      {datum.badge ?? `${datum.value}k`}
    </div>
  );
}

function RevenueCard() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative rounded-2xl bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:p-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-black">
            Revenue
          </h2>
          <p className="text-2xl font-bold tracking-tight text-black">
            90,00,000
          </p>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-black transition-colors hover:bg-black/5"
            aria-label="Revenue options"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
          {menuOpen ? (
            <div className="absolute right-0 top-10 z-10 w-36 overflow-hidden rounded-xl bg-white py-1 shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
              <MenuItem icon={Eye} label="View" />
              <MenuItem icon={Download} label="Export" />
              <MenuItem icon={Trash2} label="Remove" danger />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueData} barCategoryGap="28%">
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#000000" }}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              content={<RevenueTooltip />}
            />
            <Bar dataKey="value" radius={[6, 6, 6, 6]} maxBarSize={18}>
              {revenueData.map((entry) => (
                <Cell key={entry.month} fill={statusColors[entry.status]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-black">
        <Legend color="#facc15" label="Received" />
        <Legend color="#34d399" label="Pending" />
        <Legend color="#f43f5e" label="Overdue" />
      </div>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  danger,
}: {
  icon: typeof Eye;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-black/5 ${
        danger ? "text-rose-500" : "text-black"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

function GrowthCard() {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:p-6">
      <h2 className="text-lg font-bold text-black">
        This Year&apos;s Growth
      </h2>
      <div className="mt-4 grid flex-1 grid-cols-1 place-items-center gap-6 sm:grid-cols-3 sm:gap-4">
        {growthData.map((item) => (
          <GrowthRing key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}

function GrowthRing({
  label,
  value,
  color,
  track,
}: {
  label: string;
  value: number;
  color: string;
  track: string;
}) {
  const data = [
    { name: "value", value },
    { name: "rest", value: 100 - value },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-28 w-28">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius="72%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              stroke="none"
              cornerRadius={8}
            >
              <Cell fill={color} />
              <Cell fill={track} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-black">
          {value}%
        </span>
      </div>
      <span className="text-sm font-medium text-black">
        {label}
      </span>
    </div>
  );
}
