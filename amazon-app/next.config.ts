import path from 'path';  // Para el alias @
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* // Para el alias @ importacion */
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src/app');
    return config;
  },
};

export default nextConfig;
