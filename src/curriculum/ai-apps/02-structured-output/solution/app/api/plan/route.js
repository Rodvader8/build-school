import Anthropic from '@anthropic-ai/sdk';
import { generatePlan, PlanError } from '@/lib/plan.js';
import { MissingKeyError } from '@/lib/claude.js';

// Each kind of failure gets its own status, so the page can say something useful.
const STATUS = { refused: 422, truncated: 502, malformed: 502, invalid: 502 };

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const brief = typeof body?.brief === 'string' ? body.brief.trim() : '';
  if (!brief || brief.length > 2000) {
    return Response.json({ error: 'Describe the event in 1 to 2000 characters.' }, { status: 400 });
  }

  try {
    return Response.json({ plan: await generatePlan(brief) });
  } catch (error) {
    if (error instanceof PlanError) {
      return Response.json({ error: error.message, kind: error.kind, issues: error.issues }, { status: STATUS[error.kind] });
    }
    if (error instanceof MissingKeyError) return Response.json({ error: 'The server has no API key set.' }, { status: 500 });
    if (error instanceof Anthropic.APIError) return Response.json({ error: 'The AI service could not answer that just now.' }, { status: 502 });
    throw error;
  }
}
