import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 768, 1024, 1280, 1440, 1920, 2400],
    imageSizes: [64, 96, 128, 256, 384, 512],
    qualities: [70, 75, 80, 82, 90],
  },
  poweredByHeader: false,
  devIndicators: false,
};

export default nextConfig;
