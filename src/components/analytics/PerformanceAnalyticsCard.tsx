import { PerformanceAnalytics } from '@/utils/analytics'
import { useTranslation } from 'react-i18next'
import { Target, Star, Archive, BarChart3, TrendingUp, Award } from 'lucide-react'

interface PerformanceAnalyticsCardProps {
  analytics: PerformanceAnalytics
}

export function PerformanceAnalyticsCard({ analytics }: PerformanceAnalyticsCardProps) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Performance Overview */}
      <div className="theme-card rounded-xl shadow-lg border p-6">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <Target size={20} className="text-blue-500" />
          {t('analytics.performance.overview', 'Performance Overview')}
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center gap-3">
              <TrendingUp size={24} className="text-green-600" />
              <div>
                <p className="theme-text-secondary text-sm">{t('analytics.performance.activeRatio', 'Active Codes')}</p>
                <p className="text-2xl font-bold text-green-600">{(analytics.activeRatio * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
            <div className="flex items-center gap-3">
              <Star size={24} className="text-yellow-600" />
              <div>
                <p className="theme-text-secondary text-sm">{t('analytics.performance.favoriteRatio', 'Favorite Codes')}</p>
                <p className="text-2xl font-bold text-yellow-600">{(analytics.favoriteRatio * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <Archive size={24} className="text-gray-600 dark:text-gray-400" />
              <div>
                <p className="theme-text-secondary text-sm">{t('analytics.performance.archiveRatio', 'Archived Codes')}</p>
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{(analytics.archiveRatio * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Codes */}
      <div className="theme-card rounded-xl shadow-lg border p-6">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <Award size={20} className="text-gold-500" />
          {t('analytics.performance.topCodes', 'Top Performing Codes')}
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {analytics.codeEffectiveness.length > 0 ? (
            analytics.codeEffectiveness.map((item, itemIndex) => (
              <div key={item.code.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    itemIndex === 0 ? 'bg-yellow-500' :
                    itemIndex === 1 ? 'bg-gray-400' :
                    itemIndex === 2 ? 'bg-orange-600' :
                    'bg-blue-500'
                  }`}>
                    {itemIndex + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium theme-text-primary truncate">{item.code.store}</p>
                    <p className="text-sm theme-text-secondary truncate">{item.code.code}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {item.code.isFavorite && <Star size={12} className="text-yellow-500" />}
                      {item.code.isArchived && <Archive size={12} className="text-gray-500" />}
                      <span className="text-xs theme-text-secondary">{item.code.timesUsed} uses</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold theme-text-primary">{item.score}</span>
                  <p className="text-xs theme-text-secondary">score</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <Award size={48} className="mx-auto theme-text-secondary mb-2" />
              <p className="theme-text-secondary">
                {t('analytics.performance.noPerformanceData', 'No performance data available yet')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="theme-card rounded-xl shadow-lg border p-6">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <BarChart3 size={20} className="text-purple-500" />
          {t('analytics.performance.categoryDistribution', 'Category Distribution')}
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {analytics.categoryDistribution.map((category) => (
            <div key={category.category} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="theme-text-primary font-medium">{category.category}</span>
                <span className="theme-text-secondary">
                  {category.count} ({category.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Store Distribution */}
      <div className="theme-card rounded-xl shadow-lg border p-6">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <BarChart3 size={20} className="text-indigo-500" />
          {t('analytics.performance.storeDistribution', 'Store Distribution')}
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {analytics.storeDistribution.slice(0, 10).map((store) => (
            <div key={store.store} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="theme-text-primary font-medium truncate">{store.store}</span>
                <span className="theme-text-secondary">
                  {store.count} ({store.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${store.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics Chart */}
      <div className="theme-card rounded-xl shadow-lg border p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <Target size={20} className="text-emerald-500" />
          {t('analytics.performance.metricsBreakdown', 'Performance Metrics Breakdown')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active vs Inactive */}
          <div className="text-center">
            <h4 className="font-semibold theme-text-primary mb-4">
              {t('analytics.performance.activeStatus', 'Active Status')}
            </h4>
            <div className="relative mx-auto w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  className="theme-text-secondary opacity-20"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#10B981"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${analytics.activeRatio * 314} 314`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold theme-text-primary">
                  {(analytics.activeRatio * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <p className="text-sm theme-text-secondary mt-2">
              {t('analytics.performance.activeCodes', 'Active Codes')}
            </p>
          </div>

          {/* Favorites */}
          <div className="text-center">
            <h4 className="font-semibold theme-text-primary mb-4">
              {t('analytics.performance.favoriteStatus', 'Favorite Status')}
            </h4>
            <div className="relative mx-auto w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  className="theme-text-secondary opacity-20"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#F59E0B"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${analytics.favoriteRatio * 314} 314`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold theme-text-primary">
                  {(analytics.favoriteRatio * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <p className="text-sm theme-text-secondary mt-2">
              {t('analytics.performance.favoriteCodes', 'Favorite Codes')}
            </p>
          </div>

          {/* Archived */}
          <div className="text-center">
            <h4 className="font-semibold theme-text-primary mb-4">
              {t('analytics.performance.archivedStatus', 'Archived Status')}
            </h4>
            <div className="relative mx-auto w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  className="theme-text-secondary opacity-20"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#6B7280"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${analytics.archiveRatio * 314} 314`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold theme-text-primary">
                  {(analytics.archiveRatio * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <p className="text-sm theme-text-secondary mt-2">
              {t('analytics.performance.archivedCodes', 'Archived Codes')}
            </p>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="theme-card rounded-xl shadow-lg border p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-cyan-500" />
          {t('analytics.performance.insights', 'Performance Insights')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
              {t('analytics.performance.codeUsage', 'Code Usage')}
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {analytics.activeRatio > 0.7
                ? t('analytics.performance.goodUsage', 'Great! Most of your codes are active and ready to use.')
                : t('analytics.performance.improveUsage', 'Consider using more of your codes to maximize savings.')
              }
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
              {t('analytics.performance.favoriteStrategy', 'Favorite Strategy')}
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {analytics.favoriteRatio > 0.2
                ? t('analytics.performance.goodFavorites', 'You have a good balance of favorite codes for quick access.')
                : t('analytics.performance.moreFavorites', 'Consider marking frequently used codes as favorites.')
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}