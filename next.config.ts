import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow dicebear avatar images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },
  // Reduce serverless function size on Vercel
  serverExternalPackages: ["bcryptjs"],
};

export default nextConfig;
