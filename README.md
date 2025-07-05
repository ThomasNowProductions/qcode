# QCode - Kortingscodes Beheren

Een moderne Progressive Web App (PWA) voor het opslaan en beheren van kortingscodes, gebouwd met Next.js 15, TypeScript en Tailwind CSS.

## ✨ Features

### 🎯 Hoofdfuncties
- **Kortingscodes opslaan** - Bewaar al je kortingscodes met details
- **Intelligent zoeken** - Zoek op code, winkel, categorie of beschrijving
- **Categorisering** - Organiseer codes per categorie (Kleding, Elektronica, etc.)
- **Vervaldatum tracking** - Krijg waarschuwingen voor bijna verlopende codes
- **Favorieten** - Markeer belangrijke codes als favoriet
- **Gebruik tracking** - Houd bij hoe vaak je codes gebruikt

### 📱 Progressive Web App
- **Offline functionaliteit** - Werkt zonder internetverbinding
- **Installeerbaar** - Installeer als app op je telefoon/computer
- **Responsive design** - Perfect op alle apparaten
- **Native ervaring** - Voelt aan als een echte app

### 🎨 User Experience
- **Modern design** - Schone, gebruiksvriendelijke interface
- **Dark/Light mode** - Automatische thema-ondersteuning
- **Touch-friendly** - Geoptimaliseerd voor aanrakingsbediening
- **Accessibility** - Toegankelijk voor iedereen

## 🛠️ Technische Stack

- **Framework**: Next.js 15 met App Router
- **Taal**: TypeScript voor type-veiligheid
- **Styling**: Tailwind CSS voor responsive design
- **Icons**: Lucide React voor consistente iconografie
- **Data**: LocalStorage met optionele cloud sync
- **PWA**: Service Worker voor offline functionaliteit
- **Build**: Turbopack voor snelle ontwikkeling

## 🚀 Snel starten

### Ontwikkeling
```bash
# Installeer dependencies
npm install

# Start development server
npm run dev

# Open browser naar http://localhost:3000
```

### Productie
```bash
# Bouw de applicatie
npm run build

# Start productie server
npm start
```

## 📁 Project Structuur

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout met PWA configuratie
│   ├── page.tsx           # Hoofdpagina
│   └── globals.css        # Globale styles
├── components/            # React componenten
│   ├── Header.tsx         # App header met navigatie
│   ├── StatsOverview.tsx  # Statistieken overzicht
│   ├── SearchAndFilter.tsx # Zoek en filter interface
│   ├── DiscountCodeCard.tsx # Individuele code kaart
│   ├── AddCodeModal.tsx   # Modal voor nieuwe codes
│   └── EmptyState.tsx     # Lege status weergave
├── hooks/                 # Custom React hooks
│   └── useDiscountCodes.ts # State management voor codes
├── types/                 # TypeScript definities
│   └── discount-code.ts   # Code interfaces en types
└── utils/                 # Utility functies
    └── storage.ts         # LocalStorage helpers
```

## 💾 Data Model

```typescript
interface DiscountCode {
  id: string              // Unieke identifier
  code: string           // De kortingscode zelf
  store: string          // Winkel naam
  discount: string       // Korting bedrag/percentage
  expiryDate?: Date      // Vervaldatum (optioneel)
  category: string       // Categorie
  description?: string   // Extra beschrijving
  isFavorite: boolean    // Favoriet status
  isArchived: boolean    // Gearchiveerd status
  dateAdded: Date        // Datum toegevoegd
  timesUsed: number      // Aantal keer gebruikt
}
```

## 🎨 Design Systeem

### Kleuren
- **Primary**: Blue (#3b82f6) - Hoofdacties en links
- **Success**: Green (#10b981) - Actieve codes en succes
- **Warning**: Orange (#f59e0b) - Bijna verlopende codes
- **Error**: Red (#ef4444) - Verlopen codes en fouten
- **Gray**: Verschillende tinten voor tekst en achtergronden

### Categorieën
- Kleding
- Elektronica
- Eten & Drinken
- Sport & Fitness
- Boeken & Media
- Reizen
- Beauty & Verzorging
- Wonen & Tuin
- Speelgoed
- Anders

## 🔄 State Management

De app gebruikt een custom React hook (`useDiscountCodes`) voor centraal state management:
- LocalStorage voor persistentie
- Optimistische updates voor snelle UX
- Automatische backup en sync mogelijkheden

## 📱 PWA Features

### Installatie
De app kan geïnstalleerd worden op:
- iOS (Safari)
- Android (Chrome/Edge)
- Desktop (Chrome/Edge/Safari)

### Offline Functionaliteit
- Alle opgeslagen codes zijn offline beschikbaar
- Nieuwe codes worden lokaal opgeslagen
- Sync wanneer verbinding hersteld is

### Notificaties
- Waarschuwingen voor bijna verlopende codes
- Updates over nieuwe features

## 🎯 Toekomstige Features

- [ ] Cloud synchronisatie tussen apparaten
- [ ] QR code scanning voor automatische code input
- [ ] Barcode ondersteuning
- [ ] Gedeelde codes tussen gebruikers
- [ ] Winkel integraties voor automatische codes
- [ ] Push notificaties voor deals
- [x] Export/import functionaliteit
- [ ] Analytics dashboard
- [ ] Thema aanpassingen
- [ ] Multi-taal ondersteuning

## 📄 Licentie

MIT License - zie [LICENSE](LICENSE) bestand voor details.

## 🤝 Bijdragen

Bijdragen zijn welkom! Open een issue of stuur een pull request.

## 📞 Contact

Voor vragen of feedback, open een issue op GitHub.
