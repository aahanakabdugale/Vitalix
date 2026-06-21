import type { NextConfig } from "next";

// Single, clean Next.js config — combines everything you need
// No duplicate declarations, no leftover commented blocks
const nextConfig: NextConfig = {
  // Required for Turbopack to correctly resolve the project root
  turbopack: {
    root: __dirname,
  },

  // Adds a trailing slash to all routes (e.g. /patients/ instead of /patients)
  trailingSlash: true,

  // Allows images from any remote domain (useful while using dummy/placeholder images)
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;