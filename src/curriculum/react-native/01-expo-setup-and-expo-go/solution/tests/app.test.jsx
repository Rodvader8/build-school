import { render, screen } from '@testing-library/react';
import App from '../App.jsx';

describe('the welcome screen', () => {
  it('the app shows the hotel name as a heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Hotel Marlow/ })).toBeTruthy();
  });

  it('the app shows a tagline under the heading', () => {
    render(<App />);
    expect(screen.getByTestId('tagline').textContent.trim().length).toBeGreaterThan(10);
  });
});
