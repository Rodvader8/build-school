// @vitest-environment node
import { sendEnquiry } from '../lib/notify.js';

const values = { name: 'Priya', email: 'priya@example.com', message: 'Hello there, a question please.' };
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('sending the enquiry on', () => {
  it('the webhook address comes from the environment', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('ENQUIRY_WEBHOOK_URL', 'https://hooks.example.invalid/test-address');
    const result = await sendEnquiry(values);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe('https://hooks.example.invalid/test-address');
    expect(result.sent).toBe(true);
  });

  it('with no webhook address it does nothing and says so', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('ENQUIRY_WEBHOOK_URL', '');
    const result = await sendEnquiry(values);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.sent).toBe(false);
  });
});
