import { Ticket, Bell, Settings, Moon, Sun } from 'lucide-react'
import { useDarkMode } from '../hooks/useDarkMode'

interface HeaderProps {
  onNotificationClick: () => void
  onSettingsClick: () => void
}

export function Header({ onNotificationClick, onSettingsClick }: HeaderProps) {
  const { isDark, toggleDarkMode } = useDarkMode()

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Ticket className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">QCode</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Kortingscodes beheren</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label={isDark ? 'Schakel naar licht thema' : 'Schakel naar donker thema'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={onNotificationClick}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="Notificaties"
            >
              <Bell size={20} />
            </button>
            <button 
              onClick={onSettingsClick}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="Instellingen"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
