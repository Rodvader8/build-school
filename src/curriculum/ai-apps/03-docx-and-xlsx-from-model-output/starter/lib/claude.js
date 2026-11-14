import Anthropic from '@anthropic-ai/sdk';

export const MODEL = 'claude-opus-5-5';

export class MissingKeyError extends Error {}

// The only place that creates the client. The key is read from the environment each time, so it never appears in the code.
export function createClaude() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new MissingKeyError('ANTHROPIC_API_KEY is not set. Copy .env.example to .env and restart the dev server.');
  // CLAUDE_BASE_URL points at the local pretend API in .env.example. Leave it empty to use the real one.
  // It's our own variable name on purpose: if your shell already sets ANTHROPIC_BASE_URL for some other tool, this project mustn't pick it up by accident.
  return new Anthropic({ apiKey, baseURL: process.env.CLAUDE_BASE_URL || 'https://api.anthropic.com' });
}
