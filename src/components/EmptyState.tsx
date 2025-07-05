import { Plus, ShoppingBag, Sparkles } from 'lucide-react'
import { loadDemoData } from '@/utils/demo-data'

interface EmptyStateProps {
  hasAnyCodes: boolean
  onAddCode: () => void
}

export function EmptyState({ hasAnyCodes, onAddCode }: EmptyStateProps) {
  if (!hasAnyCodes) {
    // No codes at all
    return (
      <div className="bg-white/70 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700 p-12 text-center transition-all duration-300">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-200 dark:border-blue-700">
          <ShoppingBag size={36} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Welkom bij QCode!
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
          Begin met het toevoegen van je eerste kortingscode. 
          Bewaar al je kortingen op één plek en mis nooit meer een deal!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onAddCode}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={20} />
            Eerste code toevoegen
          </button>
          <button
            onClick={loadDemoData}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Sparkles size={20} />
            Probeer met voorbeelddata
          </button>
        </div>
      </div>
    )
  }

  // Has codes but none match current filters
  return (
    <div className="bg-white/70 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700 p-8 text-center transition-all duration-300">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-gray-600">
        <ShoppingBag size={28} className="text-gray-500 dark:text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
        Geen codes gevonden
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
        Er zijn geen kortingscodes die voldoen aan je huidige filters.
      </p>
      <button
        onClick={onAddCode}
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-lg transition-all duration-200"
      >
        <Plus size={16} />
        Nieuwe code toevoegen
      </button>
    </div>
  )
}
