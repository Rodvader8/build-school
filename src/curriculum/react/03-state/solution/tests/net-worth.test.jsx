import { render, screen, fireEvent } from '@testing-library/react';
import NetWorth from '../src/components/NetWorth.jsx';

const pressed = (name) => screen.getByRole('button', { name }).getAttribute('aria-pressed');

describe('NetWorth', () => {
  it('starts on 1Y with the figure and the change for that period', () => {
    render(<NetWorth />);
    expect(screen.getByText('$8,080,000')).toBeTruthy();
    expect(screen.getByText('Up $690,000 (9%) over 1Y')).toBeTruthy();
  });

  it('every period button says whether it is pressed', () => {
    render(<NetWorth />);
    expect(pressed('1Y')).toBe('true');
    expect(pressed('5Y')).toBe('false');
    expect(pressed('10Y')).toBe('false');
  });

  it('choosing 5Y updates the change line and the pressed button', () => {
    render(<NetWorth />);
    fireEvent.click(screen.getByRole('button', { name: '5Y' }));
    expect(screen.getByText('Up $2,880,000 (55%) over 5Y')).toBeTruthy();
    expect(pressed('5Y')).toBe('true');
    expect(pressed('1Y')).toBe('false');
  });

  it('you can move between periods and the numbers follow', () => {
    render(<NetWorth />);
    fireEvent.click(screen.getByRole('button', { name: '10Y' }));
    expect(screen.getByText('Up $4,980,000 (161%) over 10Y')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '1Y' }));
    expect(screen.getByText('Up $690,000 (9%) over 1Y')).toBeTruthy();
  });

  it('the explanation is hidden until asked for, then can be hidden again', () => {
    render(<NetWorth />);
    const toggle = screen.getByRole('button', { name: /how this is worked out/i });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText(/measured from the value at the start/i)).toBeNull();
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText(/measured from the value at the start/i)).toBeTruthy();
    fireEvent.click(toggle);
    expect(screen.queryByText(/measured from the value at the start/i)).toBeNull();
  });

  it('each copy of the component keeps its own state', () => {
    render(
      <>
        <NetWorth />
        <NetWorth />
      </>,
    );
    fireEvent.click(screen.getAllByRole('button', { name: '5Y' })[0]);
    expect(screen.getAllByRole('button', { name: '5Y' })[0].getAttribute('aria-pressed')).toBe('true');
    expect(screen.getAllByRole('button', { name: '5Y' })[1].getAttribute('aria-pressed')).toBe('false');
  });
});
