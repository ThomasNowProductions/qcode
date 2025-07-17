import { UsageAnalytics } from '@/utils/analytics'
import { useTranslation } from 'react-i18next'
import { TrendingUp, Store, Tag, Activity } from 'lucide-react'

interface UsageAnalyticsCardProps {
  analytics: UsageAnalytics
}

export function UsageAnalyticsCard({ analytics }: UsageAnalyticsCardProps) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Usage Summary */}
      <div className="theme-card rounded-xl shadow-lg border p-6">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-500" />
          {t('analytics.usage.summary', 'Usage Summary')}
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <span className="theme-text-secondary">{t('analytics.usage.totalUsages', 'Total Usages')}</span>
            <span className="text-2xl font-bold text-blue-600">{analytics.totalUsages}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <span className="theme-text-secondary">{t('analytics.usage.averagePerCode', 'Average per Code')}</span>
            <span className="text-2xl font-bold text-green-600">{analytics.averageUsagePerCode.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Most Used Codes */}
      <div className="theme-card rounded-xl shadow-lg border p-6">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <Activity size={20} className="text-green-500" />
          {t('analytics.usage.mostUsed', 'Most Used Codes')}
        </h3>
        <div className="space-y-3">
          {analytics.mostUsedCodes.length > 0 ? (
            analytics.mostUsedCodes.map((item) => (
              <div key={item.code.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium theme-text-primary truncate">{item.code.store}</p>
                  <p className="text-sm theme-text-secondary truncate">{item.code.code}</p>
                  <p className="text-xs theme-text-secondary">{item.code.discount}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    {item.usageCount} {t('analytics.usage.usages', 'usages')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center theme-text-secondary py-4">
              {t('analytics.usage.noUsageData', 'No usage data available')}
            </p>
          )}
        </div>
      </div>

      {/* Usage by Store */}
      <div className="theme-card rounded-xl shadow-lg border p-6">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <Store size={20} className="text-purple-500" />
          {t('analytics.usage.byStore', 'Usage by Store')}
        </h3>
        <div className="space-y-3">
          {analytics.usageByStore.slice(0, 8).map((store) => {
            const maxUsage = Math.max(...analytics.usageByStore.map(s => s.usageCount))
            const percentage = maxUsage > 0 ? (store.usageCount / maxUsage) * 100 : 0
            return (
              <div key={store.store} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="theme-text-primary font-medium truncate">{store.store}</span>
                  <span className="theme-text-secondary">{store.usageCount} {t('analytics.usage.usages', 'usages')}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Usage by Category */}
      <div className="theme-card rounded-xl shadow-lg border p-6">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <Tag size={20} className="text-orange-500" />
          {t('analytics.usage.byCategory', 'Usage by Category')}
        </h3>
        <div className="space-y-3">
          {analytics.usageByCategory.slice(0, 8).map((category) => {
            const maxUsage = Math.max(...analytics.usageByCategory.map(c => c.usageCount))
            const percentage = maxUsage > 0 ? (category.usageCount / maxUsage) * 100 : 0
            return (
              <div key={category.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="theme-text-primary font-medium">{category.category}</span>
                  <span className="theme-text-secondary">{category.usageCount} {t('analytics.usage.usages', 'usages')}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Usage Over Time Chart */}
      <div className="theme-card rounded-xl shadow-lg border p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-500" />
          {t('analytics.usage.overTime', 'Usage Over Time (Last 30 Days)')}
        </h3>
        <div className="h-64 flex items-end justify-between gap-1 p-4">
          {analytics.usageOverTime.map((point, index) => {
            const maxUsage = Math.max(...analytics.usageOverTime.map(p => p.usageCount))
            const height = maxUsage > 0 ? (point.usageCount / maxUsage) * 100 : 0
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t-md transition-all duration-500 hover:bg-blue-600 cursor-pointer"
                  style={{ height: `${Math.max(height, 4)}%` }}
                  title={`${point.date}: ${point.usageCount} usages`}
                ></div>
                <span className="text-xs theme-text-secondary mt-2 transform -rotate-45 origin-center w-8 overflow-hidden">
                  {point.date}
                </span>
              </div>
            )
          })}
        </div>
        {analytics.usageOverTime.every(p => p.usageCount === 0) && (
          <div className="text-center py-8">
            <p className="theme-text-secondary">
              {t('analytics.usage.noTimeData', 'No usage data available for the selected period')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}