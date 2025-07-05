import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InstallPrompt } from '../components/InstallPrompt';

describe('InstallPrompt', () => {
  it('renders nothing if not installable', () => {
    // InstallPrompt uses internal state and PWA hook, so by default it renders null
    const { container } = render(<InstallPrompt />);
    expect(container).toBeEmptyDOMElement();
  });
});
