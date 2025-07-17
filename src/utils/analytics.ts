import { DiscountCode } from '@/types/discount-code'
import { isAfter, isBefore, subDays, subMonths, format } from 'date-fns'

export interface AnalyticsData {
  usage: UsageAnalytics
  savings: SavingsAnalytics
  lifecycle: LifecycleAnalytics
  performance: PerformanceAnalytics
}

export interface UsageAnalytics {
  totalUsages: number
  averageUsagePerCode: number
  mostUsedCodes: Array<{ code: DiscountCode; usageCount: number }>
  usageByStore: Array<{ store: string; usageCount: number }>
  usageByCategory: Array<{ category: string; usageCount: number }>
  usageOverTime: Array<{ date: string; usageCount: number }>
  recentActivity: Array<{ code: DiscountCode; lastUsed: Date }>
}

export interface SavingsAnalytics {
  totalSavingsEstimate: number
  savingsByStore: Array<{ store: string; savings: number }>
  savingsByCategory: Array<{ category: string; savings: number }>
  averageSavingsPerCode: number
  potentialSavings: number // from unused codes
}

export interface LifecycleAnalytics {
  codesAddedThisMonth: number
  codesExpiredThisMonth: number
  averageCodeLifespan: number // in days
  expirationPattern: Array<{ month: string; expired: number; added: number }>
  upcomingExpirations: Array<{ code: DiscountCode; daysUntilExpiry: number }>
}

export interface PerformanceAnalytics {
  favoriteRatio: number
  archiveRatio: number
  activeRatio: number
  categoryDistribution: Array<{ category: string; count: number; percentage: number }>
  storeDistribution: Array<{ store: string; count: number; percentage: number }>
  codeEffectiveness: Array<{ code: DiscountCode; score: number }>
}

export function calculateAnalytics(codes: DiscountCode[]): AnalyticsData {
  return {
    usage: calculateUsageAnalytics(codes),
    savings: calculateSavingsAnalytics(codes),
    lifecycle: calculateLifecycleAnalytics(codes),
    performance: calculatePerformanceAnalytics(codes)
  }
}

function calculateUsageAnalytics(codes: DiscountCode[]): UsageAnalytics {
  const totalUsages = codes.reduce((sum, code) => sum + code.timesUsed, 0)
  const activeCodes = codes.filter(code => !code.isArchived)
  const averageUsagePerCode = activeCodes.length > 0 ? totalUsages / activeCodes.length : 0

  // Most used codes
  const mostUsedCodes = codes
    .filter(code => code.timesUsed > 0)
    .map(code => ({ code, usageCount: code.timesUsed }))
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 5)

  // Usage by store
  const storeUsage = codes.reduce((acc, code) => {
    acc[code.store] = (acc[code.store] || 0) + code.timesUsed
    return acc
  }, {} as Record<string, number>)
  
  const usageByStore = Object.entries(storeUsage)
    .map(([store, usageCount]) => ({ store, usageCount }))
    .sort((a, b) => b.usageCount - a.usageCount)

  // Usage by category
  const categoryUsage = codes.reduce((acc, code) => {
    acc[code.category] = (acc[code.category] || 0) + code.timesUsed
    return acc
  }, {} as Record<string, number>)
  
  const usageByCategory = Object.entries(categoryUsage)
    .map(([category, usageCount]) => ({ category, usageCount }))
    .sort((a, b) => b.usageCount - a.usageCount)

  // Usage over time (last 30 days)
  const usageOverTime = generateUsageOverTime(codes, 30)

  // Recent activity (codes used in last 7 days)
  const recentActivity = codes
    .filter(code => code.timesUsed > 0)
    .map(code => ({ code, lastUsed: new Date(code.dateAdded) })) // Simplified - in real app track actual usage dates
    .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
    .slice(0, 10)

  return {
    totalUsages,
    averageUsagePerCode,
    mostUsedCodes,
    usageByStore,
    usageByCategory,
    usageOverTime,
    recentActivity
  }
}

function calculateSavingsAnalytics(codes: DiscountCode[]): SavingsAnalytics {
  // Estimate savings based on usage and discount amount
  const savingsData = codes.map(code => {
    const savings = estimateSavings(code.discount) * code.timesUsed
    return { code, savings }
  })

  const totalSavingsEstimate = savingsData.reduce((sum, item) => sum + item.savings, 0)

  // Savings by store
  const storeSavings = codes.reduce((acc, code) => {
    const savings = estimateSavings(code.discount) * code.timesUsed
    acc[code.store] = (acc[code.store] || 0) + savings
    return acc
  }, {} as Record<string, number>)
  
  const savingsByStore = Object.entries(storeSavings)
    .map(([store, savings]) => ({ store, savings }))
    .sort((a, b) => b.savings - a.savings)

  // Savings by category
  const categorySavings = codes.reduce((acc, code) => {
    const savings = estimateSavings(code.discount) * code.timesUsed
    acc[code.category] = (acc[code.category] || 0) + savings
    return acc
  }, {} as Record<string, number>)
  
  const savingsByCategory = Object.entries(categorySavings)
    .map(([category, savings]) => ({ category, savings }))
    .sort((a, b) => b.savings - a.savings)

  const usedCodes = codes.filter(code => code.timesUsed > 0)
  const averageSavingsPerCode = usedCodes.length > 0 ? totalSavingsEstimate / usedCodes.length : 0

  // Potential savings from unused codes
  const unusedCodes = codes.filter(code => code.timesUsed === 0 && !isExpired(code))
  const potentialSavings = unusedCodes.reduce((sum, code) => sum + estimateSavings(code.discount), 0)

  return {
    totalSavingsEstimate,
    savingsByStore,
    savingsByCategory,
    averageSavingsPerCode,
    potentialSavings
  }
}

function calculateLifecycleAnalytics(codes: DiscountCode[]): LifecycleAnalytics {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const codesAddedThisMonth = codes.filter(code => 
    isAfter(code.dateAdded, startOfMonth) && isBefore(code.dateAdded, endOfMonth)
  ).length

  const codesExpiredThisMonth = codes.filter(code => 
    code.expiryDate && 
    isAfter(code.expiryDate, startOfMonth) && 
    isBefore(code.expiryDate, endOfMonth) &&
    isBefore(code.expiryDate, now)
  ).length

  // Average lifespan for expired codes
  const expiredCodes = codes.filter(code => code.expiryDate && isExpired(code))
  const averageCodeLifespan = expiredCodes.length > 0 
    ? expiredCodes.reduce((sum, code) => {
        const lifespan = code.expiryDate!.getTime() - code.dateAdded.getTime()
        return sum + (lifespan / (1000 * 60 * 60 * 24)) // Convert to days
      }, 0) / expiredCodes.length
    : 0

  // Expiration pattern over last 6 months
  const expirationPattern = generateExpirationPattern(codes, 6)

  // Upcoming expirations (next 30 days)
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  const upcomingExpirations = codes
    .filter(code => 
      code.expiryDate && 
      isAfter(code.expiryDate, now) && 
      isBefore(code.expiryDate, thirtyDaysFromNow)
    )
    .map(code => ({
      code,
      daysUntilExpiry: Math.floor((code.expiryDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    }))
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)

  return {
    codesAddedThisMonth,
    codesExpiredThisMonth,
    averageCodeLifespan,
    expirationPattern,
    upcomingExpirations
  }
}

function calculatePerformanceAnalytics(codes: DiscountCode[]): PerformanceAnalytics {
  const totalCodes = codes.length
  
  const favoriteRatio = totalCodes > 0 ? codes.filter(code => code.isFavorite).length / totalCodes : 0
  const archiveRatio = totalCodes > 0 ? codes.filter(code => code.isArchived).length / totalCodes : 0
  const activeRatio = totalCodes > 0 ? codes.filter(code => !code.isArchived && !isExpired(code)).length / totalCodes : 0

  // Category distribution
  const categoryCount = codes.reduce((acc, code) => {
    acc[code.category] = (acc[code.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const categoryDistribution = Object.entries(categoryCount)
    .map(([category, count]) => ({
      category,
      count,
      percentage: totalCodes > 0 ? (count / totalCodes) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count)

  // Store distribution
  const storeCount = codes.reduce((acc, code) => {
    acc[code.store] = (acc[code.store] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const storeDistribution = Object.entries(storeCount)
    .map(([store, count]) => ({
      store,
      count,
      percentage: totalCodes > 0 ? (count / totalCodes) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count)

  // Code effectiveness score (combination of usage, favorites, and not expired)
  const codeEffectiveness = codes
    .map(code => {
      let score = 0
      score += code.timesUsed * 20 // 20 points per usage
      score += code.isFavorite ? 50 : 0 // 50 points for favorite
      score += !isExpired(code) ? 30 : 0 // 30 points for not expired
      score += !code.isArchived ? 20 : 0 // 20 points for not archived
      return { code, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  return {
    favoriteRatio,
    archiveRatio,
    activeRatio,
    categoryDistribution,
    storeDistribution,
    codeEffectiveness
  }
}

// Helper functions
function estimateSavings(discount: string): number {
  // Parse discount string to estimate savings
  // This is a simplified estimation
  if (discount.includes('€')) {
    return parseFloat(discount.replace('€', '')) || 0
  } else if (discount.includes('%')) {
    const percentage = parseFloat(discount.replace('%', '')) || 0
    // Assume average purchase of €50 for percentage discounts
    return (percentage / 100) * 50
  }
  return 0
}

function isExpired(code: DiscountCode): boolean {
  if (!code.expiryDate) return false
  return isBefore(code.expiryDate, new Date())
}

function generateUsageOverTime(codes: DiscountCode[], days: number): Array<{ date: string; usageCount: number }> {
  const result = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(now, i)
    const dateStr = format(date, 'yyyy-MM-dd')
    
    // This is simplified - in a real app, you'd track actual usage dates
    // For now, we'll simulate based on code creation dates
    const usageCount = codes.filter(code => 
      format(code.dateAdded, 'yyyy-MM-dd') === dateStr
    ).reduce((sum, code) => sum + code.timesUsed, 0)
    
    result.push({ date: format(date, 'MMM dd'), usageCount })
  }
  
  return result
}

function generateExpirationPattern(codes: DiscountCode[], months: number): Array<{ month: string; expired: number; added: number }> {
  const result = []
  const now = new Date()
  
  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(now, i)
    const monthStr = format(date, 'MMM yyyy')
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    
    const added = codes.filter(code => 
      isAfter(code.dateAdded, startOfMonth) && 
      isBefore(code.dateAdded, endOfMonth)
    ).length
    
    const expired = codes.filter(code => 
      code.expiryDate &&
      isAfter(code.expiryDate, startOfMonth) && 
      isBefore(code.expiryDate, endOfMonth) &&
      isBefore(code.expiryDate, now)
    ).length
    
    result.push({ month: monthStr, expired, added })
  }
  
  return result
}