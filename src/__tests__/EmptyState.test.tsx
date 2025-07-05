import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EmptyState } from '../components/EmptyState';

describe('EmptyState', () => {
  it('renders empty state message', () => {
    render(<EmptyState hasAnyCodes={false} onAddCode={() => {}} />);
    expect(screen.getByText(/welkom bij qcode/i)).toBeInTheDocument();
    expect(screen.getByText(/begin met het toevoegen van je eerste kortingscode/i)).toBeInTheDocument();
  });
});
