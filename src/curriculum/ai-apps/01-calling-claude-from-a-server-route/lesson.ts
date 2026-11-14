import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Calling Claude from a server route',
  minutes: 45,
  kind: 'project',
  entry: 'lib/claude.js',
  checkEntry: 'check.mjs',
  devPort: 4861,
  devCommand: 'npm run dev -- --port 4861 --hostname 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'the client reads the key and address from the environment',
    'a missing key gives a clear error instead of a mystery',
    'sends the model, a token limit, a system prompt and the question',
    'returns the answer text and the token usage',
    'a good question returns 200 with the answer',
    'an empty, missing or oversized question returns 400 and calls nothing',
    'a rejected key becomes a safe 502 that leaks nothing',
    'with no key set the route returns 500 and says so',
    'the site builds',
    'the build includes the /api/ask route',
    'the API key is read from the environment, never typed in the code',
    '.env.example documents the key with a fake value, and .env is ignored',
    'the key can never reach the browser',
  ]),
  hints: [
    'In createClaude, read const apiKey = process.env.ANTHROPIC_API_KEY, throw new MissingKeyError(...) when it is empty, then return new Anthropic({ apiKey, baseURL: process.env.CLAUDE_BASE_URL || "https://api.anthropic.com" }).',
    'A message from Claude has content: an array of blocks like { type: "text", text: "..." }. Filter for type === "text", map to .text and join. Usage is message.usage.input_tokens and message.usage.output_tokens.',
    'The route is export async function POST(request). Parse with await request.json().catch(() => null), check the question, then try { return Response.json(await askClaude(question)) } and catch MissingKeyError (500) and Anthropic.APIError (502) separately.',
  ],
} satisfies LessonMeta;
