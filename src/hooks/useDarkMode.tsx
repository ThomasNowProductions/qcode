'use client'

import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check for saved preference or system preference
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode) {
      setIsDark(savedMode === 'true')
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    
    // Apply dark mode class to document
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Save preference
    localStorage.setItem('darkMode', isDark.toString())
  }, [isDark, isLoaded])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
  }

  return { isDark, toggleDarkMode, isLoaded }
}