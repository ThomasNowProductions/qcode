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
  // Check for translation keys since we're using a mock
  expect(screen.getByText(/stats.totalCodes/i)).toBeInTheDocument();
  expect(screen.getByText(/stats.activeCodes/i)).toBeInTheDocument();
  expect(screen.getByText(/stats.expiredCodes/i)).toBeInTheDocument();
  expect(screen.getByText(/stats.favoriteCodes/i)).toBeInTheDocument();
  expect(screen.getByText(/stats.expiringSoon/i)).toBeInTheDocument();
  expect(screen.getByText(/codeCard.timesUsed/i)).toBeInTheDocument();
  });
});
