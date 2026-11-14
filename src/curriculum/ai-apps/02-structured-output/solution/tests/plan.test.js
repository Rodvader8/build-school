// The pretend Anthropic API in mock/ can misbehave on purpose: put [mock:refusal], [mock:truncate],
// [mock:malformed] or [mock:invalid] in a brief to trigger each failure.
import { startMockServer } from '../mock/server.mjs';
import { TRIGGERS } from '../mock/anthropic-mock.js';

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

const post = (body) => new Request('http://localhost/api/plan', { method: 'POST', body: JSON.stringify(body) });
const good = { title: 'Garden party', venue: 'Garden room', guests: 40, schedule: [{ time: '16:00', activity: 'Arrive' }], budget: [{ item: 'Hire', cost: 100 }], notes: 'None.' };

describe('the schema', () => {
  it('the schema accepts a good plan', async () => {
    const { PlanSchema } = await import('../lib/schema.js');
    expect(PlanSchema.safeParse(good).success).toBe(true);
  });

  it('the schema rejects guests, times and costs that make no sense', async () => {
    const { PlanSchema } = await import('../lib/schema.js');
    const bad = [
      { ...good, guests: 0 },
      { ...good, guests: 12.5 },
      { ...good, schedule: [] },
      { ...good, schedule: [{ time: 'half past four', activity: 'Arrive' }] },
      { ...good, budget: [{ item: 'Hire', cost: -5 }] },
      { ...good, venue: undefined },
    ];
    for (const plan of bad) expect(PlanSchema.safeParse(plan).success, JSON.stringify(plan)).toBe(false);
  });
});

describe('generating a plan', () => {
  it('asks the API for JSON that matches the schema', async () => {
    const { generatePlan } = await import('../lib/plan.js');
    await generatePlan('A garden party for 40.');
    const format = mock.requests[0].body.output_config?.format;
    expect(format?.type).toBe('json_schema');
    expect(Object.keys(format.schema.properties).sort()).toEqual(['budget', 'guests', 'notes', 'schedule', 'title', 'venue']);
  });

  it('returns a checked plan on a good reply', async () => {
    const { generatePlan } = await import('../lib/plan.js');
    const plan = await generatePlan('A garden party for 40.');
    expect(plan.guests).toBe(40);
    expect(plan.schedule[0]).toEqual({ time: '16:00', activity: expect.any(String) });
  });

  it('a refusal is reported as refused, not read as a plan', async () => {
    const { generatePlan } = await import('../lib/plan.js');
    await expect(generatePlan(`Plan it ${TRIGGERS.refusal}`)).rejects.toMatchObject({ kind: 'refused' });
  });

  it('a reply cut off by max_tokens is reported as truncated', async () => {
    const { generatePlan } = await import('../lib/plan.js');
    await expect(generatePlan(`Plan it ${TRIGGERS.truncate}`)).rejects.toMatchObject({ kind: 'truncated' });
  });

  it('text that is not JSON is reported as malformed', async () => {
    const { generatePlan } = await import('../lib/plan.js');
    await expect(generatePlan(`Plan it ${TRIGGERS.malformed}`)).rejects.toMatchObject({ kind: 'malformed' });
  });

  it('JSON with the wrong shape is reported as invalid and names the fields', async () => {
    const { generatePlan } = await import('../lib/plan.js');
    const error = await generatePlan(`Plan it ${TRIGGERS.invalid}`).catch((e) => e);
    expect(error.kind).toBe('invalid');
    expect(error.issues.join(' ')).toMatch(/guests/);
    expect(error.issues.join(' ')).toMatch(/schedule/);
  });
});

describe('the /api/plan route', () => {
  it('a good brief returns 200 and the plan', async () => {
    const { POST } = await import('../app/api/plan/route.js');
    const response = await POST(post({ brief: 'A garden party for 40.' }));
    expect(response.status).toBe(200);
    expect((await response.json()).plan.guests).toBe(40);
  });

  it('each kind of failure gets a status and a plain message', async () => {
    const { POST } = await import('../app/api/plan/route.js');
    const cases = [
      [TRIGGERS.refusal, 422, 'refused'],
      [TRIGGERS.truncate, 502, 'truncated'],
      [TRIGGERS.malformed, 502, 'malformed'],
      [TRIGGERS.invalid, 502, 'invalid'],
    ];
    for (const [trigger, status, kind] of cases) {
      const response = await POST(post({ brief: `Plan it ${trigger}` }));
      expect(response.status, kind).toBe(status);
      const data = await response.json();
      expect(data.kind).toBe(kind);
      expect(data.plan).toBeUndefined();
      expect(data.error).toBeTruthy();
    }
  });

  it('an empty brief returns 400 without calling Claude', async () => {
    const { POST } = await import('../app/api/plan/route.js');
    expect((await POST(post({ brief: '  ' }))).status).toBe(400);
    expect(mock.requests).toHaveLength(0);
  });
});
