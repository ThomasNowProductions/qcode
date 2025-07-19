// Custom cache handler for Next.js incremental cache
// This helps improve build performance by persisting the cache between builds

const { createClient } = require('@vercel/kv')
const path = require('path')
const fs = require('fs')
const os = require('os')
const { execSync } = require('child_process')

// Default cache directory
const CACHE_DIR = path.join(process.cwd(), '.next', 'cache')

// Ensure cache directory exists
const ensureCacheDir = () => {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
  }
}

// Simple file-based cache handler
class CacheHandler {
  constructor(options) {
    this.options = options
    this.cacheDir = path.join(CACHE_DIR, 'incremental-cache')
    ensureCacheDir()
  }

  async get(key) {
    try {
      const filePath = this.getFilePath(key)
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8')
        return JSON.parse(data)
      }
    } catch (err) {
      console.error('Cache read error:', err)
    }
    return null
  }

  async set(key, data) {
    try {
      const filePath = this.getFilePath(key)
      fs.writeFileSync(filePath, JSON.stringify(data), 'utf8')
    } catch (err) {
      console.error('Cache write error:', err)
    }
  }

  getFilePath(key) {
    // Create a filesystem-safe key
    const safeKey = key.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    return path.join(this.cacheDir, `${safeKey}.json`)
  }
}

// Clear cache when needed
const clearCache = () => {
  try {
    if (fs.existsSync(CACHE_DIR)) {
      fs.rmSync(CACHE_DIR, { recursive: true, force: true })
      console.log('Cache cleared successfully')
    }
  } catch (err) {
    console.error('Error clearing cache:', err)
  }
}

// Export the cache handler
module.exports = class CustomCacheHandler {
  constructor(options) {
    this.handler = new CacheHandler(options)
  }

  async get(...args) {
    return this.handler.get(...args)
  }

  async set(...args) {
    return this.handler.set(...args)
  }
}

// Add a script to clear cache if needed
if (require.main === module) {
  const command = process.argv[2]
  if (command === 'clear') {
    clearCache()
  }
}
