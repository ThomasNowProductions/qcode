/** @type {import('next').NextConfig} */
const nextConfig = {
  // PWA configuration will be added here when we set up next-pwa properly
  experimental: {
    turbo: {
      rules: {
        // Add any specific turbopack rules if needed
      }
    }
  }
}

module.exports = nextConfig
