import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['@genkit-ai/core', 'genkit', '@genkit-ai/googleai'],
  webpack: (config, { isServer }) => {
    // Handle webpack warnings for client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    
    // Silence noisy optional deps from genkit/opentelemetry in client bundles
    config.plugins = config.plugins || [];
    config.plugins.push(
      new (require('webpack')).IgnorePlugin({
        resourceRegExp: /@opentelemetry\/exporter-jaeger|@genkit-ai\/firebase|handlebars/,
      })
    );
    
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Environment variables are automatically loaded by Next.js
  // Make sure to prefix client-side variables with NEXT_PUBLIC_
};

export default nextConfig;
