import { DiscountCode } from '@/types/discount-code'
import { CloudSyncData, SyncConflict, ConflictResolution } from '@/types/cloud-sync'

/**
 * Generate a simple checksum for data integrity validation
 */
export function generateChecksum(data: unknown): string {
  const str = JSON.stringify(data)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * Get unique device identifier
 */
export function getDeviceId(): string {
  if (typeof window === 'undefined') return 'server'
  
  let deviceId = localStorage.getItem('qcode-device-id')
  if (!deviceId) {
    deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('qcode-device-id', deviceId)
  }
  return deviceId
}

/**
 * Create sync data package
 */
export function createSyncData(codes: DiscountCode[]): CloudSyncData {
  const syncData = {
    version: '1.0',
    lastModified: new Date(),
    deviceId: getDeviceId(),
    codes,
    checksum: ''
  }
  
  // Generate checksum after creating the base data
  syncData.checksum = generateChecksum({ codes, deviceId: syncData.deviceId })
  
  return syncData
}

/**
 * Validate sync data integrity
 */
export function validateSyncData(syncData: CloudSyncData): boolean {
  if (!syncData || !syncData.codes || !syncData.checksum) {
    return false
  }
  
  const expectedChecksum = generateChecksum({ 
    codes: syncData.codes, 
    deviceId: syncData.deviceId 
  })
  
  return expectedChecksum === syncData.checksum
}

/**
 * Detect conflicts between local and remote data
 */
export function detectConflicts(
  localCodes: DiscountCode[], 
  remoteCodes: DiscountCode[]
): SyncConflict[] {
  const conflicts: SyncConflict[] = []
  const remoteMap = new Map(remoteCodes.map(code => [code.id, code]))
  
  for (const localCode of localCodes) {
    const remoteCode = remoteMap.get(localCode.id)
    
    if (remoteCode) {
      // Check if the codes are different (excluding dateAdded for comparison)
      const localForComparison = { ...localCode }
      const remoteForComparison = { ...remoteCode }
      
      // Convert dates to timestamps for comparison
      if (localForComparison.expiryDate) {
        localForComparison.expiryDate = new Date(localForComparison.expiryDate)
      }
      if (remoteForComparison.expiryDate) {
        remoteForComparison.expiryDate = new Date(remoteForComparison.expiryDate)
      }
      
      if (JSON.stringify(localForComparison) !== JSON.stringify(remoteForComparison)) {
        conflicts.push({
          id: localCode.id,
          localData: localCode,
          remoteData: remoteCode,
          timestamp: new Date(),
          resolved: false
        })
      }
    }
  }
  
  return conflicts
}

/**
 * Resolve conflicts based on resolution strategy
 */
export function resolveConflicts(
  conflicts: SyncConflict[],
  resolution: ConflictResolution,
  localCodes: DiscountCode[],
  remoteCodes: DiscountCode[]
): DiscountCode[] {
  const resolvedCodes = new Map<string, DiscountCode>()
  
  // Start with all local codes
  localCodes.forEach(code => resolvedCodes.set(code.id, code))
  
  // Add remote codes that don't exist locally
  remoteCodes.forEach(code => {
    if (!resolvedCodes.has(code.id)) {
      resolvedCodes.set(code.id, code)
    }
  })
  
  // Resolve conflicts
  for (const conflict of conflicts) {
    const localCode = conflict.localData as DiscountCode
    const remoteCode = conflict.remoteData as DiscountCode
    
    switch (resolution) {
      case 'local':
        resolvedCodes.set(conflict.id, localCode)
        break
        
      case 'remote':
        resolvedCodes.set(conflict.id, remoteCode)
        break
        
      case 'merge':
        // Merge strategy: use the most recent data, but preserve usage count and favorites
        const mergedCode: DiscountCode = {
          ...remoteCode,
          timesUsed: Math.max(localCode.timesUsed, remoteCode.timesUsed),
          isFavorite: localCode.isFavorite || remoteCode.isFavorite,
          // Use the latest modification date
          dateAdded: localCode.dateAdded > remoteCode.dateAdded ? localCode.dateAdded : remoteCode.dateAdded
        }
        resolvedCodes.set(conflict.id, mergedCode)
        break
    }
  }
  
  return Array.from(resolvedCodes.values())
}

/**
 * Merge two arrays of discount codes, preserving the most recent version of each
 */
export function mergeCodes(
  localCodes: DiscountCode[], 
  remoteCodes: DiscountCode[]
): DiscountCode[] {
  const merged = new Map<string, DiscountCode>()
  
  // Add all local codes
  localCodes.forEach(code => merged.set(code.id, code))
  
  // Add or update with remote codes
  remoteCodes.forEach(remoteCode => {
    const localCode = merged.get(remoteCode.id)
    
    if (!localCode) {
      // New code from remote
      merged.set(remoteCode.id, remoteCode)
    } else {
      // Conflict resolution: use the one with latest dateAdded, but merge usage data
      const shouldUseRemote = remoteCode.dateAdded > localCode.dateAdded
      const mergedCode: DiscountCode = shouldUseRemote ? {
        ...remoteCode,
        timesUsed: Math.max(localCode.timesUsed, remoteCode.timesUsed),
        isFavorite: localCode.isFavorite || remoteCode.isFavorite
      } : {
        ...localCode,
        timesUsed: Math.max(localCode.timesUsed, remoteCode.timesUsed),
        isFavorite: localCode.isFavorite || remoteCode.isFavorite
      }
      
      merged.set(remoteCode.id, mergedCode)
    }
  })
  
  return Array.from(merged.values())
}

/**
 * Compare two sync data objects and determine if sync is needed
 */
export function needsSync(local: CloudSyncData, remote: CloudSyncData): boolean {
  if (!local || !remote) return true
  
  // Different checksums indicate different data
  if (local.checksum !== remote.checksum) return true
  
  // Different modification times
  if (new Date(local.lastModified).getTime() !== new Date(remote.lastModified).getTime()) {
    return true
  }
  
  return false
}

/**
 * Create a backup of sync data before performing operations
 */
export function createSyncBackup(codes: DiscountCode[]): string {
  const backup = {
    timestamp: new Date().toISOString(),
    codes,
    version: '1.0'
  }
  
  return JSON.stringify(backup)
}

/**
 * Restore from sync backup
 */
export function restoreSyncBackup(backupData: string): DiscountCode[] {
  try {
    const backup = JSON.parse(backupData)
    return backup.codes.map((code: Record<string, unknown>) => ({
      ...code,
      dateAdded: new Date(code.dateAdded as string),
      expiryDate: code.expiryDate ? new Date(code.expiryDate as string) : undefined,
    }))
  } catch (error) {
    console.error('Error restoring sync backup:', error)
    throw new Error('Invalid backup data')
  }
}
