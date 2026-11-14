import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { clipboard } from 'expo-clipboard';
import { copyText } from '../lib/copy.js';
import App from '../App.jsx';

beforeEach(() => {
  clipboard.mode = 'ok';
  clipboard.copied.length = 0;
});

describe('copyText', () => {
  it('copyText copies the text and says ok', async () => {
    expect(await copyText('4821')).toEqual({ ok: true });
    expect(clipboard.copied).toEqual(['4821']);
  });

  it('copyText says no instead of throwing when the device refuses', async () => {
    clipboard.mode = 'throw';
    expect(await copyText('4821')).toEqual({ ok: false, reason: 'unavailable' });
    clipboard.mode = 'fail';
    expect(await copyText('4821')).toEqual({ ok: false, reason: 'blocked' });
  });
});

describe('the door code card', () => {
  it('pressing Copy code copies the code and confirms it', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy the door code' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Copied to your clipboard'));
    expect(clipboard.copied).toEqual(['4821']);
    expect(screen.getByRole('button', { name: 'Copy the door code' }).textContent).toBe('Copied');
  });

  it('when copying fails the card explains what to do instead', async () => {
    clipboard.mode = 'throw';
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy the door code' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toMatch(/Couldn't copy.*Press and hold/));
    expect(screen.getByRole('button', { name: 'Copy the door code' }).textContent).toBe('Copy code');
  });

  it('the code is still on screen after a failure', async () => {
    clipboard.mode = 'fail';
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy the door code' }));
    await waitFor(() => expect(screen.getByRole('status')).toBeTruthy());
    expect(screen.getByText('4821')).toBeTruthy();
  });
});
