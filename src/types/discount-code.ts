export interface DiscountCode {
  id: string
  code: string
  store: string
  discount: string // "10%" of "€5"
  expiryDate?: Date
  category: string
  description?: string
  isFavorite: boolean
  isArchived: boolean
  dateAdded: Date
  timesUsed: number
  qrCode?: string
  // Sync-related metadata
  lastModified?: Date
  syncVersion?: number
  deviceCreated?: string
}

export interface DiscountCodeFormData {
  code: string
  store: string
  discount: string
  expiryDate?: string
  category: string
  description?: string
}

export type SortOption = 'dateAdded' | 'expiryDate' | 'store' | 'category' | 'timesUsed'
export type FilterOption = 'all' | 'active' | 'expired' | 'favorites' | 'archived'

export interface SearchFilters {
  searchTerm: string
  category: string
  sortBy: SortOption
  filterBy: FilterOption
}

export const DISCOUNT_CATEGORIES = [
  'Kleding',
  'Elektronica',
  'Eten & Drinken',
  'Sport & Fitness',
  'Boeken & Media',
  'Reizen',
  'Beauty & Verzorging',
  'Wonen & Tuin',
  'Speelgoed',
  'Anders'
] as const

// Category keys for translation (keep in sync with DISCOUNT_CATEGORIES)
export const CATEGORY_TRANSLATION_KEYS = DISCOUNT_CATEGORIES.reduce((acc, category) => {
  acc[category] = `categories.${category}`
  return acc
}, {} as Record<string, string>)

export type DiscountCategory = typeof DISCOUNT_CATEGORIES[number]
