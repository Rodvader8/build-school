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

// Works on a good day and crashes or lies on a bad one. Add the three checks the lesson describes:
//   1. stop_reason "refusal" -> throw PlanError('refused', ...); "max_tokens" -> throw PlanError('truncated', ...)
//   2. JSON.parse failing -> PlanError('malformed', ...)
//   3. PlanSchema.safeParse(data) failing -> PlanError('invalid', ..., issues) where issues are strings like "guests: Invalid input"
export async function generatePlan(brief) {
  const claude = createClaude();
  const message = await claude.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: SYSTEM,
    output_config: { format: zodOutputFormat(PlanSchema) },
    messages: [{ role: 'user', content: brief }],
  });
  const text = message.content.filter((block) => block.type === 'text').map((block) => block.text).join('');
  return JSON.parse(text);
}
