import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from Unsplash and other CDNs used in the app
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
};

export default nextConfig;
