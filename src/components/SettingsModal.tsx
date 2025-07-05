import { useState } from 'react'
import { X, Download, Upload, Trash2, Info, Heart, Shield } from 'lucide-react'
import { useDiscountCodes } from '@/hooks/useDiscountCodes'
import { exportCodes, importCodes } from '@/utils/storage'
import { loadDemoData } from '@/utils/demo-data'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { codes } = useDiscountCodes()
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'about'>('about')

  const handleExport = () => {
    const exportData = exportCodes(codes)
    const blob = new Blob([exportData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qcode-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedCodes = importCodes(content)
        
        // Save imported codes
        localStorage.setItem('qcode-discount-codes', JSON.stringify(importedCodes))
        window.location.reload()
      } catch (error) {
        alert('Fout bij importeren: ' + (error as Error).message)
      }
    }
    reader.readAsText(file)
  }

  const handleClearAll = () => {
    if (confirm('Weet je zeker dat je alle kortingscodes wilt verwijderen? Deze actie kan niet ongedaan gemaakt worden.')) {
      localStorage.removeItem('qcode-discount-codes')
      window.location.reload()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="theme-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[var(--card-border)]">
          <h2 className="text-xl font-semibold theme-text-primary">Instellingen</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-[var(--card-border)]">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'about'
                  ? 'border-blue-600 text-blue-900 dark:border-blue-400 dark:text-blue-300 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Over QCode
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'export'
                  ? 'border-blue-600 text-blue-900 dark:border-blue-400 dark:text-blue-300 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Exporteren
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'import'
                  ? 'border-blue-600 text-blue-900 dark:border-blue-400 dark:text-blue-300 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Importeren
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Heart className="w-8 h-8 text-blue-700 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold theme-text-primary mb-2">QCode</h3>
                <p className="theme-text-secondary mb-1">Versie 1.0.0</p>
                <p className="text-sm theme-text-muted">
                  Kortingscodes beheren, simpel en effectief
                </p>
              </div>

              <div className="theme-filter rounded-lg p-4">
                <h4 className="font-medium theme-text-primary mb-2 flex items-center gap-2">
                  <Info size={16} />
                  Over deze app
                </h4>
                <p className="text-sm theme-text-secondary leading-relaxed">
                  QCode is een Progressive Web App die je helpt al je kortingscodes 
                  op één plek te bewaren. De app werkt volledig offline en je data 
                  wordt lokaal op je apparaat opgeslagen.
                </p>
              </div>

              <div className="theme-filter rounded-lg p-4">
                <h4 className="font-medium theme-text-primary mb-2 flex items-center gap-2">
                  <Shield size={16} />
                  Privacy & Beveiliging
                </h4>
                <ul className="text-sm theme-text-secondary space-y-1">
                  <li>• Al je data wordt lokaal opgeslagen</li>
                  <li>• Geen accounts of registratie nodig</li>
                  <li>• Geen data wordt gedeeld met derden</li>
                  <li>• Volledig offline te gebruiken</li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-sm theme-text-muted">
                  Gebouwd met ❤️ using Next.js, TypeScript & Tailwind CSS
                </p>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium theme-text-primary mb-2">
                  Exporteer je kortingscodes
                </h3>
                <p className="text-sm theme-text-secondary mb-4">
                  Maak een backup van al je kortingscodes. Je kunt deze later importeren 
                  of delen met andere apparaten.
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-300 dark:border-blue-600 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-blue-100">
                      {codes.length} kortingscodes gevonden
                    </p>
                    <p className="text-sm text-slate-800 dark:text-blue-200">
                      Inclusief gearchiveerde en verlopen codes
                    </p>
                  </div>
                  <button
                    onClick={handleExport}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <Download size={16} />
                    Exporteren
                  </button>
                </div>
              </div>

              <div className="text-sm theme-text-muted">
                <p>💡 Tip: Bewaar je backup op een veilige plek zoals cloud storage.</p>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium theme-text-primary mb-2">
                  Importeer kortingscodes
                </h3>
                <p className="text-sm theme-text-secondary mb-4">
                  Importeer kortingscodes uit een backup bestand. Dit vervangt al je 
                  huidige codes.
                </p>
              </div>

              <div className="space-y-3">
                <div className="theme-code-display border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                  <label htmlFor="import-file" className="cursor-pointer">
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                      <Upload size={16} />
                      Selecteer backup bestand
                    </span>
                    <input
                      id="import-file"
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm theme-text-muted mt-2">
                    Alleen .json bestanden worden ondersteund
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border border-purple-300 dark:border-purple-600 rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-slate-900 dark:text-purple-100 mb-2">
                    Of probeer voorbeelddata
                  </h4>
                  <p className="text-sm text-slate-800 dark:text-purple-200 mb-3">
                    Laad enkele voorbeelden om de app uit te proberen.
                  </p>
                  <button
                    onClick={() => {
                      loadDemoData()
                      window.location.reload()
                    }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 text-white font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Voorbeelddata laden
                  </button>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border border-red-300 dark:border-red-600 rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-slate-900 dark:text-red-100 mb-2">Gevaarlijke acties</h4>
                  <p className="text-sm text-slate-800 dark:text-red-200 mb-3">
                    Dit verwijdert alle je kortingscodes permanent.
                  </p>
                  <button
                    onClick={handleClearAll}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <Trash2 size={16} />
                    Alles verwijderen
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-[var(--card-border)] bg-gray-50 dark:bg-[var(--card-bg)]">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  )
}
