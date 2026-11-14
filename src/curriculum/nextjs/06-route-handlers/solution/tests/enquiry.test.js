// @vitest-environment node
const sent = vi.hoisted(() => vi.fn());
vi.mock('../lib/notify.js', () => ({ sendEnquiry: sent }));

const load = (path) => import(path);
const good = { name: 'Priya Nair', email: 'priya@example.com', message: 'Two dozen cardamom buns for Saturday, please.', website: '' };
const post = (body) => new Request('http://localhost/api/enquiry', { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body) });

beforeEach(() => sent.mockClear());

describe('validating an enquiry', () => {
  it('validateEnquiry accepts a good enquiry and trims it', async () => {
    const { validateEnquiry } = await load('../lib/validate.js');
    const result = validateEnquiry({ ...good, name: '  Priya Nair  ' });
    expect(result.ok).toBe(true);
    expect(result.values.name).toBe('Priya Nair');
    expect(result.errors).toEqual({});
  });

  it('validateEnquiry gives each bad field its own message', async () => {
    const { validateEnquiry } = await load('../lib/validate.js');
    const result = validateEnquiry({ name: 'P', email: 'not-an-email', message: 'short' });
    expect(result.ok).toBe(false);
    expect(Object.keys(result.errors).sort()).toEqual(['email', 'message', 'name']);
    expect(validateEnquiry(null).ok).toBe(false);
    expect(validateEnquiry({ ...good, message: 'x'.repeat(2001) }).errors.message).toBeTruthy();
  });
});

describe('the enquiry route handler', () => {
  it('a valid enquiry returns 201 and is sent on', async () => {
    const { POST } = await load('../app/api/enquiry/route.js');
    const response = await POST(post(good));
    expect(response.status).toBe(201);
    expect((await response.json()).ok).toBe(true);
    expect(sent).toHaveBeenCalledTimes(1);
    expect(sent.mock.calls[0][0]).toMatchObject({ name: 'Priya Nair', email: 'priya@example.com' });
  });

  it('bad fields return 400 with a message per field and send nothing', async () => {
    const { POST } = await load('../app/api/enquiry/route.js');
    const response = await POST(post({ ...good, email: 'nope', message: '' }));
    expect(response.status).toBe(400);
    const { errors } = await response.json();
    expect(Object.keys(errors).sort()).toEqual(['email', 'message']);
    expect(sent).not.toHaveBeenCalled();
  });

  it('broken JSON returns 400 instead of crashing', async () => {
    const { POST } = await load('../app/api/enquiry/route.js');
    const response = await POST(post('{not json'));
    expect(response.status).toBe(400);
  });

  it('a filled honeypot looks like success but sends nothing', async () => {
    const { POST } = await load('../app/api/enquiry/route.js');
    const response = await POST(post({ ...good, website: 'http://spam.example' }));
    expect(response.status).toBe(201);
    expect(sent).not.toHaveBeenCalled();
  });

  it('only POST is handled', async () => {
    const route = await load('../app/api/enquiry/route.js');
    expect(typeof route.POST).toBe('function');
    expect(route.GET).toBeUndefined();
  });
});
