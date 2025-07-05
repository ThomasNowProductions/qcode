import { useState } from 'react'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import { 
  Heart, 
  Copy, 
  Calendar, 
  Store, 
  MoreVertical, 
  Archive, 
  Trash2,
  RotateCcw,
  CheckCircle
} from 'lucide-react'
import type { DiscountCode } from '@/types/discount-code'

interface DiscountCodeCardProps {
  code: DiscountCode
  isExpired: boolean
  onToggleFavorite: () => void
  onToggleArchived: () => void
  onIncrementUsage: () => void
  onDelete: () => void
  onEdit: (updates: Partial<DiscountCode>) => void
}

export function DiscountCodeCard({
  code,
  isExpired,
  onToggleFavorite,
  onToggleArchived,
  onIncrementUsage,
  onDelete,
}: DiscountCodeCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const handleUseCode = () => {
    onIncrementUsage()
    handleCopyCode()
  }

  const getExpiryColor = () => {
    if (!code.expiryDate) return 'text-gray-500'
    if (isExpired) return 'text-red-500'
    
    const daysUntilExpiry = Math.ceil(
      (code.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
    
    if (daysUntilExpiry <= 7) return 'text-orange-500'
    return 'text-gray-500'
  }

  const getExpiryText = () => {
    if (!code.expiryDate) return 'Geen vervaldatum'
    if (isExpired) return 'Verlopen'
    
    const daysUntilExpiry = Math.ceil(
      (code.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
    
    if (daysUntilExpiry === 0) return 'Verloopt vandaag'
    if (daysUntilExpiry === 1) return 'Verloopt morgen'
    if (daysUntilExpiry <= 7) return `Verloopt over ${daysUntilExpiry} dagen`
    
    return format(code.expiryDate, 'd MMM yyyy', { locale: nl })
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors ${isExpired ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">{code.store}</h3>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded">
              {code.category}
            </span>
            {code.isFavorite && (
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Store size={14} />
            <span>{code.discount}</span>
            {code.expiryDate && (
              <>
                <span>•</span>
                <Calendar size={14} />
                <span className={getExpiryColor()}>{getExpiryText()}</span>
              </>
            )}
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <MoreVertical size={16} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[160px]">
              <button
                onClick={() => {
                  onToggleFavorite()
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-200"
              >
                <Heart size={14} className={code.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'} />
                {code.isFavorite ? 'Uit favorieten' : 'Toevoegen aan favorieten'}
              </button>
              <button
                onClick={() => {
                  onToggleArchived()
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-200"
              >
                {code.isArchived ? (
                  <>
                    <RotateCcw size={14} className="text-gray-400" />
                    Uit archief halen
                  </>
                ) : (
                  <>
                    <Archive size={14} className="text-gray-400" />
                    Archiveren
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  onDelete()
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400"
              >
                <Trash2 size={14} />
                Verwijderen
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Code Display */}
      <div className="bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">KORTINGSCODE</p>
            <p className="font-mono text-lg font-bold text-gray-900 dark:text-white">{code.code}</p>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
          >
            {copied ? (
              <>
                <CheckCircle size={16} />
                Gekopieerd!
              </>
            ) : (
              <>
                <Copy size={16} />
                Kopiëren
              </>
            )}
          </button>
        </div>
      </div>

      {/* Description */}
      {code.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{code.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span>Gebruikt: {code.timesUsed}x</span>
          <span>Toegevoegd: {format(code.dateAdded, 'd MMM yyyy', { locale: nl })}</span>
        </div>
        <button
          onClick={handleUseCode}
          disabled={isExpired}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isExpired
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isExpired ? 'Verlopen' : 'Gebruiken'}
        </button>
      </div>
    </div>
  )
}
