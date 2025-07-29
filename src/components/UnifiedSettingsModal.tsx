'use client'

import { useState, useEffect } from 'react'
import { X, Download, Upload, Trash2, Heart, Shield, Settings, Sparkles, FileText, RotateCcw, Cloud, CloudOff, RefreshCw, AlertTriangle, CheckCircle, Github, HardDrive, Smartphone, Palette, Globe, Database, Sliders } from 'lucide-react'
import { useDiscountCodes } from '@/hooks/useDiscountCodes'
import { useCloudSync } from '@/hooks/useCloudSync'
import { useDarkMode } from '@/hooks/useDarkMode'
import { exportCodes, importCodes } from '@/utils/storage'
import { loadDemoData } from '@/utils/demo-data'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeSelector } from './ThemeSelector'
import type { DeveloperSettings } from '@/types/changelog'
import type { ConflictResolution } from '@/types/cloud-sync'

interface UnifiedSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onAdvancedReleaseNotes?: () => void
  onRestartTutorial?: () => void
  onManualSync?: () => Promise<boolean>
  initialTab?: SettingsTab
}

type SettingsTab = 'general' | 'data' | 'cloud' | 'appearance' | 'advanced'

export function UnifiedSettingsModal({
  isOpen,
  onClose,
  onAdvancedReleaseNotes,
  onRestartTutorial,
  onManualSync,
  initialTab = 'general'
}: UnifiedSettingsModalProps) {
  const { t } = useTranslation()
  const { codes } = useDiscountCodes()
  const cloudSync = useCloudSync()
  const { theme, setThemeMode, isDark } = useDarkMode()
  
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab)
  
  // Reset to initial tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab)
    }
  }, [isOpen, initialTab])
  const [showProviderSetup, setShowProviderSetup] = useState(false)
  const [githubToken, setGithubToken] = useState('')
  const [isTokenVisible, setIsTokenVisible] = useState(false)

  // Developer settings
  const [developerSettings, setDeveloperSettings] = useState<DeveloperSettings>(() => {
    try {
      const saved = localStorage.getItem('qcode-developer-settings')
      return saved ? JSON.parse(saved) : {
        showAdvancedReleaseNotes: false,
        enableChangelogPopup: true
      }
    } catch {
      return {
        showAdvancedReleaseNotes: false,
        enableChangelogPopup: true
      }
    }
  })

  const updateDeveloperSettings = (updates: Partial<DeveloperSettings>) => {
    const newSettings = { ...developerSettings, ...updates }
    setDeveloperSettings(newSettings)
    localStorage.setItem('qcode-developer-settings', JSON.stringify(newSettings))
  }

  // Data Management functions
  const handleExport = () => {
    const exportData = exportCodes(codes)
    const blob = new Blob([exportData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qcode-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedCodes = importCodes(content)
        
        // Save imported codes
        localStorage.setItem('qcode-discount-codes', JSON.stringify(importedCodes))
        window.location.reload()
      } catch (error) {
        alert(t('errors.importFailed', 'Error importing: ') + (error as Error).message)
      }
    }
    reader.readAsText(file)
  }

  const handleClearAll = () => {
    if (confirm(t('confirmDialog.deleteAllCodes'))) {
      localStorage.removeItem('qcode-discount-codes')
      window.location.reload()
    }
  }

  // Cloud Sync functions
  const handleManualSync = async () => {
    if (onManualSync) {
      await onManualSync()
    }
  }

  const handleAddGithubProvider = () => {
    if (githubToken.trim()) {
      cloudSync.addGitHubProvider(githubToken.trim())
      setGithubToken('')
      setShowProviderSetup(false)
    }
  }

  const handleToggleProvider = (providerId: string) => {
    const currentEnabled = cloudSync.syncSettings.enabledProviders
    const newEnabled = currentEnabled.includes(providerId)
      ? currentEnabled.filter(id => id !== providerId)
      : [...currentEnabled, providerId]
    
    cloudSync.saveSyncSettings({
      ...cloudSync.syncSettings,
      enabledProviders: newEnabled
    })
  }

  const handleConflictResolutionChange = (resolution: ConflictResolution) => {
    cloudSync.saveSyncSettings({
      ...cloudSync.syncSettings,
      conflictResolution: resolution
    })
  }

  const handleAutoSyncToggle = () => {
    cloudSync.saveSyncSettings({
      ...cloudSync.syncSettings,
      autoSync: !cloudSync.syncSettings.autoSync
    })
  }

  const handleSyncIntervalChange = (interval: number) => {
    cloudSync.saveSyncSettings({
      ...cloudSync.syncSettings,
      syncInterval: interval
    })
  }

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'github-gist':
        return <Github className="w-4 h-4" />
      case 'local-cloud':
        return <HardDrive className="w-4 h-4" />
      case 'file-system':
        return <Smartphone className="w-4 h-4" />
      default:
        return <Cloud className="w-4 h-4" />
    }
  }

  const getStatusIcon = () => {
    if (cloudSync.syncStatus.isSyncing) {
      return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
    }
    if (!cloudSync.syncStatus.isOnline) {
      return <CloudOff className="w-5 h-5 text-gray-400" />
    }
    if (cloudSync.syncStatus.error) {
      return <AlertTriangle className="w-5 h-5 text-red-500" />
    }
    if (cloudSync.syncStatus.lastSync) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    }
    return <Cloud className="w-5 h-5 text-gray-500" />
  }

  if (!isOpen) return null

  const tabs = [
    { id: 'general' as SettingsTab, label: t('settings.tabs.general', 'General'), icon: Settings },
    { id: 'data' as SettingsTab, label: t('settings.tabs.data', 'Data Management'), icon: Database },
    { id: 'cloud' as SettingsTab, label: t('settings.tabs.cloud', 'Cloud Sync'), icon: Cloud },
    { id: 'appearance' as SettingsTab, label: t('settings.tabs.appearance', 'Appearance'), icon: Palette },
    { id: 'advanced' as SettingsTab, label: t('settings.tabs.advanced', 'Advanced'), icon: Sliders },
  ]

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="theme-card rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-white/10 dark:border-white/20 flex flex-col lg:flex-row">
        {/* Mobile Header with Tab Navigation */}
        <div className="lg:hidden border-b border-[var(--settings-sidebar-border)] p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold theme-text-primary">{t('settings.title')}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile Tab Navigation - Horizontal Scrolling */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap min-h-[44px] ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[var(--settings-active-bg)] to-blue-500 text-white shadow-lg border-2 border-[var(--settings-active-border)]'
                      : 'theme-text-secondary hover:theme-text-primary hover:bg-white/50 dark:hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <tab.icon size={16} className={activeTab === tab.id ? 'text-white' : ''} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Sidebar Navigation */}
        <div className="hidden lg:block w-64 bg-gradient-to-b from-[var(--settings-sidebar-bg)] to-[var(--filter-bg)] border-r border-[var(--settings-sidebar-border)] p-4">
          <div className="flex items-center mb-6">
            <h2 className="text-lg font-semibold theme-text-primary">{t('settings.title')}</h2>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform min-h-[44px] ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[var(--settings-active-bg)] to-blue-500 text-white shadow-lg scale-105 border-2 border-[var(--settings-active-border)]'
                    : 'theme-text-secondary hover:theme-text-primary hover:bg-white/50 dark:hover:bg-white/10 hover:scale-102 hover:shadow-md'
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-white' : ''} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto relative">
          {/* Desktop Close Button */}
          <button
            onClick={onClose}
            className="hidden lg:block absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl min-h-[44px] min-w-[44px]"
          >
            <X size={20} />
          </button>
          <div className="p-3 sm:p-4 lg:p-6 lg:pr-16">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold theme-text-primary mb-2">{t('settings.about.aboutApp')}</h3>
                  <p className="text-sm theme-text-secondary">{t('settings.about.aboutText')}</p>
                </div>

                <div className="text-center py-8">
                  <div className="bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold theme-text-primary mb-2">{t('common.appName')}</h3>
                  <p className="theme-text-secondary mb-1">{t('settings.about.version')}</p>
                  <p className="text-sm theme-text-muted">
                    {t('settings.about.subtitle')}
                  </p>
                </div>

                <div className="theme-filter rounded-lg p-4">
                  <h4 className="font-medium theme-text-primary mb-2 flex items-center gap-2">
                    <Shield size={16} />
                    {t('settings.about.privacy')}
                  </h4>
                  <ul className="text-sm theme-text-secondary space-y-1">
                    <li>• {t('settings.about.privacyPoints.0')}</li>
                    <li>• {t('settings.about.privacyPoints.1')}</li>
                    <li>• {t('settings.about.privacyPoints.2')}</li>
                    <li>• {t('settings.about.privacyPoints.3')}</li>
                  </ul>
                </div>

                {onRestartTutorial && (
                  <div className="theme-filter rounded-lg p-4">
                    <h4 className="font-medium theme-text-primary mb-2 flex items-center gap-2">
                      <RotateCcw size={16} />
                      {t('settings.about.tutorial', 'Tutorial')}
                    </h4>
                    <p className="text-sm theme-text-secondary mb-3">
                      {t('settings.about.tutorialDescription', 'Take the app tour again to learn about all features.')}
                    </p>
                    <button
                      onClick={() => {
                        onClose()
                        onRestartTutorial()
                      }}
                      className="flex items-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium min-h-[44px] touch-manipulation"
                    >
                      <RotateCcw size={16} />
                      {t('onboarding.navigation.restart', 'Restart Tutorial')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Data Management Tab */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold theme-text-primary mb-2">{t('settings.export.title')}</h3>
                  <p className="text-sm theme-text-secondary mb-4">{t('settings.export.subtitle')}</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 border border-blue-300 dark:border-blue-500 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-blue-100">
                        {t('settings.export.codesFound', { count: codes.length })}
                      </p>
                      <p className="text-sm text-slate-800 dark:text-blue-200">
                        {t('settings.export.including')}
                      </p>
                    </div>
                    <button
                      onClick={handleExport}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-4 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 min-h-[44px] touch-manipulation"
                    >
                      <Download size={16} />
                      {t('settings.export.exportButton')}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold theme-text-primary mb-2">{t('settings.import.title')}</h3>
                  <p className="text-sm theme-text-secondary mb-4">{t('settings.import.subtitle')}</p>
                </div>

                <div className="space-y-3">
                  <div className="theme-code-display border-2 border-dashed rounded-lg p-4 sm:p-6 text-center">
                    <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500 mb-3 sm:mb-4" />
                    <label htmlFor="import-file" className="cursor-pointer">
                      <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold px-4 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 min-h-[44px] touch-manipulation">
                        <Upload size={16} />
                        {t('settings.import.selectButton')}
                      </span>
                      <input
                        id="import-file"
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm theme-text-muted mt-2">
                      {t('settings.import.onlyJson')}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-pink-100 dark:from-red-900/40 dark:to-pink-900/40 border border-red-300 dark:border-red-500 rounded-xl p-4 shadow-lg">
                    <h4 className="font-semibold text-slate-900 dark:text-red-100 mb-2">{t('settings.import.dangerTitle')}</h4>
                    <p className="text-sm text-slate-800 dark:text-red-200 mb-3">
                      {t('settings.import.dangerSubtitle')}
                    </p>
                    <button
                      onClick={handleClearAll}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold px-4 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 min-h-[44px] touch-manipulation"
                    >
                      <Trash2 size={16} />
                      {t('settings.import.clearButton')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Cloud Sync Tab */}
            {activeTab === 'cloud' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold theme-text-primary mb-2">{t('cloudSync.title')}</h3>
                  <p className="text-sm theme-text-secondary">{t('cloudSync.subtitle')}</p>
                </div>

                {/* Sync Status */}
                <div className="space-y-3">
                  <h4 className="text-lg font-medium theme-text-primary">{t('cloudSync.status.title')}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
                      <div className="text-sm theme-text-secondary">{t('cloudSync.status.label')}</div>
                      <div className="font-medium theme-text-primary">
                        {cloudSync.syncStatus.isSyncing ? t('cloudSync.status.syncing') :
                         !cloudSync.syncStatus.isOnline ? t('cloudSync.status.offline') :
                         cloudSync.syncStatus.error ? t('cloudSync.status.error') :
                         cloudSync.syncStatus.lastSync ? t('cloudSync.status.synced') : t('cloudSync.status.notSynced')}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-4 rounded-xl border border-green-200 dark:border-green-700">
                      <div className="text-sm theme-text-secondary">{t('cloudSync.status.lastSync')}</div>
                      <div className="font-medium theme-text-primary">
                        {cloudSync.syncStatus.lastSync
                          ? cloudSync.syncStatus.lastSync.toLocaleString()
                          : t('cloudSync.status.never')
                        }
                      </div>
                    </div>
                  </div>
                  
                  {cloudSync.syncStatus.error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <div className="text-red-800 dark:text-red-400 text-sm">
                        {cloudSync.syncStatus.error}
                      </div>
                    </div>
                  )}

                  {cloudSync.syncStatus.conflictCount > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                      <div className="text-amber-800 dark:text-amber-400 text-sm">
                        {cloudSync.syncStatus.conflictCount} {t('cloudSync.status.conflictsNeedResolution')}
                      </div>
                    </div>
                  )}
                </div>

                {/* Manual Sync */}
                <div className="space-y-3">
                  <h4 className="text-lg font-medium theme-text-primary">{t('cloudSync.manualSync.title')}</h4>
                  <button
                    onClick={handleManualSync}
                    disabled={cloudSync.syncStatus.isSyncing || !cloudSync.syncStatus.isOnline}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-h-[44px] touch-manipulation"
                  >
                    <RefreshCw className={`w-4 h-4 ${cloudSync.syncStatus.isSyncing ? 'animate-spin' : ''}`} />
                    {cloudSync.syncStatus.isSyncing ? t('cloudSync.status.syncing') : t('cloudSync.manualSync.syncNow')}
                  </button>
                </div>

                {/* Auto Sync Settings */}
                <div className="space-y-3">
                  <h4 className="text-lg font-medium theme-text-primary">{t('cloudSync.autoSync.title')}</h4>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cloudSync.syncSettings.autoSync}
                        onChange={handleAutoSyncToggle}
                        className="w-5 h-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500 touch-manipulation"
                      />
                      <span className="theme-text-primary">{t('cloudSync.autoSync.enableAutoSync')}</span>
                    </label>
                    
                    {cloudSync.syncSettings.autoSync && (
                      <div>
                        <label className="block text-sm font-medium theme-text-primary mb-2">
                          {t('cloudSync.autoSync.syncInterval')}
                        </label>
                        <select
                          value={cloudSync.syncSettings.syncInterval}
                          onChange={(e) => handleSyncIntervalChange(Number(e.target.value))}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white min-h-[44px] touch-manipulation"
                        >
                          <option value={5}>{t('cloudSync.autoSync.intervals.5min')}</option>
                          <option value={15}>{t('cloudSync.autoSync.intervals.15min')}</option>
                          <option value={30}>{t('cloudSync.autoSync.intervals.30min')}</option>
                          <option value={60}>{t('cloudSync.autoSync.intervals.1hour')}</option>
                          <option value={240}>{t('cloudSync.autoSync.intervals.4hours')}</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Conflict Resolution */}
                <div className="space-y-3">
                  <h4 className="text-lg font-medium theme-text-primary">{t('cloudSync.conflictResolution.title')}</h4>
                  <div className="space-y-2">
                    {(['local', 'remote', 'merge'] as ConflictResolution[]).map((resolution) => (
                      <label key={resolution} className="flex items-center gap-3 py-2 cursor-pointer">
                        <input
                          type="radio"
                          name="conflictResolution"
                          value={resolution}
                          checked={cloudSync.syncSettings.conflictResolution === resolution}
                          onChange={() => handleConflictResolutionChange(resolution)}
                          className="w-5 h-5 text-blue-500 border-gray-300 focus:ring-blue-500 touch-manipulation"
                        />
                        <span className="theme-text-primary">
                          {t(`cloudSync.conflictResolution.${resolution}`)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cloud Providers */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium theme-text-primary">{t('cloudSync.providers.title')}</h4>
                    <button
                      onClick={() => setShowProviderSetup(!showProviderSetup)}
                      className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                    >
                      {t('cloudSync.providers.addProvider')}
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {cloudSync.providers.map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/30 rounded-xl border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-3">
                          {getProviderIcon(provider.id)}
                          <span className="font-medium theme-text-primary">{provider.name}</span>
                        </div>
                        <label className="flex items-center gap-2 py-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cloudSync.syncSettings.enabledProviders.includes(provider.id)}
                            onChange={() => handleToggleProvider(provider.id)}
                            className="w-5 h-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500 touch-manipulation"
                          />
                          <span className="text-sm theme-text-secondary">{t('cloudSync.providers.enabled')}</span>
                        </label>
                      </div>
                    ))}
                  </div>

                  {showProviderSetup && (
                    <div className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl p-6 space-y-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20">
                      <h4 className="font-medium theme-text-primary">{t('cloudSync.providers.githubSetup.title')}</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium theme-text-primary mb-1">
                            {t('cloudSync.providers.githubSetup.tokenLabel')}
                          </label>
                          <div className="relative">
                            <input
                              type={isTokenVisible ? 'text' : 'password'}
                              value={githubToken}
                              onChange={(e) => setGithubToken(e.target.value)}
                              placeholder={t('cloudSync.providers.githubSetup.tokenPlaceholder')}
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white pr-12 min-h-[44px] touch-manipulation"
                            />
                            <button
                              type="button"
                              onClick={() => setIsTokenVisible(!isTokenVisible)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
                            >
                              {isTokenVisible ? '👁️' : '👁️‍🗨️'}
                            </button>
                          </div>
                          <p className="text-xs theme-text-muted mt-1">
                            {t('cloudSync.providers.githubSetup.tokenHelp')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleAddGithubProvider}
                            disabled={!githubToken.trim()}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-h-[44px] touch-manipulation"
                          >
                            {t('cloudSync.providers.githubSetup.addButton')}
                          </button>
                          <button
                            onClick={() => setShowProviderSetup(false)}
                            className="bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            {t('cloudSync.providers.githubSetup.cancelButton')}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recent Events */}
                {cloudSync.syncEvents.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium theme-text-primary">{t('cloudSync.activity.title')}</h4>
                      <button
                        onClick={cloudSync.clearSyncEvents}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm"
                      >
                        {t('cloudSync.activity.clear')}
                      </button>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {cloudSync.syncEvents.map((event, index) => (
                        <div key={index} className="text-xs p-3 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/30 rounded-lg border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center gap-2">
                            <span className={`
                              inline-block w-2 h-2 rounded-full
                              ${event.type === 'sync_success' ? 'bg-green-500' :
                                event.type === 'sync_error' ? 'bg-red-500' :
                                event.type === 'conflict_detected' ? 'bg-amber-500' :
                                'bg-blue-500'}
                            `} />
                            <span className="theme-text-secondary">{event.message}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold theme-text-primary mb-2">{t('settings.appearance.title')}</h3>
                  <p className="text-sm theme-text-secondary">{t('settings.appearance.subtitle')}</p>
                </div>

                <div className="theme-filter rounded-lg p-4">
                  <h4 className="font-medium theme-text-primary mb-3 flex items-center gap-2">
                    <Palette size={16} />
                    {t('settings.appearance.theme.label')}
                  </h4>
                  <ThemeSelector />
                </div>

                <div className="theme-filter rounded-lg p-4">
                  <h4 className="font-medium theme-text-primary mb-3 flex items-center gap-2">
                    <Globe size={16} />
                    {t('settings.language.title')}
                  </h4>
                  <LanguageSwitcher />
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold theme-text-primary mb-2">{t('settings.developer.title')}</h3>
                  <p className="text-sm theme-text-secondary">{t('settings.developer.subtitle')}</p>
                </div>

                {/* Release Notes Settings */}
                <div className="theme-filter rounded-lg p-4">
                  <h4 className="font-semibold theme-text-primary mb-3 flex items-center gap-2">
                    <FileText size={16} />
                    {t('settings.developer.releaseNotes.title')}
                  </h4>
                  
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={developerSettings.showAdvancedReleaseNotes}
                        onChange={(e) => updateDeveloperSettings({ showAdvancedReleaseNotes: e.target.checked })}
                        className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 touch-manipulation"
                      />
                      <div>
                        <span className="text-sm font-medium theme-text-primary">
                          {t('settings.developer.releaseNotes.showAdvancedLabel')}
                        </span>
                        <p className="text-xs theme-text-muted">
                          {t('settings.developer.releaseNotes.showAdvancedDescription')}
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={developerSettings.enableChangelogPopup}
                        onChange={(e) => updateDeveloperSettings({ enableChangelogPopup: e.target.checked })}
                        className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 touch-manipulation"
                      />
                      <div>
                        <span className="text-sm font-medium theme-text-primary">
                          {t('settings.developer.releaseNotes.showChangelogLabel')}
                        </span>
                        <p className="text-xs theme-text-muted">
                          {t('settings.developer.releaseNotes.showChangelogDescription')}
                        </p>
                      </div>
                    </label>

                    {onAdvancedReleaseNotes && (
                      <button
                        onClick={() => {
                          onClose()
                          onAdvancedReleaseNotes()
                        }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-4 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 min-h-[44px] touch-manipulation"
                      >
                        <FileText size={16} />
                        {t('settings.developer.releaseNotes.openReleaseNotes')}
                      </button>
                    )}
                  </div>
                </div>

                {/* Sample Data */}
                <div className="theme-filter rounded-lg p-4">
                  <h4 className="font-semibold theme-text-primary mb-3 flex items-center gap-2">
                    <Sparkles size={16} />
                    {t('settings.developer.sampleData.title')}
                  </h4>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border border-purple-300 dark:border-purple-500 rounded-xl p-4 shadow-lg">
                    <h5 className="font-semibold text-slate-900 dark:text-purple-100 mb-2">
                      {t('settings.developer.sampleData.loadSampleTitle')}
                    </h5>
                    <p className="text-sm text-slate-800 dark:text-purple-200 mb-3">
                      {t('settings.developer.sampleData.loadSampleDescription')}
                    </p>
                    <button
                      onClick={() => {
                        loadDemoData()
                        window.location.reload()
                      }}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-4 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 min-h-[44px] touch-manipulation"
                    >
                      <Sparkles size={16} />
                      {t('settings.developer.sampleData.loadSampleButton')}
                    </button>
                  </div>
                </div>

                {/* Development Info */}
                <div className="theme-filter rounded-lg p-4">
                  <h4 className="font-semibold theme-text-primary mb-3">
                    {t('settings.developer.development.title')}
                  </h4>
                  <div className="space-y-2 text-sm theme-text-secondary">
                    <div className="flex justify-between">
                      <span>{t('settings.developer.development.storageUsed')}</span>
                      <span>{(JSON.stringify(localStorage).length / 1024).toFixed(2)} KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('settings.developer.development.totalCodes')}</span>
                      <span>{codes.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('settings.developer.development.userAgent')}</span>
                      <span className="truncate ml-2 max-w-xs">{navigator.userAgent.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}