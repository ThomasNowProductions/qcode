import type { DiscountCode } from '@/types/discount-code'

const STORAGE_KEY = 'qcode-discount-codes'
const SETTINGS_KEY = 'qcode-settings'

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  expiryWarningDays: number
  autoArchiveExpired: boolean
}

export const defaultSettings: AppSettings = {
  theme: 'system',
  notifications: true,
  expiryWarningDays: 7,
  autoArchiveExpired: false,
}

// Discount Codes Storage
export const loadDiscountCodes = (): DiscountCode[] => {
  try {
    if (typeof window === 'undefined') return []
    
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const codes = JSON.parse(stored)
    return codes.map((code: any) => ({
      ...code,
      dateAdded: new Date(code.dateAdded),
      expiryDate: code.expiryDate ? new Date(code.expiryDate) : undefined,
    }))
  } catch (error) {
    console.error('Error loading discount codes:', error)
    return []
  }
}

export const saveDiscountCodes = (codes: DiscountCode[]): void => {
  try {
    if (typeof window === 'undefined') return
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(codes))
  } catch (error) {
    console.error('Error saving discount codes:', error)
  }
}

// Settings Storage
export const loadSettings = (): AppSettings => {
  try {
    if (typeof window === 'undefined') return defaultSettings
    
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (!stored) return defaultSettings
    
    return { ...defaultSettings, ...JSON.parse(stored) }
  } catch (error) {
    console.error('Error loading settings:', error)
    return defaultSettings
  }
}

export const saveSettings = (settings: AppSettings): void => {
  try {
    if (typeof window === 'undefined') return
    
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Error saving settings:', error)
  }
}

// Export/Import functionality
export const exportCodes = (codes: DiscountCode[]): string => {
  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    codes: codes,
  }
  
  return JSON.stringify(exportData, null, 2)
}

export const importCodes = (jsonData: string): DiscountCode[] => {
  try {
    const importData = JSON.parse(jsonData)
    
    if (!importData.codes || !Array.isArray(importData.codes)) {
      throw new Error('Invalid import format')
    }
    
    return importData.codes.map((code: any) => ({
      ...code,
      dateAdded: new Date(code.dateAdded || new Date()),
      expiryDate: code.expiryDate ? new Date(code.expiryDate) : undefined,
    }))
  } catch (error) {
    console.error('Error importing codes:', error)
    throw new Error('Could not import codes. Please check the file format.')
  }
}

// Backup functionality
export const createBackup = (): string => {
  const codes = loadDiscountCodes()
  const settings = loadSettings()
  
  const backup = {
    version: '1.0',
    backupDate: new Date().toISOString(),
    codes,
    settings,
  }
  
  return JSON.stringify(backup, null, 2)
}

export const restoreBackup = (backupData: string): void => {
  try {
    const backup = JSON.parse(backupData)
    
    if (backup.codes) {
      const codes = backup.codes.map((code: any) => ({
        ...code,
        dateAdded: new Date(code.dateAdded || new Date()),
        expiryDate: code.expiryDate ? new Date(code.expiryDate) : undefined,
      }))
      saveDiscountCodes(codes)
    }
    
    if (backup.settings) {
      saveSettings({ ...defaultSettings, ...backup.settings })
    }
  } catch (error) {
    console.error('Error restoring backup:', error)
    throw new Error('Could not restore backup. Please check the file format.')
  }
}

// Cleanup expired codes
export const cleanupExpiredCodes = (): number => {
  const codes = loadDiscountCodes()
  const now = new Date()
  
  const cleanedCodes = codes.filter(code => {
    if (!code.expiryDate) return true
    if (code.isArchived) return true
    
    // Remove codes expired more than 30 days ago
    const daysSinceExpiry = Math.floor(
      (now.getTime() - code.expiryDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    
    return daysSinceExpiry <= 30
  })
  
  const removedCount = codes.length - cleanedCodes.length
  
  if (removedCount > 0) {
    saveDiscountCodes(cleanedCodes)
  }
  
  return removedCount
}
