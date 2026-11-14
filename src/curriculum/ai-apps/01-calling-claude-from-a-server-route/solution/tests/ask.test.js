// These tests start the pretend Anthropic API from mock/ on a spare port. No network, no real key, no cost.
import { startMockServer } from '../mock/server.mjs';
import { keyFrom } from '../mock/anthropic-mock.js';

let mock;
beforeAll(async () => {
  mock = await startMockServer();
});
afterAll(() => mock.close());
beforeEach(() => {
  mock.reset();
  process.env.ANTHROPIC_API_KEY = 'test-key-not-real';
  process.env.CLAUDE_BASE_URL = mock.url;
});

const post = (body) => new Request('http://localhost/api/ask', { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body) });

describe('the client', () => {
  it('the client reads the key and address from the environment', async () => {
    const { askClaude } = await import('../lib/ask.js');
    process.env.ANTHROPIC_API_KEY = 'another-fake-key';
    await askClaude('Is there parking?');
    expect(mock.requests).toHaveLength(1);
    expect(keyFrom(mock.requests[0].headers)).toBe('another-fake-key');
  });

  it('a missing key gives a clear error instead of a mystery', async () => {
    const { createClaude, MissingKeyError } = await import('../lib/claude.js');
    delete process.env.ANTHROPIC_API_KEY;
    expect(() => createClaude()).toThrow(MissingKeyError);
  });
});

describe('asking Claude', () => {
  it('sends the model, a token limit, a system prompt and the question', async () => {
    const { askClaude } = await import('../lib/ask.js');
    await askClaude('Is there parking?');
    const sent = mock.requests[0].body;
    expect(mock.requests[0].path).toBe('/v1/messages');
    expect(sent.model).toBe('claude-opus-5-5');
    expect(sent.max_tokens).toBeGreaterThan(0);
    expect(String(JSON.stringify(sent.system))).toMatch(/Harbour Hall/);
    expect(sent.messages).toEqual([{ role: 'user', content: 'Is there parking?' }]);
  });

  it('returns the answer text and the token usage', async () => {
    const { askClaude } = await import('../lib/ask.js');
    const result = await askClaude('Is there parking?');
    expect(result.answer).toContain('Is there parking?');
    expect(result.usage.inputTokens).toBeGreaterThan(0);
    expect(result.usage.outputTokens).toBeGreaterThan(0);
  });
});

describe('the /api/ask route', () => {
  it('a good question returns 200 with the answer', async () => {
    const { POST } = await import('../app/api/ask/route.js');
    const response = await POST(post({ question: 'Can we bring our own cake?' }));
    expect(response.status).toBe(200);
    expect((await response.json()).answer).toContain('own cake');
  });

  it('an empty, missing or oversized question returns 400 and calls nothing', async () => {
    const { POST } = await import('../app/api/ask/route.js');
    for (const body of [{ question: '   ' }, {}, { question: 42 }, 'not json', { question: 'x'.repeat(501) }]) {
      expect((await POST(post(body))).status, JSON.stringify(body)).toBe(400);
    }
    expect(mock.requests).toHaveLength(0);
  });

  it('a rejected key becomes a safe 502 that leaks nothing', async () => {
    const { POST } = await import('../app/api/ask/route.js');
    process.env.ANTHROPIC_API_KEY = 'wrong-key';
    const response = await POST(post({ question: 'Hello?' }));
    expect(response.status).toBe(502);
    const text = await response.text();
    expect(text).not.toMatch(/wrong-key|x-api-key/);
  });

  it('with no key set the route returns 500 and says so', async () => {
    const { POST } = await import('../app/api/ask/route.js');
    delete process.env.ANTHROPIC_API_KEY;
    const response = await POST(post({ question: 'Hello?' }));
    expect(response.status).toBe(500);
    expect((await response.json()).error).toMatch(/no API key/i);
  });
});
