'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useDiscountCodes } from '@/hooks/useDiscountCodes'
import { Header } from '@/components/Header'
import { SearchAndFilter } from '@/components/SearchAndFilter'
import { DiscountCodeCard } from '@/components/DiscountCodeCard'
import { AddCodeModal } from '@/components/AddCodeModal'
import { StatsOverview } from '@/components/StatsOverview'
import { EmptyState } from '@/components/EmptyState'
import { NotificationBanner } from '@/components/NotificationBanner'
import { InstallPrompt } from '@/components/InstallPrompt'
import { SettingsModal } from '@/components/SettingsModal'
import { OnlineStatusBanner } from '@/components/OfflineIndicator'
import type { SearchFilters, DiscountCode } from '@/types/discount-code'

export default function HomePage() {
  const {
    codes,
    isLoading,
    addCode,
    updateCode,
    deleteCode,
    toggleFavorite,
    toggleArchived,
    incrementUsage,
    isExpired,
    filterCodes,
    getStats,
    getExpiringSoon,
  } = useDiscountCodes()

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: '',
    category: 'all',
    sortBy: 'dateAdded',
    filterBy: 'all',
  })

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [showNotificationBanner, setShowNotificationBanner] = useState(true)

  const filteredCodes = filterCodes(searchFilters)
  const stats = getStats()
  const expiringSoon = getExpiringSoon()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Offline Status Banner */}
      <OnlineStatusBanner />
      
      <Header 
        onNotificationClick={() => setShowNotificationBanner(!showNotificationBanner)}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
      />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Install Prompt */}
        <InstallPrompt />

        {/* Notification Banner */}
        {showNotificationBanner && (
          <NotificationBanner expiringSoon={expiringSoon} />
        )}

        {/* Statistics Overview */}
        <StatsOverview stats={stats} />

        {/* Search and Filter */}
        <div className="mb-6">
          <SearchAndFilter
            filters={searchFilters}
            onFiltersChange={setSearchFilters}
          />
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Nieuwe kortingscode toevoegen
          </button>
        </div>

        {/* Codes List */}
        {filteredCodes.length === 0 ? (
          <EmptyState 
            hasAnyCodes={codes.length > 0}
            onAddCode={() => setIsAddModalOpen(true)}
          />
        ) : (
          <div className="space-y-4">
            {filteredCodes.map((code) => (
              <DiscountCodeCard
                key={code.id}
                code={code}
                isExpired={isExpired(code)}
                onToggleFavorite={() => toggleFavorite(code.id)}
                onToggleArchived={() => toggleArchived(code.id)}
                onIncrementUsage={() => incrementUsage(code.id)}
                onDelete={() => deleteCode(code.id)}
                onEdit={(updates: Partial<DiscountCode>) => updateCode(code.id, updates)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Code Modal */}
      <AddCodeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addCode}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  )
}
