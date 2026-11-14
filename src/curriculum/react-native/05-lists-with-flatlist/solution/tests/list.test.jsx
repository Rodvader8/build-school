import { render, screen, fireEvent } from '@testing-library/react';
import ArrivalsList from '../components/ArrivalsList.jsx';
import { arrivals } from '../data/arrivals.js';

describe('the arrivals list', () => {
  it('every arrival is listed with name, room and time', () => {
    render(<ArrivalsList arrivals={arrivals} />);
    expect(screen.getByText('Priya Nair')).toBeTruthy();
    expect(screen.getByText('Garden Room, expected 15:00')).toBeTruthy();
    expect(screen.getAllByRole('button')).toHaveLength(arrivals.length);
  });

  it('an empty list shows a friendly message', () => {
    render(<ArrivalsList arrivals={[]} />);
    expect(screen.getByText('No arrivals today')).toBeTruthy();
  });

  it('a row keeps its own state when the order changes', () => {
    const [priya, ben] = arrivals;
    const { rerender } = render(<ArrivalsList arrivals={[priya, ben]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Check in Priya Nair' }));
    expect(screen.getByRole('button', { name: 'Check in Priya Nair' }).textContent).toBe('Checked in');

    // Ben arrives early and jumps to the top. Priya is still the one who's checked in.
    rerender(<ArrivalsList arrivals={[ben, priya]} />);
    expect(screen.getByRole('button', { name: 'Check in Priya Nair' }).textContent).toBe('Checked in');
    expect(screen.getByRole('button', { name: 'Check in Ben Okafor' }).textContent).toBe('Check in');
  });

  it('a new arrival at the top does not steal the next guest\'s state', () => {
    const [priya, ben, chen] = arrivals;
    const { rerender } = render(<ArrivalsList arrivals={[priya, ben]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Check in Priya Nair' }));
    rerender(<ArrivalsList arrivals={[chen, priya, ben]} />);
    expect(screen.getByRole('button', { name: 'Check in Chen Wei' }).textContent).toBe('Check in');
    expect(screen.getByRole('button', { name: 'Check in Priya Nair' }).textContent).toBe('Checked in');
  });

  it('a long list only draws the rows near the screen', () => {
    const many = Array.from({ length: 300 }, (_, i) => ({ ref: `MR-${2000 + i}`, name: `Guest ${i}`, room: 'Loft', eta: '15:00' }));
    render(<ArrivalsList arrivals={many} />);
    expect(screen.getAllByRole('button').length).toBeLessThan(60);
  });

  it('the list gives React no key warnings', () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warns = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<ArrivalsList arrivals={arrivals} />);
    const noisy = [...errors.mock.calls, ...warns.mock.calls].filter((call) => /key/i.test(String(call[0])));
    errors.mockRestore();
    warns.mockRestore();
    expect(noisy).toHaveLength(0);
  });
});
