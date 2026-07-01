import { type LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
}

export function StatsCard({ icon: Icon, value, label }: StatsCardProps) {
  return (
    <div className="flex h-full items-center gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-[#4F46E5] sm:gap-5 sm:p-5 lg:p-6">
      {/* Icon circle — slightly smaller on mobile */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-50 sm:h-14 sm:w-14 lg:h-16 lg:w-16">
        <Icon
          className="h-5 w-5 text-sky-500 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0">
        {/* Number — scales from 20px (mobile) → 28px (sm) → 36px (lg) */}
        <p className="truncate text-xl font-bold text-[#111827] sm:text-2xl lg:text-3xl">
          {value}
        </p>
        <p className="mt-0.5 truncate text-xs text-[#6B7280] sm:text-sm">{label}</p>
      </div>
    </div>
  );
}
