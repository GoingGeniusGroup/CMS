import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow dicebear avatar images
  images: {
    // Admin-uploaded media lives on Uploadcare, which serves already-optimized
    // files (incl. extensionless URLs and animated GIFs). Next's optimizer is
    // slow/intermittently timing out fetching those (7s+ per request) and
    // freezes animated GIFs, so optimization is disabled entirely — the CDN
    // handles delivery, and browsers load the URLs directly.
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "*.ucarecdn.net",
      },
      {
        protocol: "https",
        hostname: "*.ucarecd.net",
      },
    ],
  },
  // Reduce serverless function size on Vercel
  serverExternalPackages: ["bcryptjs"],

};

export default nextConfig;
