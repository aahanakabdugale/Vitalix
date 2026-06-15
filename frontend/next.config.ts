import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  devIndicators: {
    buildActivity: false, // This often hides the indicator
  },
}
export default nextConfig;