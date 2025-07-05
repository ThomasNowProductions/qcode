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
    <div className={`bg-white/70 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700 p-6 transition-all duration-300 card-hover ${isExpired ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{code.store}</h3>
            <span className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-800 dark:text-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-700">
              {code.category}
            </span>
            {code.isFavorite && (
              <Heart className="w-5 h-5 text-red-500 fill-current drop-shadow-sm" />
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1.5">
              <Store size={14} className="text-gray-400" />
              <span className="font-medium">{code.discount}</span>
            </div>
            {code.expiryDate && (
              <>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-gray-400" />
                  <span className={`font-medium ${getExpiryColor()}`}>{getExpiryText()}</span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
          >
            <MoreVertical size={16} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-10 bg-white/95 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700 rounded-xl shadow-xl py-2 z-10 min-w-[180px]">
              <button
                onClick={() => {
                  onToggleFavorite()
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-200 transition-colors"
              >
                <Heart size={14} className={code.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'} />
                {code.isFavorite ? 'Uit favorieten' : 'Toevoegen aan favorieten'}
              </button>
              <button
                onClick={() => {
                  onToggleArchived()
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-200 transition-colors"
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
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-600 dark:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
                Verwijderen
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Code Display */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-semibold uppercase tracking-wide">KORTINGSCODE</p>
            <p className="font-mono text-xl font-bold text-gray-900 dark:text-white tracking-wider">{code.code}</p>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-semibold transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle size={16} className="text-green-500" />
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
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{code.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium">Gebruikt: {code.timesUsed}x</span>
          <span className="font-medium">Toegevoegd: {format(code.dateAdded, 'd MMM yyyy', { locale: nl })}</span>
        </div>
        <button
          onClick={handleUseCode}
          disabled={isExpired}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            isExpired
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
          }`}
        >
          {isExpired ? 'Verlopen' : 'Gebruiken'}
        </button>
      </div>
    </div>
  )
}
