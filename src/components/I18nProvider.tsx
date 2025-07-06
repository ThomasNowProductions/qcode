'use client'

import { ReactNode, useEffect } from 'react'

// Import the i18n initialization
import i18n from '@/utils/i18n'

interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  // This ensures translations are consistent in the client and server
  useEffect(() => {
    // Make sure i18n is initialized on the client with the same language as server
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('qcode-language');
      
      if (savedLanguage === 'auto') {
        const browserLang = navigator.language.split('-')[0];
        const supportedLanguage = ['en', 'nl'].includes(browserLang) ? browserLang : 'en';
        i18n.changeLanguage(supportedLanguage);
      } else if (savedLanguage === 'en' || savedLanguage === 'nl') {
        i18n.changeLanguage(savedLanguage);
      } else {
        i18n.changeLanguage('en'); // Default to English if no saved preference
      }
    }
  }, []);
  
  return <>{children}</>
}
