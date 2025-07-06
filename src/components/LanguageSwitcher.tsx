import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { LanguageOption, useLanguage } from '@/hooks/useLanguage';

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { language, changeLanguage, supportedLanguages } = useLanguage();

  const languageNames: Record<LanguageOption, string> = {
    auto: t('settings.language.auto'),
    en: t('settings.language.english'),
    nl: t('settings.language.dutch'),
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium theme-text-primary mb-2">
          {t('settings.language.title')}
        </h3>
        <p className="text-sm theme-text-secondary mb-4">
          {t('settings.language.subtitle')}
        </p>
      </div>

      <div className="space-y-3">
        {supportedLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => changeLanguage(lang)}
            className={`w-full flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
              language === lang
                ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700'
                : 'theme-filter border theme-border hover:bg-blue-50 dark:hover:bg-blue-900/10'
            }`}
          >
            <div className="flex items-center gap-3">
              {lang === 'auto' ? (
                <Globe className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <span className="w-5 h-5 flex items-center justify-center text-lg">
                  {lang === 'en' ? '🇬🇧' : '🇳🇱'}
                </span>
              )}
              <span className="font-medium">{languageNames[lang]}</span>
            </div>
            {language === lang && (
              <span className="h-3 w-3 rounded-full bg-blue-600"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
