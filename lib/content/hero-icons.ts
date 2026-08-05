import {
  Award,
  BarChart2,
  BookOpen,
  Building2,
  CheckCircle,
  Globe,
  Heart,
  Layers,
  Lightbulb,
  Rocket,
  Scale,
  Shield,
  Smile,
  Star,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Named icon registry for hero stat cards (`HeroStat.iconName`). JSON content
 * can't carry a component reference, so stats store a string key that maps
 * to a real lucide-react icon here — same approach as
 * `lib/service-category-icons.tsx` for card icons, just backed by lucide
 * directly instead of hand-rolled SVGs. Also used by card/two-column/timeline
 * sections (about-us values, why-us, mission & vision) which store icons the
 * same way.
 *
 * Only the icons actually used by today's seeded content are registered;
 * extend this map when a new section needs a different one.
 */
export const HERO_STAT_ICONS: Record<string, LucideIcon> = {
  layers: Layers,
  "check-circle": CheckCircle,
  "book-open": BookOpen,
  rocket: Rocket,
  smile: Smile,
  award: Award,
  building2: Building2,
  heart: Heart,
  users: Users,
  globe: Globe,
  star: Star,
  lightbulb: Lightbulb,
  shield: Shield,
  "trending-up": TrendingUp,
  "bar-chart-2": BarChart2,
  scale: Scale,
};

export function getHeroStatIcon(name?: string): LucideIcon | null {
  if (!name) return null;
  return HERO_STAT_ICONS[name] ?? null;
}
