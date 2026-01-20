import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* React Compiler */
  reactCompiler: true,
  
  /* Production Optimizations */
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  /* Image Configuration */
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com'], // YouTube thumbnails
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: '**.youtube.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  /* Environment Variables Validation (optional but recommended) */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  /* Output Configuration for Vercel */
  output: 'standalone', // Optimizes for serverless deployment
  
  /* Experimental Features */
  experimental: {
    optimizePackageImports: ['lucide-react'], // Optimize icon imports
  },
  
  /* Security Headers */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },
  
  /* Redirects (if needed) */
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
