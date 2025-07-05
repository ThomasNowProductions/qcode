import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OfflineIndicator } from '../components/OfflineIndicator';

jest.mock('../hooks/usePWA', () => ({
  usePWA: () => ({ isOnline: false })
}));

describe('OfflineIndicator', () => {
  it('renders offline message', () => {
    render(<OfflineIndicator />);
    expect(screen.getByText(/offline modus/i)).toBeInTheDocument();
    expect(screen.getByText(/je wijzigingen worden gesynchroniseerd/i)).toBeInTheDocument();
  });
});
