import { BookOpen, CheckCircle, Layers, type LucideIcon } from "lucide-react";

/**
 * Named icon registry for hero stat cards (`HeroStat.iconName`). JSON content
 * can't carry a component reference, so stats store a string key that maps
 * to a real lucide-react icon here — same approach as
 * `lib/service-category-icons.tsx` for card icons, just backed by lucide
 * directly instead of hand-rolled SVGs.
 *
 * Only the icons actually used by today's seeded hero content are registered;
 * extend this map when a new hero needs a different one.
 */
export const HERO_STAT_ICONS: Record<string, LucideIcon> = {
  layers: Layers,
  "check-circle": CheckCircle,
  "book-open": BookOpen,
};

export function getHeroStatIcon(name?: string): LucideIcon | null {
  if (!name) return null;
  return HERO_STAT_ICONS[name] ?? null;
}
