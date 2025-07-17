import { SavingsAnalytics } from '@/utils/analytics'
import { useTranslation } from 'react-i18next'
import { DollarSign, TrendingUp, Store, Tag, PiggyBank } from 'lucide-react'

interface SavingsAnalyticsCardProps {
  analytics: SavingsAnalytics
}

export function SavingsAnalyticsCard({ analytics }: SavingsAnalyticsCardProps) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Savings Summary */}
      <div className="theme-card rounded-xl shadow-lg border p-6">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <DollarSign size={20} className="text-green-500" />
          {t('analytics.savings.summary', 'Savings Summary')}
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div>
              <p className="theme-text-secondary text-sm">{t('analytics.savings.totalSaved', 'Total Saved')}</p>
              <p className="text-2xl font-bold text-green-600">€{analytics.totalSavingsEstimate.toFixed(2)}</p>
            </div>
            <TrendingUp size={32} className="text-green-500" />
          </div>
          <div className="flex justify-between items-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div>
              <p className="theme-text-secondary text-sm">{t('analytics.savings.averagePerCode', 'Average per Code')}</p>
              <p className="text-2xl font-bold text-blue-600">€{analytics.averageSavingsPerCode.toFixed(2)}</p>
            </div>
            <PiggyBank size={32} className="text-blue-500" />
          </div>
          <div className="flex justify-between items-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
            <div>
              <p className="theme-text-secondary text-sm">{t('analytics.savings.potential', 'Potential Savings')}</p>
              <p className="text-2xl font-bold text-orange-600">€{analytics.potentialSavings.toFixed(2)}</p>
            </div>
            <div className="text-orange-500">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Breakdown */}
      <div className="theme-card rounded-xl shadow-lg border p-6">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-emerald-500" />
          {t('analytics.savings.breakdown', 'Savings Breakdown')}
        </h3>
        <div className="space-y-4">
          {analytics.totalSavingsEstimate > 0 ? (
            <>
              <div className="p-3 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium theme-text-primary">
                    {t('analytics.savings.realized', 'Realized Savings')}
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    €{analytics.totalSavingsEstimate.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium theme-text-primary">
                    {t('analytics.savings.unused', 'Unused Potential')}
                  </span>
                  <span className="text-lg font-bold text-orange-600">
                    €{analytics.potentialSavings.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-orange-500 h-3 rounded-full" 
                    style={{ 
                      width: `${(analytics.potentialSavings / (analytics.totalSavingsEstimate + analytics.potentialSavings)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <PiggyBank size={48} className="mx-auto theme-text-secondary mb-2" />
              <p className="theme-text-secondary">
                {t('analytics.savings.noSavings', 'No savings data available yet')}
              </p>
              <p className="text-sm theme-text-secondary mt-1">
                {t('analytics.savings.startUsing', 'Start using your codes to track savings!')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Savings by Store */}
      <div className="theme-card rounded-xl shadow-lg border p-6">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <Store size={20} className="text-purple-500" />
          {t('analytics.savings.byStore', 'Savings by Store')}
        </h3>
        <div className="space-y-3">
          {analytics.savingsByStore.filter(store => store.savings > 0).slice(0, 8).map((store) => {
            const maxSavings = Math.max(...analytics.savingsByStore.map(s => s.savings))
            const percentage = maxSavings > 0 ? (store.savings / maxSavings) * 100 : 0
            return (
              <div key={store.store} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="theme-text-primary font-medium truncate">{store.store}</span>
                  <span className="theme-text-secondary">€{store.savings.toFixed(2)}</span>
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
          {analytics.savingsByStore.every(store => store.savings === 0) && (
            <div className="text-center py-6">
              <Store size={48} className="mx-auto theme-text-secondary mb-2" />
              <p className="theme-text-secondary">
                {t('analytics.savings.noStoreData', 'No store savings data available')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Savings by Category */}
      <div className="theme-card rounded-xl shadow-lg border p-6">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <Tag size={20} className="text-indigo-500" />
          {t('analytics.savings.byCategory', 'Savings by Category')}
        </h3>
        <div className="space-y-3">
          {analytics.savingsByCategory.filter(category => category.savings > 0).slice(0, 8).map((category) => {
            const maxSavings = Math.max(...analytics.savingsByCategory.map(c => c.savings))
            const percentage = maxSavings > 0 ? (category.savings / maxSavings) * 100 : 0
            return (
              <div key={category.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="theme-text-primary font-medium">{category.category}</span>
                  <span className="theme-text-secondary">€{category.savings.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
          {analytics.savingsByCategory.every(category => category.savings === 0) && (
            <div className="text-center py-6">
              <Tag size={48} className="mx-auto theme-text-secondary mb-2" />
              <p className="theme-text-secondary">
                {t('analytics.savings.noCategoryData', 'No category savings data available')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Savings Tips */}
      <div className="theme-card rounded-xl shadow-lg border p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
          <PiggyBank size={20} className="text-yellow-500" />
          {t('analytics.savings.tips', 'Savings Tips')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
              {t('analytics.savings.tip1Title', 'Use Your Codes')}
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {t('analytics.savings.tip1', 'You have €')}
              {analytics.potentialSavings.toFixed(0)} 
              {t('analytics.savings.tip1End', ' in unused codes waiting to save you money!')}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
              {t('analytics.savings.tip2Title', 'Check Expiry Dates')}
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {t('analytics.savings.tip2', 'Make sure to use codes before they expire to maximize your savings.')}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2">
              {t('analytics.savings.tip3Title', 'Track More Codes')}
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              {t('analytics.savings.tip3', 'Add more discount codes to increase your potential savings!')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}