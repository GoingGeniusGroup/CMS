"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  FolderClosed,
  MoreHorizontal,
  TrendingUp,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { useEntityLabel } from "@/components/ConfigProvider";
import { getDashboardStats, type DashboardStats } from "@/app/actions/dashboard";

const PERIODS = [
  { label: "This Year", months: 0 },
  { label: "Last 30 Days", months: 1 },
  { label: "Last 3 Months", months: 3 },
  { label: "Last 6 Months", months: 6 },
  { label: "Last 12 Months", months: 12 },
  { label: "All Time", months: -1 },
] as const;

const statusColors: Record<string, string> = {
  received: "#facc15",
  pending: "#34d399",
  overdue: "#f43f5e",
};

export default function DashboardPage() {
  const projectLabel = useEntityLabel("project", { plural: true });
  const customerLabel = useEntityLabel("customer", { plural: true });
  const [periodLabel, setPeriodLabel] = useState("This Year");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const fetchStats = useCallback(async (label: string) => {
    const period = PERIODS.find((p) => p.label === label);
    if (!period) return;
    const now = new Date();
    let start: string | undefined;
    const end = now.toISOString();
    if (period.months === -1) {
      start = new Date(2020, 0, 1).toISOString();
    } else if (period.months > 0) {
      start = new Date(now.getFullYear(), now.getMonth() - period.months, 1).toISOString();
    } else {
      start = new Date(now.getFullYear(), 0, 1).toISOString();
    }
    const data = await getDashboardStats(start, end);
    setStats(data);
  }, []);

  // Guard against React StrictMode's double effect invocation in dev: only
  // fetch when the selected period actually changes, so getDashboardStats
  // fires once per navigation (and once per real period change), not twice.
  const lastFetchedPeriod = useRef<string | null>(null);
  useEffect(() => {
    if (lastFetchedPeriod.current === periodLabel) return;
    lastFetchedPeriod.current = periodLabel;
    fetchStats(periodLabel);
  }, [fetchStats, periodLabel]);

  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar showSearch={false} />
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader title="Dashboard" description="Hi, Admin. Welcome back to CMS-GG !" />
        <div className="relative">
          <button
            type="button"
            onClick={() => setPeriodOpen((v) => !v)}
            className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-2.5 text-left shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.14)] sm:w-auto"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
              <CalendarDays className="h-5 w-5" />
            </span>
            <span className="flex flex-1 flex-col">
              <span className="text-sm font-semibold text-black">Filter Period</span>
              <span className="text-xs text-zinc-500">{periodLabel}</span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-black" />
          </button>
          {periodOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 w-full overflow-hidden rounded-xl bg-white py-1 shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
              {PERIODS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => { setPeriodLabel(p.label); setPeriodOpen(false); }}
                  className={`block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${
                    periodLabel === p.label ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {stats ? (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
            <StatCard
              icon={FolderClosed}
              value={String(stats.activeProjects)}
              label={`Active ${projectLabel}`}
              delta={`${stats.statsDelta.activeProjects.value}% (30 days)`}
              up={stats.statsDelta.activeProjects.up}
            />
            <StatCard
              icon={Users}
              value={String(stats.totalClients)}
              label={`Total ${customerLabel}`}
              delta={`${stats.statsDelta.totalClients.value}% (30 days)`}
              up={stats.statsDelta.totalClients.up}
            />
            <StatCard
              icon={CalendarDays}
              value={String(stats.pendingTasks)}
              label="Pending Tasks"
              delta={`${stats.statsDelta.pendingTasks.value}% (30 days)`}
              up={stats.statsDelta.pendingTasks.up}
            />
            <StatCard
              icon={TrendingUp}
              value={`Rs. ${stats.totalRevenue}`}
              label="Total Revenue"
              delta={`${stats.statsDelta.totalRevenue.value}% (30 days)`}
              up={stats.statsDelta.totalRevenue.up}
            />
          </section>

          <section className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
            <RevenueCard revenueData={stats.revenueMonthly} />
            <GrowthCard growthData={stats.growthMetrics} />
          </section>
        </>
      ) : (
        <div className="flex items-center justify-center py-20 text-sm text-zinc-500">Loading...</div>
      )}
    </div>
  );
}

function RevenueTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { month: string; value: number; status: string; badge?: string } }>;
}) {
  if (!active || !payload?.length) return null;
  const datum = payload[0].payload;
  return (
    <div className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
      {datum.badge ?? `${datum.value}k`}
    </div>
  );
}

function RevenueCard({ revenueData }: { revenueData: DashboardStats["revenueMonthly"] }) {
  const total = revenueData.reduce((s, d) => s + d.value, 0);
  const [menuOpen, setMenuOpen] = useState(false);

  function handleExport() {
    const csv = ["Month,Value (k),Status", ...revenueData.map((d) => `${d.month},${d.value},${d.status}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setMenuOpen(false);
  }

  return (
    <Card className="relative">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-black">Revenue</h2>
          <p className="text-2xl font-bold tracking-tight text-black">
            {total.toLocaleString()}k
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
          {menuOpen && (
            <div className="absolute right-0 top-10 z-10 w-36 overflow-hidden rounded-xl bg-white py-1 shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
              <button
                type="button"
                onClick={handleExport}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-black transition-colors hover:bg-black/5"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          )}
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
            <Tooltip cursor={{ fill: "transparent" }} content={<RevenueTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 6, 6]} maxBarSize={18}>
              {revenueData.map((entry, idx) => (
                <Cell key={`${entry.month}-${idx}`} fill={statusColors[entry.status]} />
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
    </Card>
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

function GrowthCard({ growthData }: { growthData: DashboardStats["growthMetrics"] }) {
  return (
    <Card className="flex h-full flex-col">
      <h2 className="text-lg font-bold text-black">This Year&apos;s Growth</h2>
      <div className="mt-4 grid flex-1 grid-cols-1 place-items-center gap-6 sm:grid-cols-3 sm:gap-4">
        {growthData.map((item) => (
          <GrowthRing key={item.label} {...item} />
        ))}
      </div>
    </Card>
  );
}

function GrowthRing({ label, value, color, track }: { label: string; value: number; color: string; track: string }) {
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
      <span className="text-sm font-medium text-black">{label}</span>
    </div>
  );
}
