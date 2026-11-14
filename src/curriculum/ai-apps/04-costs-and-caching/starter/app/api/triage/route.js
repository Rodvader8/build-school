import Anthropic from '@anthropic-ai/sdk';
import { triageEnquiry } from '@/lib/triage.js';
import { BudgetError } from '@/lib/budget.js';
import { MissingKeyError } from '@/lib/claude.js';

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const enquiry = typeof body?.enquiry === 'string' ? body.enquiry.trim() : '';
  if (!enquiry || enquiry.length > 2000) {
    return Response.json({ error: 'Send an enquiry of 1 to 2000 characters.' }, { status: 400 });
  }

  try {
    return Response.json(await triageEnquiry(enquiry));
  } catch (error) {
    if (error instanceof BudgetError) return Response.json({ error: 'That request is over the per-request spending limit.', kind: 'budget' }, { status: 422 });
    if (error instanceof MissingKeyError) return Response.json({ error: 'The server has no API key set.' }, { status: 500 });
    if (error instanceof Anthropic.APIError) return Response.json({ error: 'The AI service could not answer that just now.' }, { status: 502 });
    throw error;
  }
}
