import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EmptyState } from '../components/EmptyState';

describe('EmptyState', () => {
  it('renders empty state message', () => {
    render(<EmptyState hasAnyCodes={false} onAddCode={() => {}} />);
    // Check for translation keys since we're using a mock, use more specific selectors
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('homePage.welcome');
    expect(screen.getByText(/homePage.welcomeMessage/i)).toBeInTheDocument();
  });
});
