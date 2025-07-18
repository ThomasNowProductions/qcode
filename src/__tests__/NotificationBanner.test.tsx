import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NotificationBanner } from '../components/NotificationBanner';
import type { DiscountCode } from '../types/discount-code';

describe('NotificationBanner', () => {
  const mockExpiringSoon: DiscountCode[] = [
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

  it('renders expiring soon notification', () => {
    render(<NotificationBanner expiringSoon={mockExpiringSoon} />);
    // Check for translation keys since we're using a mock
    expect(screen.getByText(/notifications.expiryDays/i)).toBeInTheDocument();
  });

  it('calls onCodeClick when a notification code is clicked', () => {
    const mockOnCodeClick = jest.fn();
    render(
      <NotificationBanner 
        expiringSoon={mockExpiringSoon} 
        onCodeClick={mockOnCodeClick}
      />
    );
    
    // Find the clickable code element
    const codeElement = screen.getByText(/Testwinkel/);
    fireEvent.click(codeElement.closest('div')!);
    
    expect(mockOnCodeClick).toHaveBeenCalledWith('1');
  });

  it('adds hover styles when onCodeClick is provided', () => {
    const mockOnCodeClick = jest.fn();
    render(
      <NotificationBanner 
        expiringSoon={mockExpiringSoon} 
        onCodeClick={mockOnCodeClick}
      />
    );
    
    const codeElement = screen.getByText(/Testwinkel/).closest('div');
    expect(codeElement).toHaveClass('cursor-pointer');
  });

  it('does not add hover styles when onCodeClick is not provided', () => {
    render(<NotificationBanner expiringSoon={mockExpiringSoon} />);
    
    const codeElement = screen.getByText(/Testwinkel/).closest('div');
    expect(codeElement).not.toHaveClass('cursor-pointer');
  });
});
