import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import EntityList from '../src/components/EntityList.jsx';
import { entities } from '../src/data.js';

// Frozen, so any code that changes the array in place (like .reverse() or .sort()) throws.
const data = Object.freeze([...entities]);
const rows = () => screen.getAllByRole('listitem');
const filter = (text) => fireEvent.change(screen.getByLabelText('Filter'), { target: { value: text } });

describe('EntityList', () => {
  it('renders one row per entity', () => {
    render(<EntityList entities={data} />);
    expect(rows()).toHaveLength(5);
  });

  it('each row shows the name, the type and the value', () => {
    render(<EntityList entities={data} />);
    const row = rows()[2];
    expect(row.textContent).toContain('Harbour Holdings');
    expect(row.textContent).toContain('Company');
    expect(row.textContent).toContain('$3,100,000');
  });

  it('filtering by name narrows the list, ignoring capitals', () => {
    render(<EntityList entities={data} />);
    filter('TRUST');
    expect(rows().map((r) => r.textContent)).toEqual([expect.stringContaining('Family Trust'), expect.stringContaining('Education Trust')]);
  });

  it('an empty result says so', () => {
    render(<EntityList entities={data} />);
    filter('zzz');
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.getByText('No entities match "zzz"')).toBeTruthy();
  });

  it('reversing flips the order without changing the original array', () => {
    render(<EntityList entities={data} />);
    fireEvent.click(screen.getByRole('button', { name: 'Reverse order' }));
    expect(rows()[0].textContent).toContain('Education Trust');
    expect(rows()[4].textContent).toContain('Family Trust');
  });

  it('a note stays with its own row when the order changes', () => {
    render(<EntityList entities={data} />);
    fireEvent.change(screen.getByLabelText('Note for Family Trust'), { target: { value: 'Review in June' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reverse order' }));
    expect(screen.getByLabelText('Note for Family Trust').value).toBe('Review in June');
  });

  it('React has no complaints about keys', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<EntityList entities={data} />);
    const messages = spy.mock.calls.map((c) => c.map(String).join(' '));
    spy.mockRestore();
    expect(messages).toEqual([]);
  });
});
