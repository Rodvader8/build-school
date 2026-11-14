import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../src/App.jsx';

const names = () => screen.getAllByRole('row').slice(1).map((r) => r.cells[0].textContent);
const click = (name) => fireEvent.click(screen.getByRole('button', { name }));
const sortOf = (name) => screen.getByRole('columnheader', { name }).getAttribute('aria-sort');

beforeEach(() => localStorage.clear());

describe('the KPI card and period toggle', () => {
  it('shows the total value of every entity', () => {
    render(<App />);
    expect(screen.getByText('$8,080,000')).toBeTruthy();
  });

  it('shows the weighted return for 1Y to begin with', () => {
    render(<App />);
    expect(screen.getByText('Up 2.6% over 1Y')).toBeTruthy();
    expect(screen.getByRole('button', { name: '1Y' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('choosing a period updates the return and the pressed button', () => {
    render(<App />);
    click('10Y');
    expect(screen.getByText('Up 79.0% over 10Y')).toBeTruthy();
    expect(screen.getByRole('button', { name: '10Y' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: '1Y' }).getAttribute('aria-pressed')).toBe('false');
  });
});

describe('the table', () => {
  it('has a name, four column headers and one row per entity in the given order', () => {
    render(<App />);
    expect(screen.getByRole('table', { name: 'Entities' })).toBeTruthy();
    expect(screen.getAllByRole('columnheader')).toHaveLength(4);
    expect(names()).toEqual(['Family Trust', 'Rowan Super Fund', 'Harbour Holdings', 'Joint Account', 'Education Trust']);
  });

  it('clicking a header sorts ascending, then descending', () => {
    render(<App />);
    click('Value');
    expect(names()).toEqual(['Education Trust', 'Joint Account', 'Rowan Super Fund', 'Family Trust', 'Harbour Holdings']);
    expect(sortOf('Value')).toBe('ascending');
    click('Value');
    expect(names()).toEqual(['Harbour Holdings', 'Family Trust', 'Rowan Super Fund', 'Joint Account', 'Education Trust']);
    expect(sortOf('Value')).toBe('descending');
  });

  it('a different header starts ascending again and the others reset', () => {
    render(<App />);
    click('Value');
    click('Value');
    click('Name');
    expect(names()).toEqual(['Education Trust', 'Family Trust', 'Harbour Holdings', 'Joint Account', 'Rowan Super Fund']);
    expect(sortOf('Name')).toBe('ascending');
    expect(sortOf('Value')).toBe('none');
  });

  it('the Return column shows the chosen period and sorts by it', () => {
    render(<App />);
    click('Return');
    expect(names()).toEqual(['Harbour Holdings', 'Joint Account', 'Education Trust', 'Family Trust', 'Rowan Super Fund']);
    expect(within(screen.getAllByRole('row')[1]).getByText('-1.8%')).toBeTruthy();
    click('5Y');
    expect(names()).toEqual(['Joint Account', 'Education Trust', 'Harbour Holdings', 'Family Trust', 'Rowan Super Fund']);
    expect(sortOf('Return')).toBe('ascending');
  });
});

describe('remembering the period', () => {
  it('saves the chosen period and restores it on the next visit', () => {
    const first = render(<App />);
    click('10Y');
    expect(localStorage.getItem('dashboard-period')).toBe('10Y');
    first.unmount();
    render(<App />);
    expect(screen.getByText('Up 79.0% over 10Y')).toBeTruthy();
  });

  it('ignores a saved value that is not a real period', () => {
    localStorage.setItem('dashboard-period', 'nonsense');
    render(<App />);
    expect(screen.getByText('Up 2.6% over 1Y')).toBeTruthy();
  });
});
