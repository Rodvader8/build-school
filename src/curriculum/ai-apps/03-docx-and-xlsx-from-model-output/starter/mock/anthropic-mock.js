// A pretend Anthropic API. It answers like the Messages API does (same JSON shapes, same error shapes),
// but nothing leaves your machine, nothing costs money and no real key is involved.
// The app's own tests start it on a spare port; the dev server also serves it under /mock.
// You don't need to edit this file. Skip to lib/ and app/.
import { createHash } from 'node:crypto';

// Special words in the user's message make the mock misbehave on purpose, so you can test the unhappy paths.
export const TRIGGERS = {
  refusal: '[mock:refusal]', // the model declines: stop_reason "refusal"
  truncate: '[mock:truncate]', // runs out of max_tokens halfway through the JSON
  malformed: '[mock:malformed]', // chatty text instead of JSON
  invalid: '[mock:invalid]', // valid JSON, wrong shape
};

const approxTokens = (value) => Math.ceil((typeof value === 'string' ? value : JSON.stringify(value ?? '')).length / 4);
const textOf = (content) => (typeof content === 'string' ? content : (content ?? []).map((b) => b.text ?? '').join(' '));
const cachedPrefixes = new Set();
let counter = 0;

export function resetMock() {
  cachedPrefixes.clear();
  counter = 0;
}

/** The key the SDK sent. Recent SDK versions use "Authorization: Bearer ...", older ones "x-api-key". The API accepts both. */
export const keyFrom = (headers) => headers['x-api-key'] || (headers.authorization ?? '').replace(/^Bearer\s+/i, '');

const problem = (status, type, message) => ({ status, body: { type: 'error', error: { type, message } } });

/** The plan the mock "writes" when it's asked for structured output. */
export const MOCK_PLAN = {
  title: 'Harbour Hall: Priya and Sam, garden party',
  venue: 'Harbour Hall, garden room',
  guests: 40,
  schedule: [
    { time: '16:00', activity: 'Guests arrive, welcome drinks on the terrace' },
    { time: '17:00', activity: 'Short speeches' },
    { time: '17:30', activity: 'Grazing tables served' },
    { time: '20:00', activity: 'Pack down' },
  ],
  budget: [
    { item: 'Venue hire', cost: 1200 },
    { item: 'Catering', cost: 1600 },
    { item: 'Flowers', cost: 350 },
  ],
  notes: 'Confirm the rain plan with the venue two days before.',
};

/** What the mock says back, chosen by what the user's message asks for. */
function reply(body, userText) {
  const maxTokens = body.max_tokens;
  if (userText.includes(TRIGGERS.refusal)) return { text: null, stop: 'refusal' };
  if (userText.includes(TRIGGERS.truncate)) return { text: JSON.stringify(MOCK_PLAN).slice(0, 40), stop: 'max_tokens', outputTokens: maxTokens };
  if (userText.includes(TRIGGERS.malformed)) return { text: 'Sure! Here is a lovely plan for you, but I forgot the JSON.', stop: 'end_turn' };
  if (userText.includes(TRIGGERS.invalid)) return { text: JSON.stringify({ title: 'No guests or schedule here' }), stop: 'end_turn' };
  if (body.output_config?.format) return { text: JSON.stringify(MOCK_PLAN), stop: 'end_turn' };
  if (/categor|classify/i.test(JSON.stringify(body.system ?? '')) ) {
    return { text: /wedding|married|engagement/i.test(userText) ? 'wedding' : /conference|company|staff|workshop/i.test(userText) ? 'corporate' : 'other', stop: 'end_turn' };
  }
  return { text: `This is a stand-in answer from the local mock. You asked: "${userText.slice(0, 80)}"`, stop: 'end_turn' };
}

/** POST /v1/messages */
export function mockMessages(headers, body) {
  const key = keyFrom(headers);
  if (!key) return problem(401, 'authentication_error', 'x-api-key header is required');
  if (key === 'wrong-key') return problem(401, 'authentication_error', 'invalid x-api-key');
  if (!headers['anthropic-version']) return problem(400, 'invalid_request_error', 'anthropic-version header is required');
  if (typeof body?.model !== 'string' || !body.model) return problem(400, 'invalid_request_error', 'model: Field required');
  if (!Number.isInteger(body.max_tokens) || body.max_tokens < 1) return problem(400, 'invalid_request_error', 'max_tokens: Field required');
  if (!Array.isArray(body.messages) || body.messages.length === 0) return problem(400, 'invalid_request_error', 'messages: at least one message is required');

  const userText = body.messages.map((m) => textOf(m.content)).join('\n');
  const out = reply(body, userText);

  // Usage numbers. A block marked cache_control is cached the first time it's seen, then read back for a tenth of the price.
  const systemBlocks = Array.isArray(body.system) ? body.system : body.system ? [{ type: 'text', text: body.system }] : [];
  const cacheable = systemBlocks.filter((b) => b.cache_control).map((b) => b.text).join('\n');
  const totalInput = approxTokens(body.system) + approxTokens(body.messages);
  const usage = { input_tokens: totalInput, output_tokens: out.outputTokens ?? approxTokens(out.text ?? ''), cache_creation_input_tokens: 0, cache_read_input_tokens: 0 };
  if (cacheable) {
    const id = createHash('sha256').update(`${body.model}:${cacheable}`).digest('hex');
    const cachedTokens = approxTokens(cacheable);
    usage.input_tokens = totalInput - cachedTokens;
    if (cachedPrefixes.has(id)) usage.cache_read_input_tokens = cachedTokens;
    else {
      cachedPrefixes.add(id);
      usage.cache_creation_input_tokens = cachedTokens;
    }
  }

  return {
    status: 200,
    body: {
      id: `msg_mock_${String(++counter).padStart(4, '0')}`,
      type: 'message',
      role: 'assistant',
      model: body.model,
      content: out.text === null ? [] : [{ type: 'text', text: out.text }],
      stop_reason: out.stop,
      stop_sequence: null,
      stop_details: out.stop === 'refusal' ? { type: 'refusal', category: null, explanation: 'The mock declined this request on purpose.' } : null,
      usage,
    },
  };
}

/** POST /v1/messages/count_tokens */
export function mockCountTokens(headers, body) {
  if (!keyFrom(headers) || keyFrom(headers) === 'wrong-key') return problem(401, 'authentication_error', 'invalid x-api-key');
  if (typeof body?.model !== 'string' || !Array.isArray(body.messages)) return problem(400, 'invalid_request_error', 'model and messages are required');
  return { status: 200, body: { input_tokens: approxTokens(body.system) + approxTokens(body.messages) } };
}
