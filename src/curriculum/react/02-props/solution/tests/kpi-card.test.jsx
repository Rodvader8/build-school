import { render, screen } from '@testing-library/react';
import App from '../src/App.jsx';
import KpiCard from '../src/components/KpiCard.jsx';

describe('KpiCard', () => {
  it('shows its label and the value as dollars', () => {
    render(<KpiCard label="Net worth" value={2400000} />);
    expect(screen.getByRole('heading', { name: 'Net worth' })).toBeTruthy();
    expect(screen.getByText('$2,400,000')).toBeTruthy();
  });

  it('a positive change reads Up and gets the is-up class', () => {
    render(<KpiCard label="Net worth" value={1} change={4.2} />);
    const line = screen.getByText('Up 4.2%');
    expect(line.classList.contains('is-up')).toBe(true);
  });

  it('a negative change reads Down without the minus sign and gets the is-down class', () => {
    render(<KpiCard label="Spend" value={1} change={-1.5} />);
    const line = screen.getByText('Down 1.5%');
    expect(line.classList.contains('is-down')).toBe(true);
  });

  it('no change prop means no change line at all', () => {
    const { container } = render(<KpiCard label="Cash" value={1} />);
    expect(container.querySelector('.kpi-change')).toBeNull();
  });

  it('children are shown inside the card', () => {
    render(
      <KpiCard label="Savings" value={1}>
        <p>Target: $120,000</p>
      </KpiCard>,
    );
    expect(screen.getByText('Target: $120,000')).toBeTruthy();
  });

  it('different props give different cards from the same component', () => {
    render(<App />);
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(['Net worth', 'Monthly spend', 'Cash on hand', 'Savings']);
    expect(screen.getByText('$8,080,000')).toBeTruthy();
    expect(screen.getByText('Down 1.5%')).toBeTruthy();
  });
});
