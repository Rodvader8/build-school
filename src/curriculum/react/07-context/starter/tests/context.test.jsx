import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import App from '../src/App.jsx';
import { PeriodProvider, usePeriod } from '../src/period-context.jsx';
import Summary from '../src/components/Summary.jsx';
import PeriodToggle from '../src/components/PeriodToggle.jsx';

function Probe() {
  return <p>{usePeriod().period}</p>;
}

describe('the period context', () => {
  it('usePeriod gives a clear error outside a provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow('usePeriod must be used inside a PeriodProvider');
    spy.mockRestore();
  });

  it('the provider starts on 1Y by default', () => {
    render(
      <PeriodProvider>
        <Probe />
      </PeriodProvider>,
    );
    expect(screen.getByText('1Y')).toBeTruthy();
  });

  it('the provider can start on another period', () => {
    render(
      <PeriodProvider initial="5Y">
        <Summary />
      </PeriodProvider>,
    );
    expect(screen.getByRole('heading', { name: 'Return over 5Y' })).toBeTruthy();
  });

  it('the toggle marks the current period as pressed', () => {
    render(
      <PeriodProvider initial="5Y">
        <PeriodToggle />
      </PeriodProvider>,
    );
    expect(screen.getByRole('button', { name: '5Y' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: '1Y' }).getAttribute('aria-pressed')).toBe('false');
  });
});

describe('the dashboard', () => {
  it('one toggle updates the summary and the breakdown, with no props passed down', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Return over 1Y' })).toBeTruthy();
    expect(screen.getByText('4.2%')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '5Y' }));
    expect(screen.getByRole('heading', { name: 'Return over 5Y' })).toBeTruthy();
    expect(screen.getByText('31.5%')).toBeTruthy();
    expect(screen.getByText('29.2%')).toBeTruthy();
    expect(screen.getByRole('button', { name: '5Y' }).getAttribute('aria-pressed')).toBe('true');
  });
});
