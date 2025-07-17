import { LifecycleAnalytics } from '@/utils/analytics'
import { useTranslation } from 'react-i18next'
import { Calendar, Plus, Minus, Clock, AlertTriangle } from 'lucide-react'

interface LifecycleAnalyticsCardProps {
  analytics: LifecycleAnalytics
}

export function LifecycleAnalyticsCard({ analytics }: LifecycleAnalyticsCardProps) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Lifecycle Summary */}
      <div className="theme-card rounded-xl shadow-lg border p-6">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-blue-500" />
          {t('analytics.lifecycle.summary', 'Lifecycle Summary')}
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center gap-3">
              <Plus size={24} className="text-green-600" />
              <div>
                <p className="theme-text-secondary text-sm">{t('analytics.lifecycle.addedThisMonth', 'Added This Month')}</p>
                <p className="text-2xl font-bold text-green-600">{analytics.codesAddedThisMonth}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center gap-3">
              <Minus size={24} className="text-red-600" />
              <div>
                <p className="theme-text-secondary text-sm">{t('analytics.lifecycle.expiredThisMonth', 'Expired This Month')}</p>
                <p className="text-2xl font-bold text-red-600">{analytics.codesExpiredThisMonth}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <div className="flex items-center gap-3">
              <Clock size={24} className="text-purple-600" />
              <div>
                <p className="theme-text-secondary text-sm">{t('analytics.lifecycle.averageLifespan', 'Average Lifespan')}</p>
                <p className="text-2xl font-bold text-purple-600">
                  {analytics.averageCodeLifespan > 0 
                    ? `${Math.round(analytics.averageCodeLifespan)} ${t('analytics.lifecycle.days', 'days')}`
                    : '-'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Expirations */}
      <div className="theme-card rounded-xl shadow-lg border p-6">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <AlertTriangle size={20} className="text-orange-500" />
          {t('analytics.lifecycle.upcomingExpirations', 'Upcoming Expirations')}
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {analytics.upcomingExpirations.length > 0 ? (
            analytics.upcomingExpirations.map((expiration) => (
              <div key={expiration.code.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium theme-text-primary truncate">{expiration.code.store}</p>
                  <p className="text-sm theme-text-secondary truncate">{expiration.code.code}</p>
                  <p className="text-xs theme-text-secondary">{expiration.code.discount}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    expiration.daysUntilExpiry <= 3
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      : expiration.daysUntilExpiry <= 7
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {expiration.daysUntilExpiry} {t('analytics.lifecycle.daysLeft', 'days')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <AlertTriangle size={48} className="mx-auto theme-text-secondary mb-2" />
              <p className="theme-text-secondary">
                {t('analytics.lifecycle.noUpcomingExpirations', 'No codes expiring in the next 30 days')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Expiration Pattern Chart */}
      <div className="theme-card rounded-xl shadow-lg border p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-indigo-500" />
          {t('analytics.lifecycle.expirationPattern', 'Expiration Pattern (Last 6 Months)')}
        </h3>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="theme-text-secondary">{t('analytics.lifecycle.codesAdded', 'Codes Added')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="theme-text-secondary">{t('analytics.lifecycle.codesExpired', 'Codes Expired')}</span>
            </div>
          </div>
          
          {/* Chart */}
          <div className="h-64 flex items-end justify-between gap-4 p-4">
            {analytics.expirationPattern.map((point, index) => {
              const maxValue = Math.max(
                ...analytics.expirationPattern.map(p => Math.max(p.added, p.expired))
              )
              const addedHeight = maxValue > 0 ? (point.added / maxValue) * 100 : 0
              const expiredHeight = maxValue > 0 ? (point.expired / maxValue) * 100 : 0
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="flex items-end gap-1 h-48">
                    {/* Added codes bar */}
                    <div 
                      className="w-4 bg-green-500 rounded-t-md transition-all duration-500 hover:bg-green-600"
                      style={{ height: `${Math.max(addedHeight, 4)}%` }}
                      title={`${point.month}: ${point.added} added`}
                    ></div>
                    {/* Expired codes bar */}
                    <div 
                      className="w-4 bg-red-500 rounded-t-md transition-all duration-500 hover:bg-red-600"
                      style={{ height: `${Math.max(expiredHeight, 4)}%` }}
                      title={`${point.month}: ${point.expired} expired`}
                    ></div>
                  </div>
                  <span className="text-xs theme-text-secondary text-center transform -rotate-45 origin-center">
                    {point.month}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Lifecycle Insights */}
      <div className="theme-card rounded-xl shadow-lg border p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <Clock size={20} className="text-teal-500" />
          {t('analytics.lifecycle.insights', 'Lifecycle Insights')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
              {t('analytics.lifecycle.additionTrend', 'Addition Trend')}
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {analytics.codesAddedThisMonth > 0
                ? t('analytics.lifecycle.additionTrendPositive', `You've added ${analytics.codesAddedThisMonth} codes this month. Keep it up!`)
                : t('analytics.lifecycle.additionTrendNeutral', 'Consider adding more codes to maximize your savings opportunities.')
              }
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <h4 className="font-semibold text-orange-800 dark:text-orange-400 mb-2">
              {t('analytics.lifecycle.expirationAlert', 'Expiration Alert')}
            </h4>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              {analytics.upcomingExpirations.length > 0
                ? t('analytics.lifecycle.expirationAlertWarning', `${analytics.upcomingExpirations.length} codes expire soon. Use them before they're gone!`)
                : t('analytics.lifecycle.expirationAlertGood', 'No immediate expirations. Your codes are well managed!')
              }
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <h4 className="font-semibold text-purple-800 dark:text-purple-400 mb-2">
              {t('analytics.lifecycle.lifespanTip', 'Lifespan Tip')}
            </h4>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              {analytics.averageCodeLifespan > 0
                ? t('analytics.lifecycle.lifespanTipWithData', `Average code lifespan is ${Math.round(analytics.averageCodeLifespan)} days. Plan your usage accordingly.`)
                : t('analytics.lifecycle.lifespanTipNoData', 'Add expiry dates to your codes to better track their lifecycle.')
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}