import { useState, useEffect } from 'react'
import { Download, X, Smartphone } from 'lucide-react'
import { usePWA } from '../hooks/usePWA'

export function InstallPrompt() {
  const { isInstallable, isInstalled, installApp } = usePWA()
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Show prompt only if installable and not dismissed
    const dismissed = localStorage.getItem('qcode-install-dismissed')
    if (isInstallable && !dismissed && !isInstalled) {
      setShowPrompt(true)
    }
  }, [isInstallable, isInstalled])

  const handleInstallClick = async () => {
    const success = await installApp()
    if (success) {
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('qcode-install-dismissed', 'true')
  }

  // Don't show if installed or not installable
  if (isInstalled || !showPrompt || !isInstallable) {
    return null
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Installeer QCode als app
          </h3>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
            Krijg snelle toegang vanaf je startscherm en gebruik de app offline. 
            Geen app store nodig!
          </p>
          <div className="mt-3 flex space-x-3">
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
            >
              <Download size={16} />
              Installeren
            </button>
            <button
              onClick={handleDismiss}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              Niet nu
            </button>
          </div>
        </div>
        <div className="ml-auto">
          <button
            onClick={handleDismiss}
            className="text-blue-400 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-400"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}


