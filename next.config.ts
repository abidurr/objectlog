import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: process.env.ENVIRONMENT === "local" ? "" : "/objectlog",
  output: "export",
  // distDir: "dist",
  assetPrefix: process.env.ENVIRONMENT === "local" ? "" : "/objectlog/",
  images: { unoptimized: true },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
