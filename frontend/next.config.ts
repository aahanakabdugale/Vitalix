import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tells Next.js that THIS folder is the project root
  // Fixes the "multiple lockfiles" warning by setting Turbopack root
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;