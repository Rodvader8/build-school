import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { createClaude, MODEL } from '@/lib/claude.js';
import { PlanSchema } from '@/lib/schema.js';

const SYSTEM = 'You plan small events for Harbour Hall. Turn the enquiry into a practical plan: a schedule with 24-hour times, a budget in Australian dollars and a short note.';

// Why the plan couldn't be used. kind is one of: refused, truncated, malformed, invalid.
export class PlanError extends Error {
  constructor(kind, message, issues = []) {
    super(message);
    this.kind = kind;
    this.issues = issues;
  }
}

export async function generatePlan(brief) {
  const claude = createClaude();
  const message = await claude.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: SYSTEM,
    // Asks the API to constrain the reply to this JSON Schema. It makes bad output rare, never impossible, so we still check it below.
    output_config: { format: zodOutputFormat(PlanSchema) },
    messages: [{ role: 'user', content: brief }],
  });

  // 1. Did the model finish the job? Check stop_reason before reading anything.
  if (message.stop_reason === 'refusal') throw new PlanError('refused', 'Claude declined to write this plan.');
  if (message.stop_reason === 'max_tokens') throw new PlanError('truncated', 'The plan was cut off before it finished.');

  // 2. Is it JSON at all?
  const text = message.content.filter((block) => block.type === 'text').map((block) => block.text).join('');
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new PlanError('malformed', 'The reply was not valid JSON.');
  }

  // 3. Is it the right shape? safeParse reports problems instead of throwing.
  const result = PlanSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
    throw new PlanError('invalid', 'The plan had the wrong shape.', issues);
  }
  return result.data;
}
