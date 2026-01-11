import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 정적 빌드: STATIC_EXPORT=true npm run build
  output: process.env.STATIC_EXPORT === 'true' ? 'export' : undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ]
  },
};

export default nextConfig;
