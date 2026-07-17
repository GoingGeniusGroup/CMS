// Central image registry — all public assets referenced in one place.
// Import this file wherever you need landing page images.

export const images = {
  // Logos
  logo: "/logo.png",
  logo1: "/logo1.png",
  logo2: "/logo2.png",
  logoBlackBg: "/Logo_Black_BG.png",

  // Hero / General
  picture1: "/picture1.png",
  background: "/Background.png",
  web: "/web.png",

  // Frames / Sections
  frame1: "/frame1.png",
  frame2: "/frame2.png",

  // Products / Projects
  topProducts: "/top-products.png",
  omniscaleAnalytics: "/OmniScaleAnalytics.png",
  container1: "/Container-1.png",
  container2: "/Container-2.png",
  component49: "/Component49.png",

  // Portfolio / Projects Hero
  projectHero: "/ProjectHero.png",
  container3: "/Container-3.png",

  // Team
  alex: "/Alex.png",
  girl: "/girl.png",

  // Tech Stack
  php: "/php.png",
  supabase: "/supabase.png",
  dotnet: "/dotnet.png",
  flutter: "/flutter.png",
  prisma: "/prisma.png",
} as const;

export type ImageKey = keyof typeof images;
