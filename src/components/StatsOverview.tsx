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
      gradientClass: 'stat-gradient-green',
      bgClass: 'stat-bg-green'
    },
    { 
      label: 'Verlopen', 
      value: stats.expired, 
      gradientClass: 'stat-gradient-red',
      bgClass: 'stat-bg-red'
    },
    { 
      label: 'Favorieten', 
      value: stats.favorites, 
      gradientClass: 'stat-gradient-yellow',
      bgClass: 'stat-bg-yellow'
    },
    { 
      label: 'Binnenkort verlopen', 
      value: stats.expiringSoon, 
      gradientClass: 'stat-gradient-orange',
      bgClass: 'stat-bg-orange'
    },
  ]

  return (
    <div className="theme-card rounded-xl shadow-lg border p-6 mb-6 transition-all duration-300 card-hover">
      <h2 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
        Overzicht
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item) => (
          <div key={item.label} className="text-center group">
            <div className={`theme-stat-card border rounded-xl p-4 mb-3 transition-all duration-200`}>
              <div className={`${item.gradientClass} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                <span className="text-white font-bold text-lg">{item.value}</span>
              </div>
              <p className="text-sm font-medium theme-text-secondary">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-[var(--card-border)] flex justify-between text-sm">
        <span className="theme-text-secondary font-medium">
          Totaal aantal codes: <span className="theme-text-primary font-semibold">{stats.total}</span>
        </span>
        <span className="theme-text-secondary font-medium">
          Totaal gebruikt: <span className="theme-text-primary font-semibold">{stats.totalUsages}x</span>
        </span>
      </div>
    </div>
  )
}
