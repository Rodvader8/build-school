import { Profiler } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import NetWorth from '../src/components/NetWorth.jsx';
import Clock from '../src/components/Clock.jsx';

describe('NetWorth', () => {
  it('the browser tab title follows the chosen period', () => {
    render(<NetWorth />);
    expect(document.title).toBe('Net worth, 1Y | Kestrel');
    fireEvent.click(screen.getByRole('button', { name: '5Y' }));
    expect(document.title).toBe('Net worth, 5Y | Kestrel');
  });

  it('choosing a period renders once, because the change is worked out while rendering', () => {
    let commits = 0;
    render(
      <Profiler id="widget" onRender={() => commits++}>
        <NetWorth />
      </Profiler>,
    );
    commits = 0;
    fireEvent.click(screen.getByRole('button', { name: '10Y' }));
    expect(screen.getByText('Up $4,980,000 (161%) over 10Y')).toBeTruthy();
    expect(commits).toBe(1);
  });
});

describe('Clock', () => {
  beforeEach(() => vi.useFakeTimers({ now: new Date(2026, 0, 5, 9, 30, 0) }));
  afterEach(() => vi.useRealTimers());

  it('shows the time and ticks every second', () => {
    const { container } = render(<Clock />);
    const clock = container.querySelector('time');
    expect(clock.textContent).toContain('09:30:00');
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(clock.textContent).toContain('09:30:01');
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(clock.textContent).toContain('09:30:03');
  });

  it('stops its timer when it leaves the page', () => {
    const { unmount } = render(<Clock />);
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
