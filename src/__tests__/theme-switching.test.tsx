import { act } from '@testing-library/react'
import { useDarkMode } from '@/hooks/useDarkMode'
import { renderHook } from '@testing-library/react'

describe('Theme Switching Functionality', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Reset document classes
    document.documentElement.classList.remove('dark')
  })

  it('should apply light theme correctly', () => {
    const { result } = renderHook(() => useDarkMode())
    
    act(() => {
      result.current.setThemeMode('light')
    })
    
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('should apply dark theme correctly', () => {
    const { result } = renderHook(() => useDarkMode())
    
    act(() => {
      result.current.setThemeMode('dark')
    })
    
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('should apply auto theme correctly', () => {
    const { result } = renderHook(() => useDarkMode())
    
    act(() => {
      result.current.setThemeMode('auto')
    })
    
    // Auto theme should match system preference
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    expect(document.documentElement.classList.contains('dark')).toBe(systemDark)
  })

  it('should persist theme preference in localStorage', () => {
    const { result } = renderHook(() => useDarkMode())
    
    act(() => {
      result.current.setThemeMode('dark')
    })
    
    expect(localStorage.getItem('themeMode')).toBe('dark')
  })
})