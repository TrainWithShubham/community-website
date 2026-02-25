import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export configuration for GitHub Pages
  output: 'export',
  // Required for testing using github pages
  // basePath: '/community-website',      // GitHub Pages repo path
  // assetPrefix: '/community-website/',   // Asset URL prefix
  
  // Enable proper error checking in production
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // Turbopack configuration
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            ui: {
              test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
              name: 'ui',
              chunks: 'all',
            },
          },
        },
      };
    }
    
    // Handle server-side only packages
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
    
    // Ignore optional dependencies
    config.plugins = config.plugins || [];
    config.plugins.push(
      new (require('webpack')).IgnorePlugin({
        resourceRegExp: /@opentelemetry\/exporter-jaeger|@genkit-ai\/firebase|handlebars/,
      })
    );
    
    return config;
  },
  
  // Image optimization - unoptimized for static export
  images: {
    unoptimized: true,
  },
  
  // Compression
  compress: true,
  
  // Power by header
  poweredByHeader: false,
};

export default nextConfig;
