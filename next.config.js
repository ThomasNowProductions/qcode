const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
  ],
  buildExcludes: [/middleware-manifest\.json$/],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable build caching
    turbo: {
      // Enable filesystem cache for faster rebuilds
      cache: true,
      // Enable memory cache for faster rebuilds in development
      memoryCache: true,
    },
    // Enable incremental compilation for faster rebuilds
    incrementalCacheHandlerPath: require.resolve('./cache-handler.js'),
  },
  // Configure webpack cache
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      // Enable persistent caching in production
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
        cacheDirectory: '.next/cache/webpack',
        name: 'webpack',
      };
    }
    return config;
  },
  // Configure Turbopack if you're using it
  turbopack: {
    rules: {
      // Add any specific turbopack rules if needed
    },
    // Enable Turbopack's filesystem cache
    cache: true,
  }
}

module.exports = withPWA(nextConfig)
