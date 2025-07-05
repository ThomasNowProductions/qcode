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
    { 
      label: 'Actief', 
      value: stats.active, 
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200'
    },
    { 
      label: 'Verlopen', 
      value: stats.expired, 
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100',
      borderColor: 'border-red-200'
    },
    { 
      label: 'Favorieten', 
      value: stats.favorites, 
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200'
    },
    { 
      label: 'Binnenkort verlopen', 
      value: stats.expiringSoon, 
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200'
    },
  ]

  return (
    <div className="bg-white/70 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700 p-6 mb-6 transition-all duration-300 card-hover">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
        Overzicht
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item) => (
          <div key={item.label} className="text-center group">
            <div className={`bg-gradient-to-br ${item.bgColor} dark:from-gray-700 dark:to-gray-800 border ${item.borderColor} dark:border-gray-600 rounded-xl p-4 mb-3 transition-all duration-200 group-hover:scale-105`}>
              <div className={`bg-gradient-to-br ${item.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                <span className="text-white font-bold text-lg">{item.value}</span>
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700 flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-300 font-medium">
          Totaal aantal codes: <span className="text-gray-900 dark:text-white font-semibold">{stats.total}</span>
        </span>
        <span className="text-gray-600 dark:text-gray-300 font-medium">
          Totaal gebruikt: <span className="text-gray-900 dark:text-white font-semibold">{stats.totalUsages}x</span>
        </span>
      </div>
    </div>
  )
}
