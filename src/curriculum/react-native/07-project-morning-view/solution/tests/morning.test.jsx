import { render, screen, fireEvent, within } from '@testing-library/react';
import { occupancyPercent, sortByArrival, earlyArrivals } from '../lib/summary.js';
import MorningView from '../app/index.jsx';
import { morning } from '../data/morning.js';

const arrivalNames = () => screen.getAllByText(/^(Chen Wei|Priya Nair|Sofia Rossi|Ben Okafor|Amara Singh|Tom Hartley)$/).map((el) => el.textContent);

describe('the numbers', () => {
  it('occupancyPercent gives a whole percentage and never NaN', () => {
    expect(occupancyPercent(18, 24)).toBe(75);
    expect(occupancyPercent(1, 3)).toBe(33);
    expect(occupancyPercent(0, 0)).toBe(0);
  });

  it('sortByArrival puts the earliest first without touching the original', () => {
    const copy = [...morning.arrivals];
    expect(sortByArrival(morning.arrivals).map((a) => a.eta)).toEqual(['09:45', '11:30', '13:00', '14:00', '16:45', '17:15']);
    expect(morning.arrivals).toEqual(copy);
  });

  it('earlyArrivals keeps only arrivals before 2pm', () => {
    expect(earlyArrivals(morning.arrivals).map((a) => a.name).sort()).toEqual(['Ben Okafor', 'Priya Nair', 'Tom Hartley']);
  });
});

describe('the morning screen', () => {
  it('the occupancy card says how many rooms are occupied and the percentage', () => {
    render(<MorningView />);
    expect(screen.getByText('75%')).toBeTruthy();
    expect(screen.getByText('18 of 24 rooms occupied')).toBeTruthy();
  });

  it('the occupancy card draws one dot per room, filled for the occupied ones', () => {
    render(<MorningView />);
    expect(screen.getAllByTestId('dot-on')).toHaveLength(18);
    expect(screen.getAllByTestId('dot-off')).toHaveLength(6);
  });

  it('arrivals are listed earliest first', () => {
    render(<MorningView />);
    expect(arrivalNames()).toEqual(['Tom Hartley', 'Priya Nair', 'Ben Okafor', 'Amara Singh', 'Chen Wei', 'Sofia Rossi']);
  });

  it('the toggle is labelled so a screen reader can find it', () => {
    render(<MorningView />);
    expect(screen.getByRole('switch', { name: /early arrivals only/i })).toBeTruthy();
  });

  it('turning the toggle on shows only early arrivals, and off brings everyone back', () => {
    render(<MorningView />);
    fireEvent.click(screen.getByRole('switch', { name: /early arrivals only/i }));
    expect(arrivalNames()).toEqual(['Tom Hartley', 'Priya Nair', 'Ben Okafor']);
    expect(screen.getByText('3 arrivals')).toBeTruthy();
    fireEvent.click(screen.getByRole('switch', { name: /early arrivals only/i }));
    expect(arrivalNames()).toHaveLength(6);
    expect(screen.getByText('6 arrivals')).toBeTruthy();
  });

  it('a long list only draws the rows near the screen', () => {
    // The screen reads its data from data/morning.js. Fill it with 300 arrivals and count what's drawn.
    const original = [...morning.arrivals];
    for (let i = 0; i < 300; i++) morning.arrivals.push({ ref: `MR-${3000 + i}`, name: `Guest ${i}`, room: 'Room 1', eta: '15:00' });
    render(<MorningView />);
    const drawn = screen.getAllByText(/^Guest \d+$/).length;
    morning.arrivals.splice(0, morning.arrivals.length, ...original);
    expect(drawn).toBeLessThan(80);
  });
});

describe('the empty state', () => {
  it('with nobody early, the toggle shows a friendly message', () => {
    const original = [...morning.arrivals];
    morning.arrivals.splice(0, morning.arrivals.length, { ref: 'MR-1', name: 'Sofia Rossi', room: 'Loft', eta: '17:15' });
    render(<MorningView />);
    fireEvent.click(screen.getByRole('switch', { name: /early arrivals only/i }));
    const message = screen.getByText('No early arrivals');
    morning.arrivals.splice(0, morning.arrivals.length, ...original);
    expect(message).toBeTruthy();
  });
});
