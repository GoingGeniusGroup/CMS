"use client";

import { useStatusBadge } from "./ConfigProvider";

export function StatusBadge({
  moduleKey,
  value,
  className,
}: {
  moduleKey: string;
  value: string;
  className?: string;
}) {
  const option = useStatusBadge(moduleKey, value);
  const color = option?.color ?? "#6b7280";
  const label = option?.label ?? value;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${className ?? ""}`}
      style={{ backgroundColor: `${color}1a`, color }}
    >
      {label}
    </span>
  );
}
