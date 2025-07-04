import { useState, useEffect } from 'react'
import { AlertTriangle, X, Bell } from 'lucide-react'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
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
    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-orange-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-orange-800">
            {visibleCodes.length === 1 
              ? 'Kortingscode verloopt binnenkort' 
              : `${visibleCodes.length} kortingscodes verlopen binnenkort`
            }
          </h3>
          <div className="mt-2 text-sm text-orange-700">
            {visibleCodes.slice(0, 3).map((code) => {
              const daysUntilExpiry = code.expiryDate 
                ? Math.ceil((code.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : 0

              return (
                <div key={code.id} className="flex items-center justify-between py-1">
                  <span>
                    <strong>{code.store}</strong> ({code.code}) - 
                    {daysUntilExpiry === 0 ? ' verloopt vandaag' : 
                     daysUntilExpiry === 1 ? ' verloopt morgen' : 
                     ` verloopt over ${daysUntilExpiry} dagen`}
                  </span>
                  <button
                    onClick={() => handleDismissCode(code.id)}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    <X size={14} />
                  </button>
                </div>
              )
            })}
            {visibleCodes.length > 3 && (
              <p className="text-xs mt-1">
                En {visibleCodes.length - 3} meer...
              </p>
            )}
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={handleDismiss}
              className="inline-flex rounded-md bg-orange-50 p-1.5 text-orange-500 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 focus:ring-offset-orange-50"
            >
              <span className="sr-only">Sluiten</span>
              <X className="h-5 w-5" />
            </button>
          </div>
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
