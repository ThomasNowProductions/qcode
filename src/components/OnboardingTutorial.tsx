'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { OnboardingTutorialProps } from '@/types/onboarding'
import { ONBOARDING_STEPS } from '@/types/onboarding'

export function OnboardingTutorial({ isOpen, onClose, onComplete, onSkip }: OnboardingTutorialProps) {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const currentStepData = ONBOARDING_STEPS[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1
  const totalSteps = ONBOARDING_STEPS.length

  // Handle element highlighting and positioning
  useEffect(() => {
    if (!isOpen || !currentStepData.targetElement) {
      setHighlightedElement(null)
      return
    }

    const element = document.querySelector(currentStepData.targetElement) as HTMLElement
    if (element) {
      setHighlightedElement(element)
      
      // Scroll element into view
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })

      // Add highlight class
      element.classList.add('onboarding-highlight')
    }

    return () => {
      if (element) {
        element.classList.remove('onboarding-highlight')
      }
    }
  }, [currentStep, isOpen, currentStepData.targetElement])

  // Position tooltip relative to highlighted element or center it
  useEffect(() => {
    if (!tooltipRef.current) return

    const updatePosition = () => {
      if (!tooltipRef.current) return

      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth
      const tooltipWidth = tooltipRect.width
      const tooltipHeight = tooltipRect.height

      let top = 0
      let left = 0

      // Handle positioning based on whether we have a target element
      if (highlightedElement && currentStepData.position !== 'center') {
        const elementRect = highlightedElement.getBoundingClientRect()
        const minGap = 40 // Increased gap to prevent overlap

        switch (currentStepData.position) {
          case 'top':
            // Position above element, but check if there's enough space
            const topPos = elementRect.top - tooltipHeight - minGap
            if (topPos < 20) {
              // Not enough space above, position below instead
              top = elementRect.bottom + minGap
            } else {
              top = topPos
            }
            // Center horizontally on element, but keep within viewport
            left = elementRect.left + (elementRect.width / 2) - (tooltipWidth / 2)
            break
          case 'bottom':
            // Position below element, but check if there's enough space
            const bottomPos = elementRect.bottom + minGap
            if (bottomPos + tooltipHeight > viewportHeight - 20) {
              // Not enough space below, position above instead
              top = elementRect.top - tooltipHeight - minGap
            } else {
              top = bottomPos
            }
            left = elementRect.left + (elementRect.width / 2) - (tooltipWidth / 2)
            break
          case 'left':
            // Position to the left of element
            const leftPos = elementRect.left - tooltipWidth - minGap
            if (leftPos < 20) {
              // Not enough space left, position right instead
              left = elementRect.right + minGap
            } else {
              left = leftPos
            }
            top = elementRect.top + (elementRect.height / 2) - (tooltipHeight / 2)
            break
          case 'right':
            // Position to the right of element
            const rightPos = elementRect.right + minGap
            if (rightPos + tooltipWidth > viewportWidth - 20) {
              // Not enough space right, position left instead
              left = elementRect.left - tooltipWidth - minGap
            } else {
              left = rightPos
            }
            top = elementRect.top + (elementRect.height / 2) - (tooltipHeight / 2)
            break
        }
      } else {
        // Center position (for steps with no target element or explicitly center)
        top = (viewportHeight / 2) - (tooltipHeight / 2)
        left = (viewportWidth / 2) - (tooltipWidth / 2)
      }

      // Keep tooltip within viewport bounds with more padding
      const padding = 20
      top = Math.max(padding, Math.min(top, viewportHeight - tooltipHeight - padding))
      left = Math.max(padding, Math.min(left, viewportWidth - tooltipWidth - padding))

      tooltipRef.current.style.position = 'fixed'
      tooltipRef.current.style.top = `${top}px`
      tooltipRef.current.style.left = `${left}px`
      tooltipRef.current.style.zIndex = '10000'
    }

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(updatePosition, 10)
    
    const handleResize = () => updatePosition()
    const handleScroll = () => updatePosition()

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, true)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [highlightedElement, currentStepData.position, isOpen])

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    onSkip()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 transition-opacity z-[9998]"
      />

      {/* Tutorial Card */}
      <div
        ref={tooltipRef}
        className={`
          bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-600
          w-full max-w-md mx-4 transition-all duration-300 transform
          ring-4 ring-white/10 backdrop-blur-sm
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
        style={{ zIndex: 10000 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              {isLastStep ? (
                <CheckCircle size={20} className="text-white" />
              ) : (
                <span className="text-white text-sm font-semibold">{currentStep + 1}</span>
              )}
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t(currentStepData.title)}
            </h2>
          </div>
          
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label={t('common.close', 'Close')}
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            {t(currentStepData.description)}
          </p>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>
                {t('onboarding.navigation.stepOf', { 
                  current: currentStep + 1, 
                  total: totalSteps 
                })}
              </span>
              <span>{Math.round((currentStep + 1) / totalSteps * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep + 1) / totalSteps * 100}%` }}
              />
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {!isFirstStep && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft size={16} />
                  {t('onboarding.navigation.previous')}
                </button>
              )}
              
              {currentStepData.allowSkip && !isLastStep && (
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  {t('onboarding.navigation.skip')}
                </button>
              )}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              {isLastStep ? (
                <>
                  <CheckCircle size={16} />
                  {t('onboarding.navigation.finish')}
                </>
              ) : (
                <>
                  {t('onboarding.navigation.next')}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Spotlight effect for highlighted elements */}
      {highlightedElement && currentStepData.position !== 'center' && (
        <style jsx global>{`
          .onboarding-highlight {
            position: relative;
            z-index: 9999;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.6);
            border-radius: 8px;
            transition: all 0.3s ease;
          }
        `}</style>
      )}
    </>
  )
}