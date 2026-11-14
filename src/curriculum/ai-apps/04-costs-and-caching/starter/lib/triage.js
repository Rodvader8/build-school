import { createClaude } from '@/lib/claude.js';
import { chooseModel } from '@/lib/models.js';
import { costOf } from '@/lib/pricing.js';
import { guardBudget } from '@/lib/budget.js';
import { VENUE_GUIDE } from '@/lib/venue-guide.js';

// What one call cost, in plain numbers the page can show.
const summarise = (model, usage) => ({
  model,
  inputTokens: usage.input_tokens,
  outputTokens: usage.output_tokens,
  cacheWriteTokens: usage.cache_creation_input_tokens ?? 0,
  cacheReadTokens: usage.cache_read_input_tokens ?? 0,
  usd: costOf(model, usage),
});

const textOf = (message) => message.content.filter((block) => block.type === 'text').map((block) => block.text).join('').trim();

/** Step 1 (cheap): file the enquiry under wedding, corporate or other. Step 2 (worth it): draft the reply. */
export async function triageEnquiry(enquiry) {
  const claude = createClaude();

  const classifyModel = chooseModel('classify');
  const classified = await claude.messages.create({
    model: classifyModel,
    max_tokens: 256, // thinking tokens count towards this, so don't squeeze it too hard
    output_config: { effort: 'low' },
    system: 'Classify the venue enquiry as exactly one category: wedding, corporate or other. Reply with that one word and nothing else.',
    messages: [{ role: 'user', content: enquiry }],
  });
  const word = textOf(classified).toLowerCase();
  const category = ['wedding', 'corporate'].includes(word) ? word : 'other';

  const planModel = chooseModel('plan');
  // TODO 1: make system an array of one text block holding VENUE_GUIDE, with cache_control: { type: 'ephemeral' },
  //         so the handbook is cached and only the first request pays full price for it.
  // TODO 2: before sending, await guardBudget(claude, params) so an expensive request is refused first.
  const params = {
    model: planModel,
    max_tokens: 1500,
    system: VENUE_GUIDE,
    messages: [{ role: 'user', content: `Category: ${category}\n\nEnquiry: ${enquiry}\n\nWrite the reply.` }],
  };
  const drafted = await claude.messages.create(params);

  const steps = { classify: summarise(classifyModel, classified.usage), plan: summarise(planModel, drafted.usage) };
  return { category, reply: textOf(drafted), usage: steps, totalUsd: steps.classify.usd + steps.plan.usd };
}
