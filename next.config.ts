import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    domains: ["cdn.dummyjson.com"],
    unoptimized: true,
  },
};

export default nextConfig;
