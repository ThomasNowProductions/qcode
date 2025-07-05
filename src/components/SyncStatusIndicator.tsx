'use client'

import { Cloud, CloudOff, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react'
import { useCloudSync } from '@/hooks/useCloudSync'

interface SyncStatusIndicatorProps {
  onClick: () => void
}

export function SyncStatusIndicator({ onClick }: SyncStatusIndicatorProps) {
  const { syncStatus, syncSettings } = useCloudSync()

  const getStatusInfo = () => {
    if (syncStatus.isSyncing) {
      return {
        icon: <RefreshCw className="w-4 h-4 animate-spin" />,
        text: 'Syncing...',
        className: 'text-blue-500 hover:text-blue-600'
      }
    }

    if (!syncStatus.isOnline) {
      return {
        icon: <CloudOff className="w-4 h-4" />,
        text: 'Offline',
        className: 'text-gray-400 hover:text-gray-500'
      }
    }

    if (syncStatus.error) {
      return {
        icon: <AlertTriangle className="w-4 h-4" />,
        text: 'Sync error',
        className: 'text-red-500 hover:text-red-600'
      }
    }

    if (syncStatus.conflictCount > 0) {
      return {
        icon: <AlertTriangle className="w-4 h-4" />,
        text: `${syncStatus.conflictCount} conflicts`,
        className: 'text-amber-500 hover:text-amber-600'
      }
    }

    if (syncStatus.lastSync) {
      const timeDiff = Date.now() - syncStatus.lastSync.getTime()
      const minutes = Math.floor(timeDiff / (1000 * 60))
      
      let timeText = 'Just synced'
      if (minutes < 1) {
        timeText = 'Just synced'
      } else if (minutes < 60) {
        timeText = `${minutes}m ago`
      } else {
        const hours = Math.floor(minutes / 60)
        timeText = `${hours}h ago`
      }

      return {
        icon: <CheckCircle className="w-4 h-4" />,
        text: timeText,
        className: 'text-green-500 hover:text-green-600'
      }
    }

    if (!syncSettings.autoSync) {
      return {
        icon: <Cloud className="w-4 h-4" />,
        text: 'Auto-sync off',
        className: 'text-gray-500 hover:text-gray-600'
      }
    }

    return {
      icon: <Cloud className="w-4 h-4" />,
      text: 'Not synced',
      className: 'text-gray-500 hover:text-gray-600'
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${statusInfo.className} hover:bg-gray-100 dark:hover:bg-gray-700`}
      title="Cloud Sync Settings"
    >
      {statusInfo.icon}
      <span className="text-sm font-medium hidden sm:inline">
        {statusInfo.text}
      </span>
    </button>
  )
}
