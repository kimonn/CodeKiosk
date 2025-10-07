import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone build for easier deployment
  output: 'standalone',
  
  // Enable image optimization
  images: {
    unoptimized: true // Set to false if you want to use Next.js image optimization
  },
  
  // Configure trailing slashes
  trailingSlash: false,
  
  // Enable react strict mode
  reactStrictMode: true,
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
