import { render, screen, fireEvent } from '@testing-library/react';
import { cloneElement } from 'react';
import { forecastCash, lowestBalance, cashOutMonth } from '../src/forecast.js';
import ScenarioPanel from '../src/components/ScenarioPanel.jsx';

// ResponsiveContainer measures its parent, which is 0 by 0 in a test, so give it a fixed size instead.
vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, ResponsiveContainer: ({ children }) => cloneElement(children, { width: 720, height: 288 }) };
});

const base = { opening: 50000, months: 6, revenue: 40000, growth: 0, costs: 38000 };
const balances = (series) => series.map((row) => row.balance);

describe('the forecast maths', () => {
  it('without a hire, the balance rises by income minus costs each month', () => {
    const series = forecastCash(base);
    expect(series).toHaveLength(6);
    expect(series[0]).toEqual({ month: 1, income: 40000, outgoings: 38000, balance: 52000 });
    expect(balances(series)).toEqual([52000, 54000, 56000, 58000, 60000, 62000]);
  });

  it('income grows by the growth rate every month after the first', () => {
    const series = forecastCash({ opening: 0, months: 3, revenue: 1000, growth: 0.1, costs: 0 });
    expect(series.map((r) => r.income)).toEqual([1000, 1100, 1210]);
    expect(balances(series)).toEqual([1000, 2100, 3310]);
  });

  it('a hire adds their salary from the start month, and extra revenue once they have ramped up', () => {
    const hire = { salary: 6000, startMonth: 3, rampMonths: 2, extraRevenue: 5000 };
    const series = forecastCash({ ...base, hire });
    expect(series[2].outgoings).toBe(44000);
    expect(series[3].income).toBe(40000);
    expect(series[4].income).toBe(45000);
    expect(balances(series)).toEqual([52000, 54000, 50000, 46000, 47000, 48000]);
  });

  it('a hire with no extra revenue just costs money, and the ramp defaults to two months', () => {
    const series = forecastCash({ opening: 10000, months: 6, revenue: 40000, costs: 38000, hire: { salary: 9000, startMonth: 2 } });
    expect(balances(series)).toEqual([12000, 5000, -2000, -9000, -16000, -23000]);
  });

  it('lowestBalance finds the smallest balance and its month', () => {
    const series = forecastCash({ ...base, hire: { salary: 6000, startMonth: 3, rampMonths: 2, extraRevenue: 5000 } });
    expect(lowestBalance(series)).toEqual({ month: 4, balance: 46000 });
    expect(lowestBalance(forecastCash(base))).toEqual({ month: 1, balance: 52000 });
  });

  it('cashOutMonth gives the first month below zero, or null', () => {
    const tight = forecastCash({ opening: 10000, months: 6, revenue: 40000, costs: 38000, hire: { salary: 9000, startMonth: 2 } });
    expect(cashOutMonth(tight)).toBe(3);
    expect(cashOutMonth(forecastCash(base))).toBeNull();
  });
});

describe('the what-if panel', () => {
  const lowest = () => screen.getByRole('heading', { name: 'Lowest balance' }).parentElement.textContent;

  it('starts with the switch off: one line, and cash that stays positive', () => {
    const { container } = render(<ScenarioPanel />);
    expect(screen.getByRole('switch', { name: 'What if we hire?' }).getAttribute('aria-checked')).toBe('false');
    expect(container.querySelectorAll('.recharts-line')).toHaveLength(1);
    expect(lowest()).toContain('$52,000');
    expect(lowest()).toContain('in month 1');
    expect(screen.getByRole('status').textContent).toBe('Cash stays positive for all 12 months');
    expect(screen.queryByLabelText('Monthly salary')).toBeNull();
  });

  it('turning the switch on adds a second line and changes the numbers', () => {
    const { container } = render(<ScenarioPanel />);
    fireEvent.click(screen.getByRole('switch', { name: 'What if we hire?' }));
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('true');
    expect(container.querySelectorAll('.recharts-line')).toHaveLength(2);
    expect(lowest()).toContain('$46,000');
    expect(lowest()).toContain('in month 4');
  });

  it('the salary and start month inputs rework the forecast', () => {
    render(<ScenarioPanel />);
    fireEvent.click(screen.getByRole('switch'));
    fireEvent.change(screen.getByLabelText('Monthly salary'), { target: { value: '20000' } });
    expect(screen.getByRole('status').textContent).toBe('Cash runs out in month 6');
    fireEvent.change(screen.getByLabelText('Starts in month'), { target: { value: '10' } });
    expect(screen.getByRole('status').textContent).toBe('Cash stays positive for all 12 months');
  });

  it('turning the switch off again goes back to the baseline', () => {
    const { container } = render(<ScenarioPanel />);
    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    expect(container.querySelectorAll('.recharts-line')).toHaveLength(1);
    expect(lowest()).toContain('$52,000');
  });
});
