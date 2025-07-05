import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '../components/Header';

describe('Header', () => {
  it('renders the app title', () => {
    render(
      <Header onNotificationClick={() => {}} onSettingsClick={() => {}} />
    );
    expect(screen.getByText(/qcode/i)).toBeInTheDocument();
  });
});
