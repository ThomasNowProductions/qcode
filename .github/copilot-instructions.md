<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Kortingscodes App - QCode

## Project Overzicht
Dit is een Progressive Web App (PWA) gebouwd met Next.js 15, TypeScript en Tailwind CSS voor het opslaan en beheren van kortingscodes.

## Architectuur & Features
- **Framework**: Next.js 15 met App Router
- **Styling**: Tailwind CSS voor responsive design
- **Data**: LocalStorage met optionele cloud sync
- **PWA**: Service Worker voor offline functionaliteit
- **TypeScript**: Voor type safety

## Hoofdfuncties
1. **Kortingscodes opslaan**: Code, winkel, korting, vervaldatum, categorie, notities
2. **Zoeken & Filteren**: Op winkel, categorie, status (actief/verlopen)
3. **Organisatie**: Categorieën, favorieten, archiveren
4. **Notificaties**: Waarschuwingen voor bijna verlopende codes
5. **Offline support**: Volledige functionaliteit zonder internet

## Code Guidelines
- Gebruik TypeScript interfaces voor alle data modellen
- Implementeer proper error handling
- Gebruik Tailwind voor alle styling
- Maak componenten herbruikbaar en modulair
- Gebruik React hooks voor state management
- Implementeer proper loading states

## Data Model
```typescript
interface DiscountCode {
  id: string
  code: string
  store: string
  discount: string // "10%" of "€5"
  expiryDate?: Date
  category: string
  description?: string
  isFavorite: boolean
  isArchived: boolean
  dateAdded: Date
  timesUsed: number
}
```

## Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Dark/light mode support
- Accessible design patterns
