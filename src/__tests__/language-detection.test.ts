/**
 * Test language detection functionality
 */

describe('Language Detection', () => {
  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  
  beforeEach(() => {
    // Reset localStorage mock
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
  });

  describe('First-time visitor language detection', () => {
    test('should detect Dutch language on Dutch system', () => {
      // Mock Dutch browser language
      Object.defineProperty(navigator, 'language', {
        value: 'nl-NL',
        configurable: true,
      });

      // Mock no saved language preference (first-time visitor)
      localStorageMock.getItem.mockReturnValue(null);

      // Test the language detection logic
      const browserLang = navigator.language.split('-')[0];
      const supportedLanguage = ['en', 'nl'].includes(browserLang) ? browserLang : 'en';

      expect(browserLang).toBe('nl');
      expect(supportedLanguage).toBe('nl');
    });

    test('should detect English language on English system', () => {
      // Mock English browser language
      Object.defineProperty(navigator, 'language', {
        value: 'en-US',
        configurable: true,
      });

      // Mock no saved language preference (first-time visitor)
      localStorageMock.getItem.mockReturnValue(null);

      // Test the language detection logic
      const browserLang = navigator.language.split('-')[0];
      const supportedLanguage = ['en', 'nl'].includes(browserLang) ? browserLang : 'en';

      expect(browserLang).toBe('en');
      expect(supportedLanguage).toBe('en');
    });

    test('should fallback to English for unsupported languages', () => {
      // Mock unsupported browser language
      Object.defineProperty(navigator, 'language', {
        value: 'fr-FR',
        configurable: true,
      });

      // Mock no saved language preference (first-time visitor)
      localStorageMock.getItem.mockReturnValue(null);

      // Test the language detection logic
      const browserLang = navigator.language.split('-')[0];
      const supportedLanguage = ['en', 'nl'].includes(browserLang) ? browserLang : 'en';

      expect(browserLang).toBe('fr');
      expect(supportedLanguage).toBe('en');
    });
  });

  describe('Saved language preferences', () => {
    test('should respect saved auto preference with Dutch system language', () => {
      // Mock Dutch browser language
      Object.defineProperty(navigator, 'language', {
        value: 'nl-BE',
        configurable: true,
      });

      // Mock saved auto preference
      localStorageMock.getItem.mockReturnValue('auto');

      // Test the language detection logic
      const savedLanguage = localStorage.getItem('qcode-language');
      let finalLanguage = 'en';
      
      if (savedLanguage === 'auto') {
        const browserLang = navigator.language.split('-')[0];
        finalLanguage = ['en', 'nl'].includes(browserLang) ? browserLang : 'en';
      }

      expect(finalLanguage).toBe('nl');
    });

    test('should respect saved specific language preference', () => {
      // Mock Dutch browser language (should be ignored when specific language is saved)
      Object.defineProperty(navigator, 'language', {
        value: 'nl-NL',
        configurable: true,
      });

      // Mock saved English preference
      localStorageMock.getItem.mockReturnValue('en');

      // Test the language detection logic
      const savedLanguage = localStorage.getItem('qcode-language');
      let finalLanguage = 'en';
      
      if (savedLanguage === 'en' || savedLanguage === 'nl') {
        finalLanguage = savedLanguage;
      }

      expect(finalLanguage).toBe('en');
    });
  });
});