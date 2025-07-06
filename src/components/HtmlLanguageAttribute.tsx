'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'

export function HtmlLanguageAttribute({ children }: { children: React.ReactNode }) {
  const { currentLanguage } = useLanguage()
  const [language, setLanguage] = useState('nl') // Default to Dutch
  
  useEffect(() => {
    setLanguage(currentLanguage.substring(0, 2)) // Get the first 2 chars (e.g., "en" from "en-US")
  }, [currentLanguage])
  
  // Use the Effect hook to update the HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])
  
  return <>{children}</>
}
