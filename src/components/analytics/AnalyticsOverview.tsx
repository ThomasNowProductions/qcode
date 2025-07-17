import { AnalyticsData } from '@/utils/analytics'
import { DiscountCode } from '@/types/discount-code'
import { useTranslation } from 'react-i18next'
import { TrendingUp, DollarSign, Calendar, Star, Archive, BarChart3 } from 'lucide-react'

interface AnalyticsOverviewProps {
  analytics: AnalyticsData
  codes: DiscountCode[]
}

export function AnalyticsOverview({ analytics, codes }: AnalyticsOverviewProps) {
  const { t } = useTranslation()

  const overviewStats = [
    {
      title: t('analytics.overview.totalCodes', 'Total Codes'),
      value: codes.length,
      icon: BarChart3,
      color: 'bg-blue-500',
      trend: '+' + analytics.lifecycle.codesAddedThisMonth + ' ' + t('analytics.overview.thisMonth', 'this month')
    },
    {
      title: t('analytics.overview.totalUsages', 'Total Usages'),
      value: analytics.usage.totalUsages,
      icon: TrendingUp,
      color: 'bg-green-500',
      trend: analytics.usage.averageUsagePerCode.toFixed(1) + ' ' + t('analytics.overview.avgPerCode', 'avg per code')
    },
    {
      title: t('analytics.overview.totalSavings', 'Total Savings'),
      value: '€' + analytics.savings.totalSavingsEstimate.toFixed(0),
      icon: DollarSign,
      color: 'bg-emerald-500',
      trend: '€' + analytics.savings.potentialSavings.toFixed(0) + ' ' + t('analytics.overview.potential', 'potential')
    },
    {
      title: t('analytics.overview.expiringSoon', 'Expiring Soon'),
      value: analytics.lifecycle.upcomingExpirations.length,
      icon: Calendar,
      color: 'bg-orange-500',
      trend: analytics.lifecycle.codesExpiredThisMonth + ' ' + t('analytics.overview.expiredThisMonth', 'expired this month')
    }
  ]

  return (
    <div className="space-y-6">
      {/* Overview Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div key={index} className="theme-card rounded-xl shadow-lg border p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <IconComponent size={24} className="text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium theme-text-secondary">{stat.title}</h3>
                <p className="text-2xl font-bold theme-text-primary">{stat.value}</p>
                <p className="text-xs theme-text-secondary">{stat.trend}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Codes */}
        <div className="theme-card rounded-xl shadow-lg border p-6">
          <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
            <Star size={20} className="text-yellow-500" />
            {t('analytics.overview.topCodes', 'Top Performing Codes')}
          </h3>
          <div className="space-y-3">
            {analytics.performance.codeEffectiveness.slice(0, 5).map((item) => (
              <div key={item.code.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium theme-text-primary truncate">{item.code.store}</p>
                  <p className="text-sm theme-text-secondary truncate">{item.code.code}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold theme-text-primary">{item.score}</p>
                  <p className="text-xs theme-text-secondary">score</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="theme-card rounded-xl shadow-lg border p-6">
          <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-500" />
            {t('analytics.overview.categoryDistribution', 'Category Distribution')}
          </h3>
          <div className="space-y-3">
            {analytics.performance.categoryDistribution.slice(0, 5).map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="theme-text-primary font-medium">{category.category}</span>
                  <span className="theme-text-secondary">{category.count} ({category.percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Usage Trend Chart */}
      <div className="theme-card rounded-xl shadow-lg border p-6">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-green-500" />
          {t('analytics.overview.usageTrend', 'Usage Trend (Last 30 Days)')}
        </h3>
        <div className="h-64 flex items-end justify-between gap-2 p-4">
          {analytics.usage.usageOverTime.map((point, pointIndex) => {
            const maxUsage = Math.max(...analytics.usage.usageOverTime.map(p => p.usageCount))
            const height = maxUsage > 0 ? (point.usageCount / maxUsage) * 100 : 0
            return (
              <div key={pointIndex} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t-md transition-all duration-500 hover:bg-blue-600"
                  style={{ height: `${Math.max(height, 4)}%` }}
                  title={`${point.date}: ${point.usageCount} usages`}
                ></div>
                <span className="text-xs theme-text-secondary mt-2 transform -rotate-45 origin-center">
                  {point.date}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="theme-card rounded-xl shadow-lg border p-6">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <Archive size={20} className="text-purple-500" />
          {t('analytics.overview.recentActivity', 'Recent Activity')}
        </h3>
        <div className="space-y-3">
          {analytics.usage.recentActivity.slice(0, 8).map((activity) => (
            <div key={activity.code.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="font-medium theme-text-primary truncate">{activity.code.store}</p>
                <p className="text-sm theme-text-secondary truncate">{activity.code.code}</p>
              </div>
              <div className="text-right">
                <p className="text-sm theme-text-secondary">
                  {activity.code.timesUsed} {t('analytics.overview.usages', 'usages')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}