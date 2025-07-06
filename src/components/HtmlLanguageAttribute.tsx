'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/hooks/useLanguage'

export function HtmlLanguageAttribute({ children }: { children: React.ReactNode }) {
  const { currentLanguage } = useLanguage()
  
  // Use the Effect hook to update the HTML lang attribute only on the client side
  useEffect(() => {
    // Get the first 2 chars (e.g., "en" from "en-US")
    const langCode = currentLanguage.substring(0, 2)
    document.documentElement.lang = langCode
  }, [currentLanguage])
  
  return <>{children}</>
}
