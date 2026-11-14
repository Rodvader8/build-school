import { z } from 'zod';

// The shape of an event plan. This one schema does three jobs: it tells Claude what to produce,
// it checks what came back, and it documents the data for the rest of the app.
export const PlanSchema = z.object({
  title: z.string().min(3),
  venue: z.string().min(1),
  guests: z.number().int().min(1),
  schedule: z.array(z.object({ time: z.string().regex(/^\d{2}:\d{2}$/, 'use 24-hour HH:MM'), activity: z.string().min(1) })).min(1),
  budget: z.array(z.object({ item: z.string().min(1), cost: z.number().min(0) })),
  notes: z.string(),
});
