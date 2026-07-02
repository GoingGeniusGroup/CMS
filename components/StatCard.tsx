import { type LucideIcon } from "lucide-react";
import { Card } from "@/components/Card";

/**
 * Dashboard-style stat card. Used across every page for visual consistency:
 * a sky-tinted rounded icon on the left, the value, the label, and an
 * optional trend delta.
 */
export function StatCard({
  icon: Icon,
  value,
  label,
  delta,
  up = true,
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
  delta?: string;
  up?: boolean;
}) {
  return (
    <Card className="flex items-center gap-4 transition-shadow hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
        <Icon className="h-6 w-6" />
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="text-2xl font-bold tracking-tight text-black">
          {value}
        </span>
        <span className="text-sm text-black">{label}</span>
        {delta ? (
          <span className="mt-1 flex items-center gap-1 text-xs">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                up ? "bg-emerald-400" : "bg-rose-400"
              }`}
            />
            <span className="text-black">{delta}</span>
          </span>
        ) : null}
      </div>
    </Card>
  );
}
