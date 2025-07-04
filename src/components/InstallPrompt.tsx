import { useState, useEffect } from 'react'
import { Download, X, Smartphone } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isInWebAppiOS)
    }

    checkIfInstalled()

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Don't show prompt if already dismissed or installed
      const dismissed = localStorage.getItem('qcode-install-dismissed')
      if (!dismissed && !isInstalled) {
        setShowPrompt(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [isInstalled])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
      }
      
      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      console.error('Error installing app:', error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('qcode-install-dismissed', 'true')
  }

  // Don't show if installed or no prompt available
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Smartphone className="h-6 w-6 text-blue-600" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-900">
            Installeer QCode als app
          </h3>
          <p className="mt-1 text-sm text-blue-700">
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
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Niet nu
            </button>
          </div>
        </div>
        <div className="ml-auto">
          <button
            onClick={handleDismiss}
            className="text-blue-400 hover:text-blue-600"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook to detect if app is installed
export function useIsAppInstalled() {
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isInWebAppiOS)
    }

    checkIfInstalled()

    // Listen for changes in display mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    mediaQuery.addEventListener('change', checkIfInstalled)

    return () => {
      mediaQuery.removeEventListener('change', checkIfInstalled)
    }
  }, [])

  return isInstalled
}
