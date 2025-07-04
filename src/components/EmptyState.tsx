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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag size={32} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Welkom bij QCode!
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Begin met het toevoegen van je eerste kortingscode. 
          Bewaar al je kortingen op één plek en mis nooit meer een deal!
        </p>
        <button
          onClick={onAddCode}
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors mr-3"
        >
          <Plus size={20} />
          Eerste code toevoegen
        </button>
        <button
          onClick={loadDemoData}
          className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          <Sparkles size={20} />
          Probeer met voorbeelddata
        </button>
      </div>
    )
  }

  // Has codes but none match current filters
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShoppingBag size={24} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Geen codes gevonden
      </h3>
      <p className="text-gray-600 mb-4">
        Er zijn geen kortingscodes die voldoen aan je huidige filters.
      </p>
      <button
        onClick={onAddCode}
        className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium"
      >
        <Plus size={16} />
        Nieuwe code toevoegen
      </button>
    </div>
  )
}
