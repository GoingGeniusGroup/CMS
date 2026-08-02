"use server";

import prisma from "@/lib/prisma";

export type DashboardStats = {
  activeProjects: number;
  totalClients: number;
  pendingTasks: number;
  totalRevenue: number;
  statsDelta: {
    activeProjects: { value: number; up: boolean };
    totalClients: { value: number; up: boolean };
    pendingTasks: { value: number; up: boolean };
    totalRevenue: { value: number; up: boolean };
  };
  revenueMonthly: { month: string; value: number; status: "received" | "pending" | "overdue"; badge?: string }[];
  growthMetrics: { label: string; value: number; color: string; track: string }[];
};

export async function getDashboardStats(startDate?: string, endDate?: string): Promise<DashboardStats> {
  const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
  const end = endDate ? new Date(endDate) : new Date();

  const endOfEnd = new Date(end);
  endOfEnd.setHours(23, 59, 59, 999);

  const prevStart = new Date(start);
  prevStart.setFullYear(prevStart.getFullYear() - 1);
  const prevEnd = new Date(endOfEnd);
  prevEnd.setFullYear(prevEnd.getFullYear() - 1);

  const [
    activeProjects,
    prevActiveProjects,
    totalClients,
    prevTotalClients,
    pendingInvoices,
    prevPendingInvoices,
    revenueAgg,
    prevRevenueAgg,
    monthlyInvoices,
    totalProjects,
    totalPublishedProjects,
    totalCustomers,
    prevTotalCustomers,
    publishedWithDates,
  ] = await Promise.all([
    // Current active projects
    prisma.project.count({ where: { status: "Published", createdAt: { gte: start, lte: endOfEnd } } }),
    // Previous period active projects
    prisma.project.count({ where: { status: "Published", createdAt: { gte: prevStart, lte: prevEnd } } }),
    // Current total clients
    prisma.customer.count({ where: { createdAt: { gte: start, lte: endOfEnd } } }),
    // Previous period clients
    prisma.customer.count({ where: { createdAt: { gte: prevStart, lte: prevEnd } } }),
    // Current pending invoices
    prisma.invoice.count({ where: { status: "Pending", createdAt: { gte: start, lte: endOfEnd } } }),
    // Previous period pending invoices
    prisma.invoice.count({ where: { status: "Pending", createdAt: { gte: prevStart, lte: prevEnd } } }),
    // Current revenue
    prisma.invoice.aggregate({ where: { status: "Paid", createdAt: { gte: start, lte: endOfEnd } }, _sum: { total: true } }),
    // Previous period revenue
    prisma.invoice.aggregate({ where: { status: "Paid", createdAt: { gte: prevStart, lte: prevEnd } }, _sum: { total: true } }),
    // Monthly revenue for chart
    prisma.invoice.findMany({ where: { createdAt: { gte: start, lte: endOfEnd } }, select: { total: true, status: true, createdAt: true } }),
    // For growth metrics
    prisma.project.count(),
    prisma.project.count({ where: { status: "Published" } }),
    prisma.customer.count(),
    prisma.customer.count({ where: { createdAt: { gte: new Date(new Date().getFullYear(), 0, 1) } } }),
    // Published projects that have both start and end dates. Runs in the same
    // parallel batch instead of two identical sequential queries after it.
    prisma.project.count({
      where: { status: "Published", endDate: { not: null }, startDate: { not: null } },
    }),
  ]);

  const currentRevenue = revenueAgg._sum.total ?? 0;
  const prevRevenue = prevRevenueAgg._sum.total ?? 0;

  function calcDelta(current: number, previous: number): { value: number; up: boolean } {
    if (previous === 0) return { value: current > 0 ? 100 : 0, up: current >= 0 };
    const pct = Math.round(((current - previous) / previous) * 100);
    return { value: Math.abs(pct), up: pct >= 0 };
  }

  // Build monthly revenue data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthlyMap: Record<string, { total: number; paid: number; pending: number; overdue: number }> = {};

  // Initialize all months in range
  const d = new Date(start);
  while (d <= end) {
    const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
    monthlyMap[key] = { total: 0, paid: 0, pending: 0, overdue: 0 };
    d.setMonth(d.getMonth() + 1);
  }

  for (const inv of monthlyInvoices) {
    const key = `${months[inv.createdAt.getMonth()]} ${inv.createdAt.getFullYear()}`;
    if (monthlyMap[key]) {
      monthlyMap[key].total += inv.total;
      if (inv.status === "Paid") monthlyMap[key].paid += inv.total;
      else if (inv.status === "Pending") monthlyMap[key].pending += inv.total;
      else if (inv.status === "Overdue") monthlyMap[key].overdue += inv.total;
    }
  }

  const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueEntries = Object.entries(monthlyMap).map(([key, data]) => {
    const total = Math.round(data.total);
    const monthLabel = key.split(" ")[0];
    const status: "received" | "pending" | "overdue" =
      data.overdue > data.paid && data.overdue > data.pending
        ? "overdue"
        : data.pending > data.paid
          ? "pending"
          : "received";
    return {
      month: monthLabel,
      value: Math.max(Math.round(total / 1000), 1),
      status,
      ...(total > 0 ? { badge: `${(total / 1000).toFixed(1)}k` } : {}),
    };
  });

  // Consolidate entries with the same month label (multi-year periods)
  const revenueMap: Record<string, typeof revenueEntries[number]> = {};
  for (const entry of revenueEntries) {
    if (revenueMap[entry.month]) {
      revenueMap[entry.month].value = Math.max(revenueMap[entry.month].value, entry.value);
      if (entry.badge) revenueMap[entry.month].badge = entry.badge;
    } else {
      revenueMap[entry.month] = { ...entry };
    }
  }

  let revenueMonthly = Object.values(revenueMap);

  // If no revenue data, provide fallback so chart isn't empty
  if (revenueMonthly.length === 0) {
    revenueMonthly = shortMonths.map((m) => ({ month: m, value: Math.floor(Math.random() * 20) + 5, status: "received" as const }));
  }

  // Growth metrics
  const projectCompletionRate = totalProjects > 0 ? Math.round((totalPublishedProjects / totalProjects) * 100) : 0;
  const customerGrowthRate = totalClients > 0 ? Math.round((prevTotalCustomers / totalCustomers) * 100) : 0;
  // Both values come from the single `publishedWithDates` count above
  // (the two original queries were identical), preserving the same result.
  const onTimeProjects = publishedWithDates;
  const totalWithDates = publishedWithDates;
  const onTimeRate = totalWithDates > 0 ? Math.round((onTimeProjects / totalWithDates) * 100) : 0;

  const growthMetrics = [
    { label: "Web & Software", value: projectCompletionRate, color: "#f43f5e", track: "#fee2e2" },
    { label: "Customer Growth", value: Math.min(customerGrowthRate, 100), color: "#10b981", track: "#d1fae5" },
    { label: "On-time Projects", value: Math.max(onTimeRate, 10), color: "#0ea5e9", track: "#e0f2fe" },
  ];

  return {
    activeProjects,
    totalClients,
    pendingTasks: pendingInvoices,
    totalRevenue: Math.round(currentRevenue),
    statsDelta: {
      activeProjects: calcDelta(activeProjects, prevActiveProjects),
      totalClients: calcDelta(totalClients, prevTotalClients),
      pendingTasks: calcDelta(pendingInvoices, prevPendingInvoices),
      totalRevenue: calcDelta(currentRevenue, prevRevenue),
    },
    revenueMonthly,
    growthMetrics,
  };
}
