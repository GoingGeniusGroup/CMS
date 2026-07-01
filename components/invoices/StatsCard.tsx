import { type LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
}

export function StatsCard({ icon: Icon, value, label }: StatsCardProps) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md sm:gap-5 sm:p-6">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-50 sm:h-16 sm:w-16">
        <Icon className="h-6 w-6 text-sky-500 sm:h-7 sm:w-7" strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#111827] sm:text-3xl">{value}</p>
        <p className="mt-0.5 text-sm text-[#6B7280]">{label}</p>
      </div>
    </div>
  );
}
