import { renderHook, act } from '@testing-library/react'
import { useOnboarding } from '@/hooks/useOnboarding'

// Mock localStorage properly
const createLocalStorageMock = () => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
}

const localStorageMock = createLocalStorageMock()

// Setup localStorage mock before all tests
beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  })
})

describe('useOnboarding', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useOnboarding())

    expect(result.current.state).toEqual({
      isActive: false,
      currentStep: 0,
      isCompleted: false,
      canSkip: true
    })
  })

  it('starts tutorial correctly', () => {
    const { result } = renderHook(() => useOnboarding())

    act(() => {
      result.current.startTutorial()
    })

    expect(result.current.state.isActive).toBe(true)
    expect(result.current.state.currentStep).toBe(0)
  })

  it('moves to next step', () => {
    const { result } = renderHook(() => useOnboarding())

    act(() => {
      result.current.startTutorial()
    })

    act(() => {
      result.current.nextStep()
    })

    expect(result.current.state.currentStep).toBe(1)
  })

  it('moves to previous step', () => {
    const { result } = renderHook(() => useOnboarding())

    act(() => {
      result.current.startTutorial()
    })

    act(() => {
      result.current.nextStep()
    })

    act(() => {
      result.current.previousStep()
    })

    expect(result.current.state.currentStep).toBe(0)
  })

  it('does not go below step 0', () => {
    const { result } = renderHook(() => useOnboarding())

    act(() => {
      result.current.startTutorial()
    })

    act(() => {
      result.current.previousStep()
    })

    expect(result.current.state.currentStep).toBe(0)
  })

  it('skips tutorial and saves to localStorage', () => {
    const { result } = renderHook(() => useOnboarding())

    act(() => {
      result.current.skipTutorial()
    })

    expect(result.current.state.isActive).toBe(false)
    expect(result.current.state.isCompleted).toBe(true)
    expect(localStorageMock.getItem('qcode-tutorial-skipped')).toBe('true')
  })

  it('completes tutorial and saves to localStorage', () => {
    const { result } = renderHook(() => useOnboarding())

    act(() => {
      result.current.completeTutorial()
    })

    expect(result.current.state.isActive).toBe(false)
    expect(result.current.state.isCompleted).toBe(true)
    expect(localStorageMock.getItem('qcode-tutorial-completed')).toBe('true')
  })

  it('closes tutorial without marking as completed', () => {
    const { result } = renderHook(() => useOnboarding())

    act(() => {
      result.current.startTutorial()
    })

    act(() => {
      result.current.closeTutorial()
    })

    expect(result.current.state.isActive).toBe(false)
    expect(result.current.state.isCompleted).toBe(false)
  })

  it('resets tutorial and clears localStorage', () => {
    // First set some values
    localStorageMock.setItem('qcode-tutorial-completed', 'true')
    localStorageMock.setItem('qcode-tutorial-skipped', 'true')

    const { result } = renderHook(() => useOnboarding())

    act(() => {
      result.current.resetTutorial()
    })

    expect(result.current.state).toEqual({
      isActive: false,
      currentStep: 0,
      isCompleted: false,
      canSkip: true
    })

    expect(localStorageMock.getItem('qcode-tutorial-completed')).toBe(null)
    expect(localStorageMock.getItem('qcode-tutorial-skipped')).toBe(null)
  })

  it('should show tutorial for new users', () => {
    const { result } = renderHook(() => useOnboarding())

    expect(result.current.shouldShowTutorial).toBe(true)
  })

  it('should not show tutorial for users who completed it', () => {
    localStorageMock.setItem('qcode-tutorial-completed', 'true')

    const { result } = renderHook(() => useOnboarding())

    // Need to wait for useEffect to run
    act(() => {
      // This forces re-render
    })

    expect(result.current.shouldShowTutorial).toBe(false)
  })

  it('should not show tutorial for users who skipped it', () => {
    localStorageMock.setItem('qcode-tutorial-skipped', 'true')

    const { result } = renderHook(() => useOnboarding())

    // Need to wait for useEffect to run
    act(() => {
      // This forces re-render
    })

    expect(result.current.shouldShowTutorial).toBe(false)
  })
})