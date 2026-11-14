import { createClaude, MODEL } from '@/lib/claude.js';

const SYSTEM = 'You are the friendly front-of-house assistant for Harbour Hall, a small events venue. Answer in two or three sentences, and say so if you are not sure.';

export async function askClaude(question) {
  const claude = createClaude();
  const message = await claude.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM,
    messages: [{ role: 'user', content: question }],
  });
  // content is a list of blocks, not a string. Keep the text ones.
  const answer = message.content.filter((block) => block.type === 'text').map((block) => block.text).join('');
  return { answer, usage: { inputTokens: message.usage.input_tokens, outputTokens: message.usage.output_tokens } };
}
