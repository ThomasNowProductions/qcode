'use client'

import { useState, useEffect, useCallback } from 'react'
import type { OnboardingState } from '@/types/onboarding'

const TUTORIAL_STORAGE_KEY = 'qcode-tutorial-completed'
const TUTORIAL_SKIP_STORAGE_KEY = 'qcode-tutorial-skipped'

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>({
    isActive: false,
    currentStep: 0,
    isCompleted: true, // Start as completed to prevent flashing
    canSkip: true
  })
  
  const [isInitialized, setIsInitialized] = useState(false)

  // Check tutorial completion status on mount
  useEffect(() => {
    const isCompleted = localStorage.getItem(TUTORIAL_STORAGE_KEY) === 'true'
    const isSkipped = localStorage.getItem(TUTORIAL_SKIP_STORAGE_KEY) === 'true'
    
    setState(prev => ({
      ...prev,
      isCompleted: isCompleted || isSkipped
    }))
    setIsInitialized(true)
  }, [])

  const startTutorial = useCallback(() => {
    setState({
      isActive: true,
      currentStep: 0,
      isCompleted: false,
      canSkip: true
    })
  }, [])

  const nextStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: prev.currentStep + 1
    }))
  }, [])

  const previousStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1)
    }))
  }, [])

  const skipTutorial = useCallback(() => {
    localStorage.setItem(TUTORIAL_SKIP_STORAGE_KEY, 'true')
    setState({
      isActive: false,
      currentStep: 0,
      isCompleted: true,
      canSkip: true
    })
  }, [])

  const completeTutorial = useCallback(() => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true')
    setState({
      isActive: false,
      currentStep: 0,
      isCompleted: true,
      canSkip: true
    })
  }, [])

  const closeTutorial = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false
    }))
  }, [])

  const resetTutorial = useCallback(() => {
    localStorage.removeItem(TUTORIAL_STORAGE_KEY)
    localStorage.removeItem(TUTORIAL_SKIP_STORAGE_KEY)
    setState({
      isActive: false,
      currentStep: 0,
      isCompleted: false,
      canSkip: true
    })
  }, [])

  // Show tutorial automatically for new users - only after initialization
  const shouldShowTutorial = isInitialized && !state.isCompleted && !state.isActive

  return {
    state,
    startTutorial,
    nextStep,
    previousStep,
    skipTutorial,
    completeTutorial,
    closeTutorial,
    resetTutorial,
    shouldShowTutorial,
    isInitialized
  }
}