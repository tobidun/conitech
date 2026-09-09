import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config) => {
    config.externals = [...config.externals, { "pg-native": "commonjs pg-native" }];
    config.resolve.alias = {
      ...config.resolve.alias,
      "reflect-metadata": "reflect-metadata",
    };
    return config;
  },
};

export default nextConfig;
