"use client";

import { getHeroStatIcon } from "@/lib/content/hero-icons";
import { useCustomIcons } from "@/components/content/CustomIconsProvider";

/**
 * Renders an icon by name. Handles both built-in Lucide icons (from
 * `hero-icons.ts`) and custom uploaded icons (prefixed with "custom:").
 *
 * Custom icons use the format "custom:<id>" — resolved from the
 * CustomIconsProvider context.
 */
export function IconRenderer({
  name,
  className = "h-5 w-5",
  strokeWidth,
}: {
  name?: string | null;
  className?: string;
  strokeWidth?: number;
}) {
  const customIcons = useCustomIcons();

  if (!name) return null;

  // Custom icon — value stored as "custom:<id>"
  if (name.startsWith("custom:")) {
    const id = name.slice(7);
    const ci = customIcons.find((i) => i.id === id);
    if (!ci) return null;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={ci.url} alt={ci.name} className={`${className} object-contain`} />;
  }

  // Built-in Lucide icon
  const Icon = getHeroStatIcon(name);
  if (!Icon) return null;
  return <Icon className={className} strokeWidth={strokeWidth} />;
}
