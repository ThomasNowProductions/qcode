import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DiscountCodeCard } from '../components/DiscountCodeCard';
import type { DiscountCode } from '../types/discount-code';

describe('DiscountCodeCard', () => {
  const code: DiscountCode = {
    id: '1',
    code: 'SUMMER2025',
    store: 'CoolStore',
    discount: '10%',
    expiryDate: new Date('2025-12-31'),
    category: 'Zomer',
    description: '10% korting op alles',
    isFavorite: false,
    isArchived: false,
    dateAdded: new Date(),
    timesUsed: 0,
  };

  it('renders discount code and store', () => {
    render(
      <DiscountCodeCard
        code={code}
        isExpired={false}
        onToggleFavorite={() => {}}
        onToggleArchived={() => {}}
        onIncrementUsage={() => {}}
        onDelete={() => {}}
      />
    );
    expect(screen.getByText(/SUMMER2025/i)).toBeInTheDocument();
    expect(screen.getByText(/CoolStore/i)).toBeInTheDocument();
  });
});
