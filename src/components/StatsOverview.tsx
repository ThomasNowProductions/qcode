interface StatsOverviewProps {
  stats: {
    total: number
    active: number
    expired: number
    favorites: number
    archived: number
    totalUsages: number
    expiringSoon: number
  }
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statItems = [
    { label: 'Actief', value: stats.active, color: 'bg-green-500' },
    { label: 'Verlopen', value: stats.expired, color: 'bg-red-500' },
    { label: 'Favorieten', value: stats.favorites, color: 'bg-yellow-500' },
    { label: 'Binnenkort verlopen', value: stats.expiringSoon, color: 'bg-orange-500' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overzicht</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item) => (
          <div key={item.label} className="text-center">
            <div className={`${item.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2`}>
              <span className="text-white font-bold text-lg">{item.value}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm text-gray-600 dark:text-gray-300">
        <span>Totaal aantal codes: {stats.total}</span>
        <span>Totaal gebruikt: {stats.totalUsages}x</span>
      </div>
    </div>
  )
}
