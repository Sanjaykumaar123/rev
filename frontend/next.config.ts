import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from Unsplash and other CDNs used in the app
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
  // Suppress ESLint/TypeScript errors during production build
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
