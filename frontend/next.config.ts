// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   // Keep your existing Turbopack config if you have one
//   turbopack: {
//     root: __dirname,
//   },
//   // Add this to allow your phone to connect to the dev server
//   devIndicators: {
//     appIsrStatus: true,
//     buildActivity: true,
//   },
//   // THIS IS THE FIX FOR YOUR ERROR:
//   images: {
//     remotePatterns: [],
//   },
//   // If your version of Next.js supports this directly:
//   // (Note: Newer Next.js versions handle this via the host header)
// };

// // If the specific "allowedDevOrigins" error persists, try this:
// // Next.js often expects you to run the dev server specifically bound to 0.0.0.0
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  devIndicators: {
    
  },
}
export default nextConfig;