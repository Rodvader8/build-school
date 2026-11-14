import { createClaude, MODEL } from '@/lib/claude.js';

const SYSTEM = 'You are the friendly front-of-house assistant for Harbour Hall, a small events venue. Answer in two or three sentences, and say so if you are not sure.';

// Send the question to Claude and return { answer, usage: { inputTokens, outputTokens } }.
// messages.create({ model, max_tokens, system, messages }) returns a message whose content is a list of blocks.
export async function askClaude(question) {
  throw new Error('askClaude is not written yet');
}
