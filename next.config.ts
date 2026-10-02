import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // In development, replaced photos show up straight away instead of after the cache expires.
    minimumCacheTTL: process.env.NODE_ENV === "production" ? 14400 : 1,
    qualities: [60, 75, 85],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Old URLs from the prototype: "Experiences" became "Tours", Services moved into About,
  // Nairobi became Nairobi National Park and Lamu is not on the client's list.
  async redirects() {
    return [
      { source: "/experiences", destination: "/tours", permanent: true },
      { source: "/experiences/:slug", destination: "/tours", permanent: true },
      { source: "/services", destination: "/about#what-we-arrange", permanent: true },
      { source: "/destinations/nairobi", destination: "/destinations/nairobi-national-park", permanent: true },
      { source: "/destinations/lamu", destination: "/destinations", permanent: false },
    ];
  },
};

export default nextConfig;
