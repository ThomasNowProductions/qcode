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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Instellingen</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'about'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Over QCode
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'export'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Exporteren
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'import'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
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
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">QCode</h3>
                <p className="text-gray-600 mb-1">Versie 1.0.0</p>
                <p className="text-sm text-gray-500">
                  Kortingscodes beheren, simpel en effectief
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Info size={16} />
                  Over deze app
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  QCode is een Progressive Web App die je helpt al je kortingscodes 
                  op één plek te bewaren. De app werkt volledig offline en je data 
                  wordt lokaal op je apparaat opgeslagen.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Shield size={16} />
                  Privacy & Beveiliging
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Al je data wordt lokaal opgeslagen</li>
                  <li>• Geen accounts of registratie nodig</li>
                  <li>• Geen data wordt gedeeld met derden</li>
                  <li>• Volledig offline te gebruiken</li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Gebouwd met ❤️ using Next.js, TypeScript & Tailwind CSS
                </p>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Exporteer je kortingscodes
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Maak een backup van al je kortingscodes. Je kunt deze later importeren 
                  of delen met andere apparaten.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">
                      {codes.length} kortingscodes gevonden
                    </p>
                    <p className="text-sm text-blue-700">
                      Inclusief gearchiveerde en verlopen codes
                    </p>
                  </div>
                  <button
                    onClick={handleExport}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    <Download size={16} />
                    Exporteren
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <p>💡 Tip: Bewaar je backup op een veilige plek zoals cloud storage.</p>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Importeer kortingscodes
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Importeer kortingscodes uit een backup bestand. Dit vervangt al je 
                  huidige codes.
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <label htmlFor="import-file" className="cursor-pointer">
                    <span className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
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
                  <p className="text-sm text-gray-500 mt-2">
                    Alleen .json bestanden worden ondersteund
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">
                    Of probeer voorbeelddata
                  </h4>
                  <p className="text-sm text-purple-700 mb-3">
                    Laad enkele voorbeelden om de app uit te proberen.
                  </p>
                  <button
                    onClick={() => {
                      loadDemoData()
                      window.location.reload()
                    }}
                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    Voorbeelddata laden
                  </button>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">Gevaarlijke acties</h4>
                  <p className="text-sm text-red-700 mb-3">
                    Dit verwijdert alle je kortingscodes permanent.
                  </p>
                  <button
                    onClick={handleClearAll}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                    Alles verwijderen
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  )
}
