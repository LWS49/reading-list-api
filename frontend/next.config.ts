import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable CSS imports from node_modules for Tailwind v4
    cssChunking: 'strict',
  },
};

export default nextConfig;
