import Anthropic from '@anthropic-ai/sdk';
import { askClaude } from '@/lib/ask.js';
import { MissingKeyError } from '@/lib/claude.js';

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const question = typeof body?.question === 'string' ? body.question.trim() : '';
  if (!question || question.length > 500) {
    return Response.json({ error: 'Ask a question of 1 to 500 characters.' }, { status: 400 });
  }

  try {
    return Response.json(await askClaude(question));
  } catch (error) {
    // Say what happened in plain words. Never pass the raw error on: it can mention headers and settings.
    if (error instanceof MissingKeyError) return Response.json({ error: 'The server has no API key set.' }, { status: 500 });
    if (error instanceof Anthropic.APIError) return Response.json({ error: 'The AI service could not answer that just now.' }, { status: 502 });
    throw error;
  }
}
