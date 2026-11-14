import { z } from 'zod';

// The shape of an event plan. This one schema tells Claude what to produce and checks what came back.
// It's too loose: a plan with no guests, or a schedule with "half past four" as a time, would pass.
// Make it strict: guests is a whole number of at least 1; schedule is a non-empty list of
// { time: "HH:MM", activity }; budget is a list of { item, cost } with cost of 0 or more; notes is a string.
export const PlanSchema = z.object({
  title: z.string(),
  venue: z.string(),
  guests: z.number(),
  schedule: z.array(z.any()),
  budget: z.array(z.any()),
  notes: z.string().optional(),
});
