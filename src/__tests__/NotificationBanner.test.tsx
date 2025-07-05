import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NotificationBanner } from '../components/NotificationBanner';
import type { DiscountCode } from '../types/discount-code';

describe('NotificationBanner', () => {
  it('renders expiring soon notification', () => {
    const expiringSoon: DiscountCode[] = [
      {
        id: '1',
        code: 'TEST2025',
        store: 'Testwinkel',
        discount: '10%',
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        category: 'Test',
        isFavorite: false,
        isArchived: false,
        dateAdded: new Date(),
        timesUsed: 0,
      },
    ];
    render(<NotificationBanner expiringSoon={expiringSoon} />);
    expect(screen.getByText(/verloopt over 2 dagen/i)).toBeInTheDocument();
  });
});
