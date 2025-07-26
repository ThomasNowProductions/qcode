import { useState, useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import type { DiscountCode } from '@/types/discount-code'
import { useTranslation } from 'react-i18next'

interface NotificationBannerProps {
  expiringSoon: DiscountCode[]
  onCodeClick?: (codeId: string) => void
}

export function NotificationBanner({ expiringSoon, onCodeClick }: NotificationBannerProps) {
  const { t } = useTranslation()
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
    <div
      data-tutorial="notifications"
      className="theme-card rounded-xl shadow-lg border p-6 mb-6 transition-all duration-300 ring-2 ring-orange-400 dark:ring-amber-500"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <div className="bg-orange-500 dark:from-orange-500 dark:to-amber-500 p-2 rounded-lg shadow-md">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-base font-bold theme-text-primary mb-2 leading-tight">
            {visibleCodes.length === 1 
              ? t('notifications.singleExpiring', 'Discount code expiring soon') 
              : t('notifications.multipleExpiring', '{{count}} discount codes expiring soon', { count: visibleCodes.length })
            }
          </h3>
          <div className="space-y-2">
            {visibleCodes.slice(0, 3).map((code) => {
              const daysUntilExpiry = code.expiryDate 
                ? Math.ceil((code.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : 0

              return (
                <div 
                  key={code.id} 
                  className={`flex items-center justify-between py-2 px-3 theme-code-display border rounded-xl ${
                    onCodeClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors' : ''
                  }`}
                  onClick={() => onCodeClick?.(code.id)}
                  title={onCodeClick ? t('notifications.clickToJump', 'Click to jump to this code') : undefined}
                >
                  <span className="text-sm theme-text-primary">
                    <strong className="font-semibold">{code.store}</strong> 
                    <span className="font-mono text-xs ml-1">({code.code})</span> - 
                    <span className="ml-1">
                      {daysUntilExpiry === 0 ? t('notifications.expiryToday', ' expires today') : 
                       daysUntilExpiry === 1 ? t('notifications.expiryTomorrow', ' expires tomorrow') : 
                       t('notifications.expiryDays', ' expires in {{days}} days', { days: daysUntilExpiry })}
                    </span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDismissCode(code.id)
                    }}
                    className="ml-2 text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/30 p-1 rounded transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )
            })}
            {visibleCodes.length > 3 && (
              <p className="text-xs theme-text-secondary font-medium mt-2">
                {t('notifications.andMore', 'And {{count}} more...', { count: visibleCodes.length - 3 })}
              </p>
            )}
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={handleDismiss}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-200 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-300 dark:hover:bg-orange-900/50 transition-all duration-200"
          >
            <span className="sr-only">{t('common.close')}</span>
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
