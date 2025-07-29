import { render, screen, fireEvent } from '@testing-library/react'
import { UnifiedSettingsModal } from '../UnifiedSettingsModal'
import { I18nProvider } from '../I18nProvider'

// Mock the hooks
jest.mock('@/hooks/useDiscountCodes', () => ({
  useDiscountCodes: () => ({ codes: [] })
}))

jest.mock('@/hooks/useCloudSync', () => ({
  useCloudSync: () => ({
    isEnabled: false,
    isConnected: false,
    lastSync: null,
    syncStatus: 'idle',
    providers: []
  })
}))

jest.mock('@/hooks/useDarkMode', () => ({
  useDarkMode: () => ({
    theme: 'light',
    setThemeMode: jest.fn(),
    isDark: false
  })
}))

const MockedModal = ({ isOpen = true, onClose = jest.fn(), ...props }) => (
  <I18nProvider>
    <UnifiedSettingsModal
      isOpen={isOpen}
      onClose={onClose}
      {...props}
    />
  </I18nProvider>
)

describe('UnifiedSettingsModal Fixed Sizing', () => {
  test('modal has fixed dimensions classes applied', () => {
    render(<MockedModal />)
    
    const modal = screen.getByRole('dialog', { hidden: true }) || 
                  document.querySelector('.settings-modal-fixed')
    
    expect(modal).toBeInTheDocument()
    expect(modal).toHaveClass('settings-modal-fixed')
  })

  test('modal maintains consistent size across different tabs', () => {
    render(<MockedModal />)
    
    const modal = document.querySelector('.settings-modal-fixed')
    expect(modal).toBeInTheDocument()
    
    // Get initial dimensions
    const initialRect = modal?.getBoundingClientRect()
    
    // Switch to different tabs
    const tabs = ['Data Management', 'Cloud Sync', 'Appearance', 'Advanced']
    
    tabs.forEach(tabName => {
      const tabButton = screen.getByText(tabName)
      fireEvent.click(tabButton)
      
      // Check that modal dimensions haven't changed
      const currentRect = modal?.getBoundingClientRect()
      expect(currentRect?.width).toBe(initialRect?.width)
      expect(currentRect?.height).toBe(initialRect?.height)
    })
  })

  test('content area has proper overflow handling', () => {
    render(<MockedModal />)
    
    const contentArea = document.querySelector('.settings-content-area')
    expect(contentArea).toBeInTheDocument()
    
    const styles = window.getComputedStyle(contentArea!)
    expect(styles.overflowY).toBe('auto')
    expect(styles.flex).toBe('1')
  })

  test('modal has responsive dimensions', () => {
    render(<MockedModal />)
    
    const modal = document.querySelector('.settings-modal-fixed')
    expect(modal).toBeInTheDocument()
    
    // Check that responsive classes are applied
    expect(modal).toHaveClass('w-[95vw]', 'h-[85vh]')
    expect(modal).toHaveClass('sm:w-[90vw]', 'sm:h-[80vh]')
    expect(modal).toHaveClass('lg:w-[900px]', 'lg:h-[600px]')
  })
})
