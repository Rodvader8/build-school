import Anthropic from '@anthropic-ai/sdk';

export const MODEL = 'claude-opus-5-5';

export class MissingKeyError extends Error {}

// The only place that creates the client.
// Problem: the key and address are typed straight into the code, so they'd be committed and shared.
// Read ANTHROPIC_API_KEY (and CLAUDE_BASE_URL) from process.env instead, and throw a MissingKeyError when the key is empty.
export function createClaude() {
  return new Anthropic({ apiKey: 'test-key-not-real', baseURL: 'http://127.0.0.1:4861/mock' });
}
