import { Search, Filter, SortAsc } from 'lucide-react'
import type { SearchFilters } from '@/types/discount-code'
import { DISCOUNT_CATEGORIES } from '@/types/discount-code'

interface SearchAndFilterProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
}

export function SearchAndFilter({ filters, onFiltersChange }: SearchAndFilterProps) {
  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({ ...filters, searchTerm })
  }

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category })
  }

  const handleSortChange = (sortBy: SearchFilters['sortBy']) => {
    onFiltersChange({ ...filters, sortBy })
  }

  const handleFilterChange = (filterBy: SearchFilters['filterBy']) => {
    onFiltersChange({ ...filters, filterBy })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Zoek op code, winkel of beschrijving..."
          value={filters.searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3">
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Alle categorieën</option>
            {DISCOUNT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SortAsc size={16} className="text-gray-400" />
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as SearchFilters['sortBy'])}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="dateAdded">Nieuwste eerst</option>
            <option value="expiryDate">Vervaldatum</option>
            <option value="store">Winkel</option>
            <option value="category">Categorie</option>
            <option value="timesUsed">Meest gebruikt</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <select
            value={filters.filterBy}
            onChange={(e) => handleFilterChange(e.target.value as SearchFilters['filterBy'])}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Alle codes</option>
            <option value="active">Actieve codes</option>
            <option value="expired">Verlopen codes</option>
            <option value="favorites">Favorieten</option>
            <option value="archived">Gearchiveerd</option>
          </select>
        </div>
      </div>
    </div>
  )
}
