import { useState, useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import type { DiscountCode } from '@/types/discount-code'

interface NotificationBannerProps {
  expiringSoon: DiscountCode[]
}

export function NotificationBanner({ expiringSoon }: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [dismissedCodes, setDismissedCodes] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Show notification if there are codes expiring soon that haven't been dismissed
    const newCodes = expiringSoon.filter(code => !dismissedCodes.has(code.id))
    setIsVisible(newCodes.length > 0)
  }, [expiringSoon, dismissedCodes])

  const visibleCodes = expiringSoon.filter(code => !dismissedCodes.has(code.id))

  const handleDismiss = () => {
    // Dismiss all currently visible codes
    const newDismissed = new Set(dismissedCodes)
    visibleCodes.forEach(code => newDismissed.add(code.id))
    setDismissedCodes(newDismissed)
    setIsVisible(false)
  }

  const handleDismissCode = (codeId: string) => {
    const newDismissed = new Set(dismissedCodes)
    newDismissed.add(codeId)
    setDismissedCodes(newDismissed)
    
    // Hide banner if no more codes to show
    if (newDismissed.size >= expiringSoon.length) {
      setIsVisible(false)
    }
  }

  if (!isVisible || visibleCodes.length === 0) {
    return null
  }

  return (
    <div className="bg-white/70 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700 p-6 mb-6 transition-all duration-300 card-hover ring-2 ring-orange-400 dark:ring-amber-500">
      <div className="flex">
        <div className="flex-shrink-0">
          <div className="bg-orange-500 dark:from-orange-500 dark:to-amber-500 p-2 rounded-lg shadow-md">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-base font-bold text-gray-900 dark:text-orange-400 mb-2 leading-tight">
            {visibleCodes.length === 1 
              ? 'Kortingscode verloopt binnenkort' 
              : `${visibleCodes.length} kortingscodes verlopen binnenkort`
            }
          </h3>
          <div className="space-y-2">
            {visibleCodes.slice(0, 3).map((code) => {
              const daysUntilExpiry = code.expiryDate 
                ? Math.ceil((code.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : 0

              return (
                <div key={code.id} className="flex items-center justify-between py-2 px-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl">
                  <span className="text-sm text-gray-900 dark:text-orange-300">
                    <strong className="font-semibold">{code.store}</strong> 
                    <span className="font-mono text-xs ml-1">({code.code})</span> - 
                    <span className="ml-1">
                      {daysUntilExpiry === 0 ? ' verloopt vandaag' : 
                       daysUntilExpiry === 1 ? ' verloopt morgen' : 
                       ` verloopt over ${daysUntilExpiry} dagen`}
                    </span>
                  </span>
                  <button
                    onClick={() => handleDismissCode(code.id)}
                    className="ml-2 text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/30 p-1 rounded transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )
            })}
            {visibleCodes.length > 3 && (
              <p className="text-xs text-gray-700 dark:text-orange-400 font-medium mt-2">
                En {visibleCodes.length - 3} meer...
              </p>
            )}
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={handleDismiss}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-200 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-300 dark:hover:bg-orange-900/50 transition-all duration-200"
          >
            <span className="sr-only">Sluiten</span>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook for requesting notification permissions
export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result
    }
    return 'denied'
  }

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted' && 'Notification' in window) {
      return new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options,
      })
    }
    return null
  }

  return {
    permission,
    requestPermission,
    sendNotification,
    isSupported: 'Notification' in window,
  }
}
