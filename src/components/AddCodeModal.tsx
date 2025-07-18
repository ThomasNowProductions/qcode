import { useState } from 'react'
import { X } from 'lucide-react'
import type { DiscountCodeFormData } from '@/types/discount-code'
import { DISCOUNT_CATEGORIES, CATEGORY_TRANSLATION_KEYS } from '@/types/discount-code'
import { useTranslation } from 'react-i18next'

interface AddCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (formData: DiscountCodeFormData) => void
}

export function AddCodeModal({ isOpen, onClose, onAdd }: AddCodeModalProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<DiscountCodeFormData>({
    code: '',
    store: '',
    discount: '',
    expiryDate: '',
    category: DISCOUNT_CATEGORIES[0],
    description: '',
  })

  const [errors, setErrors] = useState<Partial<DiscountCodeFormData>>({})

  const validateForm = () => {
    const newErrors: Partial<DiscountCodeFormData> = {}

    if (!formData.code.trim()) {
      newErrors.code = t('validation.codeRequired', 'Discount code is required')
    }

    if (!formData.store.trim()) {
      newErrors.store = t('validation.storeRequired', 'Store is required')
    }

    if (!formData.discount.trim()) {
      newErrors.discount = t('validation.discountRequired', 'Discount is required')
    }

    if (formData.expiryDate) {
      const expiryDate = new Date(formData.expiryDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (expiryDate < today) {
        newErrors.expiryDate = t('validation.expiryDateInPast', 'Expiry date cannot be in the past')
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    onAdd(formData)
    
    // Reset form
    setFormData({
      code: '',
      store: '',
      discount: '',
      expiryDate: '',
      category: DISCOUNT_CATEGORIES[0],
      description: '',
    })
    setErrors({})
    onClose()
  }

  const handleChange = (field: keyof DiscountCodeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="theme-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[var(--card-border)]">
          <h2 className="text-xl font-semibold theme-text-primary">
            {t('addCode.title')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 theme-text-muted hover:theme-text-secondary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Code */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium theme-text-secondary mb-1">
              {t('addCode.codeLabel')}
            </label>
            <input
              type="text"
              id="code"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              placeholder={t('addCode.codePlaceholder')}
              className={`w-full px-3 py-2 border rounded-lg theme-input focus:ring-2 focus:ring-[var(--input-focus)] focus:border-transparent ${
                errors.code ? 'border-red-500' : ''
              }`}
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code}</p>
            )}
          </div>

          {/* Store */}
          <div>
            <label htmlFor="store" className="block text-sm font-medium theme-text-secondary mb-1">
              {t('addCode.storeLabel')}
            </label>
            <input
              type="text"
              id="store"
              value={formData.store}
              onChange={(e) => handleChange('store', e.target.value)}
              placeholder={t('addCode.storePlaceholder')}
              className={`w-full px-3 py-2 border rounded-lg theme-input focus:ring-2 focus:ring-[var(--input-focus)] focus:border-transparent ${
                errors.store ? 'border-red-500' : ''
              }`}
            />
            {errors.store && (
              <p className="text-red-500 text-sm mt-1">{errors.store}</p>
            )}
          </div>

          {/* Discount */}
          <div>
            <label htmlFor="discount" className="block text-sm font-medium theme-text-secondary mb-1">
              {t('addCode.discountLabel')}
            </label>
            <input
              type="text"
              id="discount"
              value={formData.discount}
              onChange={(e) => handleChange('discount', e.target.value)}
              placeholder={t('addCode.discountPlaceholder')}
              className={`w-full px-3 py-2 border rounded-lg theme-input focus:ring-2 focus:ring-[var(--input-focus)] focus:border-transparent ${
                errors.discount ? 'border-red-500' : ''
              }`}
            />
            {errors.discount && (
              <p className="text-red-500 text-sm mt-1">{errors.discount}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium theme-text-secondary mb-1">
              {t('addCode.categoryLabel')}
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg theme-input focus:ring-2 focus:ring-[var(--input-focus)] focus:border-transparent"
            >
              {DISCOUNT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {t(CATEGORY_TRANSLATION_KEYS[category])}
                </option>
              ))}
            </select>
          </div>

          {/* Expiry Date */}
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium theme-text-secondary mb-1">
              {t('addCode.expiryDateLabel')}
            </label>
            <input
              type="date"
              id="expiryDate"
              value={formData.expiryDate}
              onChange={(e) => handleChange('expiryDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-lg theme-input focus:ring-2 focus:ring-[var(--input-focus)] focus:border-transparent ${
                errors.expiryDate ? 'border-red-500' : ''
              }`}
            />
            {errors.expiryDate && (
              <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium theme-text-secondary mb-1">
              {t('addCode.descriptionLabel')}
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder={t('addCode.descriptionPlaceholder')}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg theme-input focus:ring-2 focus:ring-[var(--input-focus)] focus:border-transparent resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[var(--input-border)] theme-text-secondary rounded-lg hover:bg-[var(--filter-bg)] transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-hover)] text-white rounded-lg transition-colors"
            >
              {t('addCode.saveButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
