import { calculateAnalytics } from '@/utils/analytics'
import type { DiscountCode } from '@/types/discount-code'

describe('Analytics Calculations', () => {
  const now = new Date()
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
  const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
  const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000)

  const mockCodesWithUsageHistory: DiscountCode[] = [
    {
      id: '1',
      code: 'TEST20',
      store: 'TestStore',
      discount: '20%',
      category: 'Kleding',
      description: 'Test code with usage history',
      isFavorite: false,
      isArchived: false,
      dateAdded: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      timesUsed: 2,
      usageHistory: [
        { date: twoDaysAgo },
        { date: oneDayAgo }
      ]
    },
    {
      id: '2',
      code: 'FIXED10',
      store: 'TestStore',
      discount: '€10',
      category: 'Elektronica',
      description: 'Fixed amount discount',
      isFavorite: false,
      isArchived: false,
      dateAdded: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      timesUsed: 1,
      usageHistory: [
        { date: sixHoursAgo }
      ]
    },
    {
      id: '3',
      code: 'LEGACY',
      store: 'LegacyStore',
      discount: '15%',
      category: 'Anders',
      description: 'Legacy code without usage history',
      isFavorite: false,
      isArchived: false,
      dateAdded: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      timesUsed: 1
      // No usageHistory - should fall back to dateAdded for recent activity
    }
  ]

  describe('Recent Activity', () => {
    it('should use actual usage dates when available', () => {
      const analytics = calculateAnalytics(mockCodesWithUsageHistory)
      
      expect(analytics.usage.recentActivity).toHaveLength(3)
      
      // Should be sorted by most recent usage
      const firstActivity = analytics.usage.recentActivity[0]
      expect(firstActivity.code.id).toBe('2') // Most recent usage (6 hours ago)
      expect(firstActivity.lastUsed).toEqual(sixHoursAgo)
    })

    it('should fall back to dateAdded for codes without usage history', () => {
      const analytics = calculateAnalytics(mockCodesWithUsageHistory)
      
      const legacyActivity = analytics.usage.recentActivity.find(
        activity => activity.code.id === '3'
      )
      
      expect(legacyActivity?.lastUsed).toEqual(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000))
    })
  })

  describe('Savings Estimation', () => {
    it('should calculate fixed amount savings correctly', () => {
      const analytics = calculateAnalytics(mockCodesWithUsageHistory)
      
      // €10 * 1 usage = €10
      expect(analytics.savings.totalSavingsEstimate).toBeGreaterThanOrEqual(10)
    })

    it('should use configurable average purchase for percentage discounts', () => {
      const analytics = calculateAnalytics(mockCodesWithUsageHistory)
      
      // Should include: 20% * €50 * 2 uses + €10 * 1 use + 15% * €50 * 1 use
      // = €20 + €10 + €7.50 = €37.50
      expect(analytics.savings.totalSavingsEstimate).toBe(37.5)
    })
  })

  describe('Usage Over Time', () => {
    it('should track usage based on actual usage dates', () => {
      const analytics = calculateAnalytics(mockCodesWithUsageHistory)
      
      // Should have data for the last 30 days
      expect(analytics.usage.usageOverTime).toHaveLength(30)
      
      // Check that recent usage is tracked correctly
      const totalUsageTracked = analytics.usage.usageOverTime.reduce(
        (sum, day) => sum + day.usageCount, 0
      )
      
      // Should track actual usages: 2 from code 1's history + 1 from code 2's history + 1 from legacy code
      expect(totalUsageTracked).toBe(4)
      
      // Verify structure
      expect(analytics.usage.usageOverTime[0]).toHaveProperty('date')
      expect(analytics.usage.usageOverTime[0]).toHaveProperty('usageCount')
    })
  })

  describe('Backwards Compatibility', () => {
    it('should handle codes without usage history gracefully', () => {
      const codesWithoutHistory: DiscountCode[] = [
        {
          id: '1',
          code: 'OLD',
          store: 'OldStore',
          discount: '10%',
          category: 'Anders',
          description: 'Old code format',
          isFavorite: false,
          isArchived: false,
          dateAdded: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          timesUsed: 2
          // No usageHistory
        }
      ]

      expect(() => calculateAnalytics(codesWithoutHistory)).not.toThrow()
      
      const analytics = calculateAnalytics(codesWithoutHistory)
      expect(analytics.usage.totalUsages).toBe(2)
      expect(analytics.usage.recentActivity).toHaveLength(1)
    })
  })
})