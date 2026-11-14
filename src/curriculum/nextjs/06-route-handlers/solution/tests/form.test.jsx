import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EnquiryForm from '../components/EnquiryForm.jsx';

afterEach(() => vi.unstubAllGlobals());

const fill = () => {
  fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Priya Nair' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'priya@example.com' } });
  fireEvent.change(screen.getByLabelText('What do you need?'), { target: { value: 'Two dozen buns for Saturday.' } });
};

describe('the enquiry form', () => {
  it('has a honeypot field that people and screen readers skip', () => {
    const { container } = render(<EnquiryForm />);
    const trap = container.querySelector('input[name="website"]');
    expect(trap).toBeTruthy();
    expect(trap.getAttribute('tabindex')).toBe('-1');
    expect(trap.closest('[aria-hidden="true"]')).toBeTruthy();
  });

  it('posts the fields as JSON and then says thanks', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal('fetch', fetchMock);
    render(<EnquiryForm />);
    fill();
    fireEvent.click(screen.getByRole('button', { name: 'Send enquiry' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toMatch(/Thanks/));
    expect(fetchMock.mock.calls[0][0]).toBe('/api/enquiry');
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ name: 'Priya Nair', website: '' });
  });

  it('shows the server\'s messages next to the fields', async () => {
    const response = { ok: false, json: async () => ({ errors: { email: 'Please enter a valid email address.' } }) };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
    render(<EnquiryForm />);
    fireEvent.click(screen.getByRole('button', { name: 'Send enquiry' }));
    expect((await screen.findByRole('alert')).textContent).toBe('Please enter a valid email address.');
  });
});
