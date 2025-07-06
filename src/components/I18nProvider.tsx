'use client'

import { ReactNode } from 'react'

// Import the i18n initialization
import '@/utils/i18n'

interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  return <>{children}</>
}
