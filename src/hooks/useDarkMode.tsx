'use client'

import { useState, useEffect } from 'react'

export type ThemeMode = 'light' | 'dark' | 'auto'

export function useDarkMode() {
  const [theme, setTheme] = useState<ThemeMode>('auto')
  const [isDark, setIsDark] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check for saved preference
    const savedTheme = localStorage.getItem('themeMode') as ThemeMode
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      setTheme('auto')
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return

    // Determine if dark mode should be active
    let shouldBeDark = false
    
    if (theme === 'auto') {
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    } else {
      shouldBeDark = theme === 'dark'
    }

    setIsDark(shouldBeDark)

    // Apply dark mode class to document
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Save preference
    localStorage.setItem('themeMode', theme)
  }, [theme, isLoaded])

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (!isLoaded || theme !== 'auto') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches)
      if (e.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, isLoaded])

  const setThemeMode = (newTheme: ThemeMode) => {
    setTheme(newTheme)
  }

  return { theme, setThemeMode, isDark, isLoaded }
}