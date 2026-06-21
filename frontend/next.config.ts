import type { NextConfig } from "next";

// Single, clean Next.js config
const nextConfig: NextConfig = {
  // Required for Turbopack to correctly resolve the project root
  turbopack: {
    root: __dirname,
  },

  // Allows images from any remote domain (useful while using dummy/placeholder images)
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;