// Simple cache clearing utility for Next.js
const fs = require('fs')
const path = require('path')

// Cache directories to clear
const CACHE_DIRS = [
  path.join(process.cwd(), '.next', 'cache'),
  path.join(process.cwd(), '.next', 'server')
]

// Clear cache function
const clearCache = () => {
  console.log('Clearing Next.js cache...')
  
  CACHE_DIRS.forEach(dir => {
    try {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true })
        console.log(`✓ Cleared: ${dir}`)
      } else {
        console.log(`✓ Already clean: ${dir}`)
      }
    } catch (err) {
      console.error(`Error clearing ${dir}:`, err.message)
    }
  })
  
  console.log('Cache cleared successfully!')
}

// Run clear if executed directly
if (require.main === module) {
  clearCache()
}

// Export for programmatic use
module.exports = { clearCache }
