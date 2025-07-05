export interface CloudProvider {
  name: string
  id: string
  isEnabled: boolean
  config?: Record<string, unknown>
}

export interface SyncStatus {
  isOnline: boolean
  isSyncing: boolean
  lastSync?: Date
  error?: string
  conflictCount: number
}

export interface SyncConflict {
  id: string
  localData: unknown
  remoteData: unknown
  timestamp: Date
  resolved: boolean
}

export interface CloudSyncData {
  version: string
  lastModified: Date
  deviceId: string
  codes: unknown[]
  checksum: string
}

export interface SyncEvent {
  type: 'sync_start' | 'sync_success' | 'sync_error' | 'conflict_detected' | 'offline'
  message?: string
  data?: unknown
}

export type ConflictResolution = 'local' | 'remote' | 'merge'

export interface SyncSettings {
  autoSync: boolean
  syncInterval: number // in minutes
  enabledProviders: string[]
  conflictResolution: ConflictResolution
  lastDeviceSync: Record<string, Date>
}
