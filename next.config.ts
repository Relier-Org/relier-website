import type { NextConfig } from "next";
import path from "node:path";


const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    optimizePackageImports: ["gsap"],
  },
};

export default nextConfig;
