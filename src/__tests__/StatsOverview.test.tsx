import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatsOverview } from '../components/StatsOverview';

describe('StatsOverview', () => {
  it('renders stats labels', () => {
    render(
      <StatsOverview
        stats={{
          total: 5,
          active: 3,
          expired: 2,
          favorites: 1,
          archived: 0,
          totalUsages: 10,
          expiringSoon: 1,
        }}
      />
    );
  // Check for both 'Totaal aantal codes:' and 'Totaal gebruikt:'
  expect(screen.getByText(/totaal aantal codes:/i)).toBeInTheDocument();
  expect(screen.getByText(/totaal gebruikt:/i)).toBeInTheDocument();
  expect(screen.getByText(/actief/i)).toBeInTheDocument();
  expect(screen.getByText(/^Verlopen$/i)).toBeInTheDocument();
  expect(screen.getByText(/favorieten/i)).toBeInTheDocument();
  expect(screen.getByText(/binnenkort verlopen/i)).toBeInTheDocument();
  });
});
