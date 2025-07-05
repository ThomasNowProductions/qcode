import { usePWA } from '../hooks/usePWA'
import { Wifi, WifiOff } from 'lucide-react'

export function OfflineIndicator() {
  const { isOnline } = usePWA()

  if (isOnline) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-orange-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm mx-auto">
        <WifiOff size={20} />
        <div className="flex-1">
          <p className="font-medium text-sm">Offline modus</p>
          <p className="text-xs opacity-90">Je wijzigingen worden gesynchroniseerd zodra je weer online bent</p>
        </div>
      </div>
    </div>
  )
}

export function OnlineStatusBanner() {
  const { isOnline } = usePWA()

  return (
    <div className={`transition-all duration-300 ${isOnline ? 'h-0 overflow-hidden' : 'h-auto'}`}>
      <div className="bg-orange-100 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-800 px-4 py-3">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <WifiOff size={20} className="text-orange-600 dark:text-orange-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
              Geen internetverbinding
            </p>
            <p className="text-xs text-orange-700 dark:text-orange-300">
              Je kunt nog steeds kortingscodes bekijken en toevoegen. Alles wordt gesynchroniseerd zodra je weer online bent.
            </p>
          </div>
          <Wifi size={16} className="text-orange-400 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
