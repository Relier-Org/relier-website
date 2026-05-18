import type { NextConfig } from "next";
import path from "node:path";


const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  // Match relier.com legacy URLs (/about/, /<post-slug>/, etc.) for SEO continuity.
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ["gsap"],
  },
};

export default nextConfig;
