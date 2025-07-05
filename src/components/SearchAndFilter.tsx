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
    <div className="theme-card rounded-xl shadow-lg border p-6 space-y-6 transition-all duration-300 card-hover">
      <h3 className="text-lg font-semibold theme-text-primary mb-4">Zoeken & Filteren</h3>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Zoek op code, winkel of beschrijving..."
          value={filters.searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="theme-input w-full pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 font-medium"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4">
        {/* Category Filter */}
        <div className="flex items-center gap-3 theme-filter rounded-lg px-4 py-2">
          <Filter size={16} className="text-gray-500 dark:text-gray-400" />
          <select
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="border-0 bg-transparent theme-text-primary text-sm focus:ring-0 focus:outline-none font-medium cursor-pointer"
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
        <div className="flex items-center gap-3 theme-filter rounded-lg px-4 py-2">
          <SortAsc size={16} className="text-gray-500 dark:text-gray-400" />
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as SearchFilters['sortBy'])}
            className="border-0 bg-transparent theme-text-primary text-sm focus:ring-0 focus:outline-none font-medium cursor-pointer"
          >
            <option value="dateAdded">Nieuwste eerst</option>
            <option value="expiryDate">Vervaldatum</option>
            <option value="store">Winkel</option>
            <option value="category">Categorie</option>
            <option value="timesUsed">Meest gebruikt</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-3 theme-filter rounded-lg px-4 py-2">
          <select
            value={filters.filterBy}
            onChange={(e) => handleFilterChange(e.target.value as SearchFilters['filterBy'])}
            className="border-0 bg-transparent theme-text-primary text-sm focus:ring-0 focus:outline-none font-medium cursor-pointer"
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
