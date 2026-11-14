import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App.jsx';
import { rooms } from '../data/rooms.js';

describe('the room list', () => {
  it('every room has a name heading and a description', () => {
    render(<App />);
    for (const room of rooms) {
      expect(screen.getByRole('heading', { name: room.name })).toBeTruthy();
      expect(screen.getByText(room.description)).toBeTruthy();
    }
  });

  it('every room has a photo with text for screen readers', () => {
    render(<App />);
    const photos = screen.getAllByRole('img');
    expect(photos).toHaveLength(rooms.length);
    for (const photo of photos) expect(photo.getAttribute('alt')).toMatch(/^Photo of the /);
  });

  it('pressing Hold this room holds it, and pressing again lets it go', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: 'Hold the Loft' });
    expect(button.textContent).toBe('Hold this room');
    fireEvent.click(button);
    expect(button.textContent).toBe('Held for 24 hours');
    fireEvent.click(button);
    expect(button.textContent).toBe('Hold this room');
  });

  it('holding one room leaves the others alone', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Hold the Garden Room' }));
    expect(screen.getAllByText('Hold this room')).toHaveLength(rooms.length - 1);
  });

  it('the list gives React a key for every room', () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<App />);
    const keyWarnings = errors.mock.calls.filter((call) => String(call[0]).includes('unique "key"'));
    errors.mockRestore();
    expect(keyWarnings).toHaveLength(0);
  });
});
