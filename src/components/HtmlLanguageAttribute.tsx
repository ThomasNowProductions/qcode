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

  // Also set initial language on mount for first-time visitors
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('qcode-language');
      
      // For first-time visitors, detect system language and apply immediately
      if (!savedLanguage) {
        const browserLang = navigator.language.split('-')[0];
        const supportedLanguage = ['en', 'nl'].includes(browserLang) ? browserLang : 'en';
        document.documentElement.lang = supportedLanguage;
      }
    }
  }, [])
  
  return <>{children}</>
}
