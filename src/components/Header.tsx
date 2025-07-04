import { Ticket, Bell, Settings } from 'lucide-react'

interface HeaderProps {
  onNotificationClick: () => void
  onSettingsClick: () => void
}

export function Header({ onNotificationClick, onSettingsClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Ticket className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">QCode</h1>
              <p className="text-sm text-gray-600">Kortingscodes beheren</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onNotificationClick}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Bell size={20} />
            </button>
            <button 
              onClick={onSettingsClick}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
