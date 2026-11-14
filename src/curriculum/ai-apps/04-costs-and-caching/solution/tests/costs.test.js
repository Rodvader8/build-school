import { startMockServer } from '../mock/server.mjs';

let mock;
beforeAll(async () => {
  mock = await startMockServer();
});
afterAll(() => mock.close());
beforeEach(() => {
  mock.reset();
  process.env.ANTHROPIC_API_KEY = 'test-key-not-real';
  process.env.CLAUDE_BASE_URL = mock.url;
  process.env.MAX_REQUEST_USD = '0.10';
});

const near = (a, b) => expect(Math.abs(a - b)).toBeLessThan(1e-9);
const enquiry = "Hi, we're getting married in March, about 50 guests. Do you do grazing tables?";
const post = (body) => new Request('http://localhost/api/triage', { method: 'POST', body: JSON.stringify(body) });
const messagesSent = () => mock.requests.filter((r) => r.path === '/v1/messages');

describe('working out what a call costs', () => {
  it('costOf prices input and output tokens per million', async () => {
    const { costOf } = await import('../lib/pricing.js');
    near(costOf('claude-opus-5-5', { input_tokens: 1_000_000, output_tokens: 1_000_000 }), 24);
    near(costOf('claude-haiku-5-5', { input_tokens: 1_000_000, output_tokens: 1_000_000 }), 0.6);
  });

  it('cache reads cost a tenth of normal input and cache writes a quarter more', async () => {
    const { costOf } = await import('../lib/pricing.js');
    near(costOf('claude-opus-5-5', { cache_read_input_tokens: 1_000_000 }), 0.4);
    near(costOf('claude-opus-5-5', { cache_creation_input_tokens: 1_000_000 }), 5);
  });

  it('a model with no price is an error, not a free call', async () => {
    const { costOf } = await import('../lib/pricing.js');
    expect(() => costOf('some-future-model', { input_tokens: 10, output_tokens: 10 })).toThrow();
  });
});

describe('choosing the model', () => {
  it('simple steps use the small model and planning uses the big one', async () => {
    const { chooseModel } = await import('../lib/models.js');
    expect(chooseModel('classify')).toBe('claude-haiku-5-5');
    expect(chooseModel('plan')).toBe('claude-opus-5-5');
    expect(() => chooseModel('nonsense')).toThrow();
  });

  it('the classify call goes to the small model with a small token limit', async () => {
    const { triageEnquiry } = await import('../lib/triage.js');
    const result = await triageEnquiry(enquiry);
    const [first, second] = messagesSent();
    expect(first.body.model).toBe('claude-haiku-5-5');
    expect(first.body.max_tokens).toBeLessThanOrEqual(300);
    expect(second.body.model).toBe('claude-opus-5-5');
    expect(result.category).toBe('wedding');
  });
});

describe('prompt caching', () => {
  it('the handbook is marked for caching, comes first and holds nothing that changes', async () => {
    const { triageEnquiry } = await import('../lib/triage.js');
    await triageEnquiry(enquiry);
    const system = messagesSent()[1].body.system;
    expect(Array.isArray(system)).toBe(true);
    expect(system[0].text).toMatch(/Harbour Hall/);
    expect(system[0].cache_control).toEqual({ type: 'ephemeral' });
    expect(JSON.stringify(system)).not.toContain('getting married');
  });

  it('the second enquiry reads the handbook from the cache', async () => {
    const { triageEnquiry } = await import('../lib/triage.js');
    const first = await triageEnquiry(enquiry);
    const second = await triageEnquiry('Can we hire the Boatshed for a staff workshop next month?');
    expect(first.usage.plan.cacheWriteTokens).toBeGreaterThan(0);
    expect(first.usage.plan.cacheReadTokens).toBe(0);
    expect(second.usage.plan.cacheReadTokens).toBeGreaterThan(0);
    expect(second.usage.plan.usd).toBeLessThan(first.usage.plan.usd);
  });

  it('the total is worked out from the real usage numbers', async () => {
    const { triageEnquiry } = await import('../lib/triage.js');
    const { costOf } = await import('../lib/pricing.js');
    const result = await triageEnquiry(enquiry);
    near(result.totalUsd, result.usage.classify.usd + result.usage.plan.usd);
    expect(result.usage.plan.usd).toBeGreaterThan(0);
    near(result.usage.plan.usd, costOf('claude-opus-5-5', { input_tokens: result.usage.plan.inputTokens, output_tokens: result.usage.plan.outputTokens, cache_creation_input_tokens: result.usage.plan.cacheWriteTokens, cache_read_input_tokens: result.usage.plan.cacheReadTokens }));
  });
});

describe('the budget guard', () => {
  it('counts the tokens first, then lets a cheap request through', async () => {
    const { triageEnquiry } = await import('../lib/triage.js');
    await triageEnquiry(enquiry);
    const paths = mock.requests.map((r) => r.path);
    expect(paths.indexOf('/v1/messages/count_tokens')).toBeGreaterThan(-1);
    expect(paths.indexOf('/v1/messages/count_tokens')).toBeLessThan(paths.lastIndexOf('/v1/messages'));
  });

  it('a request that could cost too much is refused before it is sent', async () => {
    const { triageEnquiry } = await import('../lib/triage.js');
    const { BudgetError } = await import('../lib/budget.js');
    process.env.MAX_REQUEST_USD = '0.001';
    await expect(triageEnquiry(enquiry)).rejects.toBeInstanceOf(BudgetError);
    // Only the cheap classify call went out. The expensive one never did.
    expect(messagesSent().map((r) => r.body.model)).toEqual(['claude-haiku-5-5']);
  });
});

describe('the /api/triage route', () => {
  it('returns the category, the reply, and what it cost', async () => {
    const { POST } = await import('../app/api/triage/route.js');
    const response = await POST(post({ enquiry }));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.category).toBe('wedding');
    expect(data.reply).toBeTruthy();
    expect(data.totalUsd).toBeGreaterThan(0);
  });

  it('an over-budget request returns 422 with kind budget, and a bad body returns 400', async () => {
    const { POST } = await import('../app/api/triage/route.js');
    process.env.MAX_REQUEST_USD = '0.001';
    const over = await POST(post({ enquiry }));
    expect(over.status).toBe(422);
    expect((await over.json()).kind).toBe('budget');
    expect((await POST(post({ enquiry: '  ' }))).status).toBe(400);
  });
});
