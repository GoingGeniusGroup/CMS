import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow dicebear avatar images
  images: {
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
